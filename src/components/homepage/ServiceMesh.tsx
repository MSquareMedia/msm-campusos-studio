"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ArrowUpRight, CaretRight, Graph, Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { usePrefersReducedMotion } from "@/lib/motion";
import {
  serviceTree as defaultTree,
  serviceDepthLabel,
  type ServiceTreeNode,
} from "@/content/services";

/**
 * The services taxonomy as a living knowledge graph.
 *
 * Four levels, solution → service → capability → deliverable, held in one
 * slowly drifting mesh. Level 1 is the same five solutions the header mega
 * menu lists, and each one links through to its /solutions/[slug]
 * page, so the mesh is a second rendering of the site's own taxonomy rather
 * than a parallel one.
 *
 * ---------------------------------------------------------------------------
 * RESTING STATE
 * ---------------------------------------------------------------------------
 * The mesh opens collapsed: the hub and the five solutions, nothing else,
 * so the first thing a visitor sees is the shape of the offer rather than
 * every service at once. Opening a solution reveals its services; drilling
 * into a service reveals its capabilities, then deliverables, one branch
 * open at a time.
 *
 * Two pieces of state, deliberately separate:
 *   openTop, which solutions show their services. None, at rest.
 *   drill, [serviceId?, capabilityId?]. One branch open per level.
 *
 * Escape unwinds `drill` one level at a time; once that is empty it collapses
 * `openTop` back to the resting hub-and-spoke view.
 *
 * ---------------------------------------------------------------------------
 * WHY DOM + SVG AND NOT CANVAS
 * ---------------------------------------------------------------------------
 * Canvas is the cheaper renderer and this repo already has canvas prior art
 * (OrbAvatar, NetworkCanvas). It is the wrong tool *here* for one reason:
 * a canvas has no accessibility tree and no focus. The brief requires every
 * node to be reachable and operable by keyboard, with visible focus and a
 * correct `aria-expanded`, which on canvas means maintaining a second,
 * invisible DOM of buttons and hand-syncing its geometry to the painted
 * pixels. Two sources of truth for hit-testing is exactly how these things
 * rot.
 *
 * So the nodes are real elements, a <button> that expands, plus, at level 1,
 * a real <a> to the solution page, and only the *edges* are painted, as
 * three <path> elements in one SVG. That keeps the per-frame cost honest:
 *
 *   3 × setAttribute("d")        for every edge in the mesh
 *   1 × style.transform per node for ~20 visible nodes
 *
 * and zero React renders per frame. Per-frame values live in refs, exactly
 * as OrbAvatar does; React state changes only when a human clicks something.
 *
 * ---------------------------------------------------------------------------
 * DEGRADATION
 * ---------------------------------------------------------------------------
 * The list/mesh decision is made in CSS, not JavaScript, so there is no
 * hydration correction and no first-paint flash. `display: none` also removes
 * the hidden branch from the accessibility tree, so a screen reader is never
 * offered the same taxonomy twice and there is never a duplicate tab stop.
 *
 *   coarse pointer or < 1180px → nested disclosure list, 4 levels, no mesh
 *   prefers-reduced-motion     → mesh stays, drift and expand tweens do not
 *
 * Both fallbacks share one state model with the mesh, so nothing is
 * explorable in one and unreachable in the other.
 */

/** Must stay identical to the media query in the scoped stylesheet below. */
const MESH_QUERY = "(min-width: 1180px) and (pointer: fine)";

const HUB_ID = "__hub";

/**
 * Ring radii per depth, as fractions of the stage's usable half-extent.
 *
 * TWO PROFILES, and the reason is arithmetic rather than taste. Fourteen
 * service chips need roughly 2,400px of tangential room; the ellipse only
 * offers that past about 0.8 of its half-extent. Four rings of chips need
 * roughly 400px of vertical room measured from the centre, and the stage only
 * has 430. Both cannot be true at once, so the mesh uses the whole field for
 * the services while they are all on show, and pulls them in to about half
 * radius once a branch is open, at which point only one solution's services
 * are on screen and they no longer need the outer ring.
 *
 * The vertical case is the binding one at every ring, because the stage is
 * much wider than it is tall. Every gap below was sized against it:
 * consecutive rings clear HALF_H[a] + HALF_H[b] + GAP at the top and bottom
 * of the ellipse, where there is least room, not just at the sides.
 */
const RING_REST = [0, 0.34, 0.80, 0, 0];
const RING_DRILL = [0, 0.28, 0.51, 0.775, 0.96];
/**
 * How far alternate services are pushed in and out of their ring, at rest.
 *
 * Only applied to a solution holding three or more services, and only at rest.
 * A stagger small enough not to disturb the ring spacing is also too small to
 * separate two vertically adjacent chips, so it is deliberately large: two
 * genuine sub-rings, 86px apart, which is what actually halves the tangential
 * demand. Under RING_DRILL there is no stagger at all, at most six chips
 * share that ring and it has room for them.
 */
const STAGGER_REST = 0.11;
/** A solution needs at least this many services before its fan is staggered. */
const STAGGER_MIN = 3;
/** Widest arc (radians) a set of children may fan across, per child depth. */
const MAX_SPREAD = [0, 0, 0, 1.6, 1.25];
/**
 * Fraction of a solution's angular slice its services are allowed to use.
 * The remainder is the gutter that keeps one solution's fan from reading as
 * part of the next one's.
 */
const SLICE_FILL = 0.88;
/**
 * Half-extents of a node's worst-case box per depth (index 0 is the hub),
 * i.e. the max-width and a two-line height, which several labels do reach.
 *
 * These are box half-extents rather than one circular radius on purpose. A
 * chip is wide and short; separating them by a single radius either lets two
 * side-by-side chips overlap (radius too small for the width) or shoves
 * vertically stacked ones absurdly far apart (radius too large for the
 * height). Anything that changes chip padding, font size, max-width, or the
 * default expansion state, which decides how many boxes have to coexist, has
 * to be re-measured against these or nodes will start touching.
 *
 * Verified against real rendered rects at 1180 / 1200 / 1400, both at rest
 * and fully drilled into the densest solution.
 */
const HALF_W = [50, 104, 81, 78, 74];
const HALF_H = [50, 38, 35, 32, 23];
/**
 * Minimum clear space between two node boxes.
 *
 * Deliberately larger than it needs to be at rest. Every node drifts by up to
 * DRIFT_MAX px, and two neighbours drifting in antiphase close twice that, so
 * a gap tuned to the static layout would let chips touch mid-drift. This is
 * the static gap plus that budget.
 */
const GAP = 18;
/** Peak drift displacement, px. Must stay under GAP / 2. */
const DRIFT_MAX = 4;
/** Keep the outermost ring clear of the stage edge. */
const EDGE_PAD_X = 104;
const EDGE_PAD_Y = 40;

const LERP = 0.13;
const ENTER_SCALE = 0.9;
const EXIT_MS = 260;

type Vis = {
  node: ServiceTreeNode;
  parentId: string;
  open: boolean;
  /** True when the node is the drilled branch or an ancestor of it. */
  onPath: boolean;
  children: Vis[];
};

type Placed = {
  id: string;
  depth: number;
  parentId: string | null;
  x: number;
  y: number;
  /** The ideal radial position, before relaxation. */
  ax: number;
  ay: number;
  phase: number;
};

type Anim = { x: number; y: number; s: number; o: number };

type Ghost = { id: string; name: string; depth: number; parentId: string };

/* -------------------------------------------------------------- utilities */

/** Stable per-node drift phase. Deterministic so the mesh looks the same on
 *  every visit rather than reshuffling on each mount. */
function hashPhase(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((h >>> 0) % 1000) / 1000 * Math.PI * 2;
}

/** Live media query. useSyncExternalStore rather than state-in-an-effect: the
 *  value gates the rAF loop only, never the rendered markup, so the server
 *  snapshot being `false` cannot produce a hydration mismatch. */
function useMatchMedia(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * The visible slice of the tree.
 *
 * Levels 1 and 2 are governed by `openTop`, at rest every solution is in it,
 * so every service is on screen. Levels 3 and 4 follow `drill`, one open
 * branch each, which is what keeps the node count readable.
 */
function buildVisible(
  tree: ServiceTreeNode[],
  openTop: string[],
  drill: string[],
): Vis[] {
  const walk = (nodes: ServiceTreeNode[], parentId: string, level: number, onPath: boolean): Vis[] =>
    nodes.map((node) => {
      const open = level === 0 ? openTop.includes(node.id) : drill[level - 1] === node.id;
      const mine = level === 0 ? onPath : open;
      return {
        node,
        parentId,
        open,
        onPath: mine,
        children: open ? walk(node.children, node.id, level + 1, mine) : [],
      };
    });
  return walk(tree, HUB_ID, 0, true);
}

function flatten(vis: Vis[], out: Vis[] = []): Vis[] {
  for (const v of vis) {
    out.push(v);
    flatten(v.children, out);
  }
  return out;
}

/**
 * Radial layout, then a relaxation pass.
 *
 * Level 1 does NOT get five equal fifths of the circle. Each solution's slice
 * is proportional to how many services it holds, so Demand & Media's six sit
 * in a wide fan and Strategy & Intelligence's one sits in a narrow one, and
 * every service ends up roughly outward from the solution that owns it. An
 * even five-way split would put six chips in a 72° wedge and one chip in
 * another, which reads as a bug rather than as a shape.
 *
 * Relaxation is deterministic and runs once per layout change, not per frame.
 */
function layout(vis: Vis[], w: number, h: number): Placed[] {
  // Any node at depth 3 means a branch is open, which is what decides the ring
  // profile, and, because opening one collapses the others, also means only
  // one solution has its services on screen.
  const drilled = vis.some((v) => v.children.some((c) => c.children.length > 0));
  const RING = drilled ? RING_DRILL : RING_REST;
  const stagger = drilled ? 0 : STAGGER_REST;
  const cx = w / 2;
  const cy = h / 2;
  const rx = Math.max(140, w / 2 - EDGE_PAD_X);
  const ry = Math.max(140, h / 2 - EDGE_PAD_Y);
  const mean = (rx + ry) / 2;

  const placed: Placed[] = [
    { id: HUB_ID, depth: 0, parentId: null, x: cx, y: cy, ax: cx, ay: cy, phase: 0 },
  ];

  const push = (item: Vis, depth: number, angle: number, f: number, parentId: string) => {
    const x = cx + Math.cos(angle) * rx * f;
    const y = cy + Math.sin(angle) * ry * f;
    placed.push({
      id: item.node.id,
      depth,
      parentId,
      x,
      y,
      ax: x,
      ay: y,
      phase: hashPhase(item.node.id),
    });
  };

  /** Depths 3 and 4: a compact fan hung off the parent's own angle. */
  const fan = (items: Vis[], depth: number, parentAngle: number, parentId: string) => {
    const n = items.length;
    if (n === 0) return;
    const radius = RING[depth] * mean;
    const needed = ((n - 1) * (2 * HALF_W[depth] + GAP)) / Math.max(1, radius);
    const spread = Math.min(MAX_SPREAD[depth], Math.max(0.4, needed));
    const step = n > 1 ? spread / (n - 1) : 0;
    const start = parentAngle - (step * (n - 1)) / 2;
    items.forEach((item, i) => {
      const angle = start + step * i;
      push(item, depth, angle, RING[depth], parentId);
      fan(item.children, depth + 1, angle, item.node.id);
    });
  };

  // Level 1: proportional slices. A solution with no visible services still
  // gets a slice of one, so collapsing one does not warp the whole wheel.
  const weightOf = (v: Vis) => Math.max(1, v.children.length);
  const total = vis.reduce((sum, v) => sum + weightOf(v), 0);
  const firstSpan = (weightOf(vis[0] ?? { children: [] } as unknown as Vis) / total) * Math.PI * 2;
  let acc = -Math.PI / 2 - firstSpan / 2;

  for (const item of vis) {
    const span = (weightOf(item) / total) * Math.PI * 2;
    const mid = acc + span / 2;
    push(item, 1, mid, RING[1], HUB_ID);

    const kids = item.children;
    const n = kids.length;
    if (n > 0) {
      const usable = span * SLICE_FILL;
      const split = n >= STAGGER_MIN ? stagger : 0;
      kids.forEach((kid, i) => {
        const angle = n === 1 ? mid : acc + span / 2 - usable / 2 + (usable * i) / (n - 1);
        const f = RING[2] + (i % 2 === 0 ? -split : split);
        push(kid, 2, angle, f, item.node.id);
        fan(kid.children, 3, angle, kid.node.id);
      });
    }
    acc += span;
  }

  /*
   * Relaxation: axis-aligned box separation, resolved along the axis of least
   * penetration so a pair that only just clips resolves sideways rather than
   * being flung apart. The hub has weight 0 (it is a fixed obstacle, never
   * pushed off centre) and level 1 barely yields, so opening a deep branch
   * cannot drag the outer ring out of shape. Levels 2 and below yield freely,
   * which is what lets an opening branch part the crowd around it instead of
   * landing on top of it. Each pass then pulls every node a little way back
   * toward its ideal radial position, which is what stops 240 passes of
   * pushing from slowly dissolving the structure.
   *
   * Deterministic, and it runs once per layout change, never per frame.
   */
  const weight = (depth: number) =>
    depth === 0 ? 0 : depth === 1 ? 0.22 : depth === 2 ? 0.8 : 1;

  /* Separation is run in two phases. The first keeps a pull back toward the
     ideal radial position, so the wheel survives 200-odd passes of shoving
     instead of slowly dissolving. The second drops that pull entirely, which
     is what actually drives residual penetration to zero: with the spring
     still attached, a crowded fan reaches an equilibrium where a few boxes
     are still clipping and simply stays there. Structure first, then a
     guarantee. */
  const separate = (pull: number) => {
    for (let i = 0; i < placed.length; i += 1) {
      for (let j = i + 1; j < placed.length; j += 1) {
        const a = placed[i];
        const b = placed[j];
        const wa = weight(a.depth);
        const wb = weight(b.depth);
        const totalW = wa + wb;
        if (totalW === 0) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const ox = HALF_W[a.depth] + HALF_W[b.depth] + GAP - Math.abs(dx);
        const oy = HALF_H[a.depth] + HALF_H[b.depth] + GAP - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        if (ox < oy) {
          const shift = (dx < 0 ? -1 : 1) * ox * 0.6;
          a.x -= shift * (wa / totalW);
          b.x += shift * (wb / totalW);
        } else {
          const shift = (dy < 0 ? -1 : 1) * oy * 0.6;
          a.y -= shift * (wa / totalW);
          b.y += shift * (wb / totalW);
        }
      }
    }
    for (let i = 1; i < placed.length; i += 1) {
      const p = placed[i];
      if (pull > 0) {
        p.x += (p.ax - p.x) * pull;
        p.y += (p.ay - p.y) * pull;
      }
      // The margin carries the drift budget as well as the box, because the
      // rAF loop displaces every node by up to DRIFT_MAX after layout has
      // finished and the clamp never gets to see it.
      const mx = HALF_W[p.depth] + DRIFT_MAX;
      const my = HALF_H[p.depth] + DRIFT_MAX;
      p.x = Math.min(w - mx, Math.max(mx, p.x));
      p.y = Math.min(h - my, Math.max(my, p.y));
    }
  };

  for (let pass = 0; pass < 220; pass += 1) separate(0.02);
  for (let pass = 0; pass < 160; pass += 1) separate(0);

  return placed;
}

/* ------------------------------------------------------------------ props */

export type ServiceMeshProps = {
  /** Defaults to the four-level taxonomy in `src/content/services.ts`. */
  tree?: ServiceTreeNode[];
  /** Section headline, one array entry per rendered line. */
  headlineLines?: string[];
  /** Short supporting sentence beside the headline. */
  standfirst?: string;
};

/* -------------------------------------------------------------- component */

export function ServiceMesh({
  tree = defaultTree,
  headlineLines = ["Every discipline,", "all the way down."],
  standfirst =
    "The same five solutions as the menu above. Open any one for its services, capabilities, and deliverables.",
}: ServiceMeshProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduced = usePrefersReducedMotion();
  const meshLive = useMatchMedia(MESH_QUERY);

  /** The resting state: every solution collapsed to the hub-and-spoke view,
   *  nothing expanded until a solution is opened. */
  const [openTop, setOpenTop] = useState<string[]>([]);
  const [drill, setDrill] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string>(HUB_ID);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLElement>());
  const ghostRefs = useRef(new Map<string, HTMLElement>());
  const animRef = useRef(new Map<string, Anim>());
  const edgeBaseRef = useRef<SVGPathElement>(null);
  const edgeBranchRef = useRef<SVGPathElement>(null);
  const edgeActiveRef = useRef<SVGPathElement>(null);
  const ghostTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visible = useMemo(() => buildVisible(tree, openTop, drill), [tree, openTop, drill]);
  const flat = useMemo(() => flatten(visible), [visible]);

  /** id → node, for the detail panel and the breadcrumb trail. */
  const index = useMemo(() => {
    const map = new Map<string, { node: ServiceTreeNode; parentId: string }>();
    const walk = (nodes: ServiceTreeNode[], parentId: string) => {
      for (const n of nodes) {
        map.set(n.id, { node: n, parentId });
        walk(n.children, n.id);
      }
    };
    walk(tree, HUB_ID);
    return map;
  }, [tree]);

  const trail = useMemo(() => {
    const out: ServiceTreeNode[] = [];
    let cursor = activeId;
    while (cursor !== HUB_ID) {
      const entry = index.get(cursor);
      if (!entry) break;
      out.unshift(entry.node);
      cursor = entry.parentId;
    }
    return out;
  }, [activeId, index]);

  const activeNode = activeId === HUB_ID ? null : (index.get(activeId)?.node ?? null);
  const activeSolution = activeNode?.depth === 1 ? activeNode : trail[0] ?? null;

  /* ------------------------------------------------------------ measuring */

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize((prev) =>
        Math.abs(prev.w - r.width) < 1 && Math.abs(prev.h - r.height) < 1
          ? prev
          : { w: r.width, h: r.height },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* -------------------------------------------------------------- layout */

  const placed = useMemo(
    () => (size.w > 0 && size.h > 0 ? layout(visible, size.w, size.h) : []),
    [visible, size.w, size.h],
  );

  /* --------------------------------------------------------- interaction */

  /** Everything that changes what is on screen goes through here, so the exit
   *  ghosts are computed in the event handler that caused them rather than in
   *  an effect reacting to the result. */
  const applyState = useCallback(
    (nextTop: string[], nextDrill: string[], nextActive: string) => {
      if (!reduced) {
        const after = new Set(
          flatten(buildVisible(tree, nextTop, nextDrill)).map((v) => v.node.id),
        );
        const leaving = flatten(buildVisible(tree, openTop, drill))
          .filter((v) => !after.has(v.node.id))
          .map((v) => ({
            id: v.node.id,
            name: v.node.name,
            depth: v.node.depth,
            parentId: v.parentId,
          }));
        // Set unconditionally, including to []. Reopening a branch inside the
        // exit window removes nothing, and an early return here would leave
        // the previous batch of ghosts, and its timer, still running over
        // the nodes that had just come back.
        setGhosts(leaving);
        if (ghostTimer.current) clearTimeout(ghostTimer.current);
        if (leaving.length > 0) {
          ghostTimer.current = setTimeout(() => setGhosts([]), EXIT_MS);
        }
      }
      setOpenTop(nextTop);
      setDrill(nextDrill);
      setActiveId(nextActive);
    },
    [reduced, tree, openTop, drill],
  );

  useEffect(() => () => {
    if (ghostTimer.current) clearTimeout(ghostTimer.current);
  }, []);

  const toggle = useCallback(
    (node: ServiceTreeNode, level: number) => {
      if (level === 0) {
        const isOpen = openTop.includes(node.id);
        if (isOpen) {
          // Closing a solution must take any drill that lived inside it with
          // it, or the mesh keeps painting an open branch with no parent.
          const inside = new Set(node.children.map((c) => c.id));
          const nextDrill = drill.length > 0 && inside.has(drill[0]) ? [] : drill;
          applyState(openTop.filter((id) => id !== node.id), nextDrill, node.id);
        } else {
          applyState([...openTop, node.id], drill, node.id);
        }
        return;
      }
      const i = level - 1;
      const isOpen = drill[i] === node.id;
      if (isOpen || node.children.length === 0) {
        const nextDrill = drill.slice(0, i);
        // Letting go of the last open branch returns to that solution's own
        // service list rather than collapsing it too, only Escape/the hub
        // button drop all the way back to the fully collapsed resting view.
        applyState(openTop, nextDrill, node.id);
      } else if (i === 0) {
        // Opening a service focuses its solution: the other four collapse back
        // to a single node. Not a flourish, four rings of chips and fourteen
        // service chips do not both fit, and something has to give. What gives
        // is the breadth the visitor has already read, in favour of the depth
        // they just asked for, and Escape gives it straight back.
        const owner = index.get(node.id)?.parentId;
        applyState(owner && owner !== HUB_ID ? [owner] : openTop, [node.id], node.id);
      } else {
        applyState(openTop, [...drill.slice(0, i), node.id], node.id);
      }
    },
    [applyState, index, openTop, drill],
  );

  const focusNode = useCallback((id: string) => {
    nodeRefs.current.get(id)?.querySelector("button")?.focus();
  }, []);

  /** Escape: one level back up the drill, then back to the resting state. */
  const collapseOne = useCallback(() => {
    if (drill.length > 0) {
      const next = drill.slice(0, -1);
      const parentId = drill.length > 1 ? drill[drill.length - 2] : index.get(drill[0])?.parentId;
      applyState(openTop, next, parentId ?? HUB_ID);
      if (parentId) focusNode(parentId);
      return;
    }
    if (openTop.length !== 0) {
      applyState([], [], HUB_ID);
      return;
    }
    setActiveId(HUB_ID);
  }, [applyState, drill, focusNode, index, openTop]);

  const resting = openTop.length === 0 && drill.length === 0;

  /* ---------------------------------------------------------- the loop */

  useEffect(() => {
    let raf = 0;
    const anim = animRef.current;

    const seed = (p: Placed) => {
      const existing = anim.get(p.id);
      if (existing) return existing;
      const parent = p.parentId ? anim.get(p.parentId) : undefined;
      const fresh: Anim = {
        x: parent?.x ?? p.x,
        y: parent?.y ?? p.y,
        s: reduced ? 1 : ENTER_SCALE,
        o: reduced ? 1 : 0,
      };
      anim.set(p.id, fresh);
      return fresh;
    };

    const paint = (time: number) => {
      const list = placed;
      if (list.length === 0) return;

      const live = new Set(list.map((p) => p.id));
      const branch: string[] = [];
      const base: string[] = [];
      const active: string[] = [];

      for (const p of list) {
        const a = seed(p);
        const drift = reduced || p.depth === 0 ? 0 : Math.min(DRIFT_MAX, 2 + p.depth);
        const tx = p.x + Math.sin(time * 0.00042 + p.phase) * drift;
        const ty = p.y + Math.cos(time * 0.00037 + p.phase * 1.7) * drift * 0.8;
        if (reduced) {
          a.x = tx;
          a.y = ty;
          a.s = 1;
          a.o = 1;
        } else {
          a.x += (tx - a.x) * LERP;
          a.y += (ty - a.y) * LERP;
          a.s += (1 - a.s) * LERP;
          a.o += (1 - a.o) * (LERP * 1.5);
        }
        const el = nodeRefs.current.get(p.id);
        if (el) {
          el.style.transform = `translate3d(${a.x.toFixed(2)}px, ${a.y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${a.s.toFixed(4)})`;
          el.style.opacity = a.o.toFixed(3);
        }
      }

      // Ghosts fall back toward the parent that swallowed them. Nothing in the
      // real world vanishes from full size, so they shrink to ENTER_SCALE and
      // fade rather than being cut.
      for (const g of ghosts) {
        // Belt and braces: a node that is both leaving and live is live.
        if (live.has(g.id)) continue;
        const a = anim.get(g.id);
        const parent = anim.get(g.parentId);
        if (!a) continue;
        const tx = parent?.x ?? a.x;
        const ty = parent?.y ?? a.y;
        a.x += (tx - a.x) * (LERP * 0.9);
        a.y += (ty - a.y) * (LERP * 0.9);
        a.s += (ENTER_SCALE - a.s) * LERP;
        a.o += (0 - a.o) * (LERP * 1.8);
        const el = ghostRefs.current.get(g.id);
        if (el) {
          el.style.transform = `translate3d(${a.x.toFixed(2)}px, ${a.y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${a.s.toFixed(4)})`;
          el.style.opacity = a.o.toFixed(3);
        }
      }

      // Edges are rebuilt from the animated positions, so the wiring follows
      // the drift instead of floating away from it. Strictly the tree and
      // nothing else: the old chord ring between the level-1 nodes was legible
      // on a dark ground and reads as a grey scribble on a light one.
      const seg = (from: string, to: string, into: string[]) => {
        const a = anim.get(from);
        const b = anim.get(to);
        if (!a || !b) return;
        into.push(`M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
      };

      for (const p of list) {
        if (p.depth === 1) seg(HUB_ID, p.id, base);
        else if (p.depth >= 2 && p.parentId) seg(p.parentId, p.id, branch);
      }

      if (activeId !== HUB_ID && live.has(activeId)) {
        let cursor = activeId;
        while (cursor !== HUB_ID) {
          const parent = index.get(cursor)?.parentId;
          if (!parent) break;
          seg(parent, cursor, active);
          cursor = parent;
        }
      }

      edgeBaseRef.current?.setAttribute("d", base.join(""));
      edgeBranchRef.current?.setAttribute("d", branch.join(""));
      edgeActiveRef.current?.setAttribute("d", active.join(""));

      // Nodes that left the mesh entirely stop costing anything.
      for (const key of anim.keys()) {
        if (!live.has(key) && !ghosts.some((g) => g.id === key)) anim.delete(key);
      }
    };

    if (!meshLive || placed.length === 0) return;

    if (reduced) {
      // One deterministic pass: the mesh is fully drawn and fully explorable,
      // it simply does not move.
      paint(0);
      return;
    }

    const tick = (time: number) => {
      paint(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [meshLive, reduced, placed, ghosts, activeId, index]);

  /* ------------------------------------------------------------ rendering */

  const registerNode = useCallback((id: string, el: HTMLElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  const renderGroup = (items: Vis[], level: number): React.ReactNode =>
    items.map((item) => {
      const { node } = item;
      const hasChildren = node.children.length > 0;
      const groupId = `${uid}-g-${node.id}`;
      const descId = `${uid}-d-${node.id}`;
      const dim = drill.length > 0 && !item.onPath && node.depth <= 2;
      return (
        <div key={node.id} className="mesh-branch">
          <span
            className="mesh-node"
            data-depth={node.depth}
            data-active={activeId === node.id || undefined}
            data-dim={dim || undefined}
            ref={(el) => registerNode(node.id, el)}
          >
            <button
              type="button"
              className="mesh-chip"
              data-open={item.open || undefined}
              aria-expanded={hasChildren ? item.open : undefined}
              aria-controls={hasChildren && item.open ? groupId : undefined}
              aria-describedby={descId}
              onClick={() => toggle(node, level)}
              onFocus={() => setActiveId(node.id)}
            >
              <span aria-hidden="true" className="mesh-dot" />
              <span className="mesh-label">{node.name}</span>
              {hasChildren && (
                <span aria-hidden="true" className="mesh-affordance">
                  {item.open ? <Minus size={10} weight="bold" /> : <Plus size={10} weight="bold" />}
                </span>
              )}
              <span className="sr-only">
                {", "}
                {serviceDepthLabel[node.depth]}
                {hasChildren ? `, ${node.children.length} inside` : ""}
              </span>
            </button>
            {node.href && (
              <a
                className="mesh-jump"
                href={node.href}
                onFocus={() => setActiveId(node.id)}
              >
                <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
                <span className="sr-only">{`Open the ${node.name} page`}</span>
              </a>
            )}
          </span>
          <span id={descId} className="sr-only">
            {node.description}
          </span>
          {item.open && hasChildren && (
            <div id={groupId} role="group" aria-label={node.name} className="mesh-group">
              {renderGroup(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });

  return (
    // No background of its own, see ModernServicesExplorer's note on why.
    <section
      className={`mesh-${uid} border-y`}
      style={{ borderColor: "var(--border)", color: "var(--text)" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.mesh-${uid} {
  /* One accent, and everything else derived from the page's own text colour so
     the section reads as part of the light page rather than a widget dropped
     on it, and so it survives the OS dark-mode token flip unchanged. */
  --mesh-line: color-mix(in oklab, var(--text) 14%, transparent);
  --mesh-line-strong: color-mix(in oklab, var(--text) 34%, transparent);
  --mesh-wire: color-mix(in oklab, var(--text) 24%, transparent);
  --mesh-wire-branch: color-mix(in oklab, var(--text) 30%, transparent);
  --mesh-wire-active: color-mix(in oklab, var(--brand-accent) 72%, transparent);
  --mesh-accent-wash: color-mix(in oklab, var(--brand-accent) 8%, var(--surface));
  /* Accent-as-TEXT, which the accent itself cannot do: #e8252a lands at 4.44:1
     on white and fails AA. The darkened brand red clears it at 5.7:1. */
  --mesh-accent-text: var(--brand-accent-dark);
}
@media (prefers-color-scheme: dark) {
  /* And the darkened red is worse than useless on a dark ground (3.1:1), so it
     lightens instead, the same move globals.css makes for --danger. */
  .mesh-${uid} { --mesh-accent-text: color-mix(in oklab, var(--brand-accent) 58%, white); }
}
.mesh-${uid} .mesh-stage { display: none; }
.mesh-${uid} .mesh-list { display: block; }
@media ${MESH_QUERY} {
  .mesh-${uid} .mesh-stage { display: block; }
  .mesh-${uid} .mesh-list { display: none; }
}

.mesh-${uid} .mesh-field {
  position: relative;
  height: clamp(720px, 86vh, 940px);
  isolation: isolate;
}
.mesh-${uid} .mesh-wires { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.mesh-${uid} .mesh-wire-base { stroke: var(--mesh-wire); stroke-width: 1; fill: none; }
.mesh-${uid} .mesh-wire-branch { stroke: var(--mesh-wire-branch); stroke-width: 1; fill: none; }
.mesh-${uid} .mesh-wire-active { stroke: var(--mesh-wire-active); stroke-width: 1.5; fill: none; }

.mesh-${uid} .mesh-group,
.mesh-${uid} .mesh-branch,
.mesh-${uid} .mesh-ghosts {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* The positioned shell. It owns the pill, border, fill, radius, so that a
   level-1 node can hold two controls (expand, and go to the page) inside one
   shape without them reading as two chips. The rAF loop writes transform and
   opacity here and nowhere else. */
.mesh-${uid} .mesh-node {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: auto;
  display: inline-flex;
  align-items: stretch;
  max-width: 168px;
  border-radius: 999px;
  border: 1px solid var(--mesh-line);
  background: var(--surface);
  opacity: 0;
  will-change: transform, opacity;
  transition: border-color 180ms var(--ease-out-strong),
    background-color 180ms var(--ease-out-strong);
}
/* The five solutions are the spine of the map, so they carry a tinted ground
   and a firmer hairline. Everything below them is a plain white pill: one
   step of emphasis, not four. */
.mesh-${uid} .mesh-node[data-depth="1"] {
  max-width: 202px;
  background: var(--surface-muted);
  border-color: color-mix(in oklab, var(--text) 22%, transparent);
}
.mesh-${uid} .mesh-node[data-depth="2"] { max-width: 156px; }
.mesh-${uid} .mesh-node[data-depth="3"] { max-width: 152px; }
.mesh-${uid} .mesh-node[data-depth="4"] { max-width: 144px; }

.mesh-${uid} .mesh-chip {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.85rem;
  border-radius: inherit;
  color: var(--text);
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.25;
  text-align: left;
  transition: color 180ms var(--ease-out-strong);
}
.mesh-${uid} .mesh-node[data-depth="1"] .mesh-chip {
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.58rem 0.5rem 0.58rem 0.9rem;
}
.mesh-${uid} .mesh-node[data-depth="1"] .mesh-dot { width: 6px; height: 6px; }
.mesh-${uid} .mesh-node[data-depth="3"] .mesh-chip { font-size: 0.75rem; padding: 0.44rem 0.75rem; }
.mesh-${uid} .mesh-node[data-depth="4"] .mesh-chip {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.38rem 0.7rem;
  color: var(--text-muted);
}

/* Dimming is a contrast step, not a disappearance: --text-muted still clears
   AA on --surface, so an off-path node stays readable while it recedes. */
.mesh-${uid} .mesh-node[data-dim] { border-color: color-mix(in oklab, var(--text) 9%, transparent); }
.mesh-${uid} .mesh-node[data-dim] .mesh-chip { color: var(--text-muted); }

@media (hover: hover) and (pointer: fine) {
  .mesh-${uid} .mesh-node:hover { border-color: var(--mesh-line-strong); background: var(--surface-muted); }
  .mesh-${uid} .mesh-node:hover .mesh-chip { color: var(--text); }
}
.mesh-${uid} .mesh-node:focus-within { border-color: var(--mesh-line-strong); }
.mesh-${uid} .mesh-node[data-active] {
  border-color: var(--brand-accent);
  background: var(--mesh-accent-wash);
}
.mesh-${uid} .mesh-node[data-active] .mesh-chip { color: var(--text); }
.mesh-${uid} .mesh-chip[data-open] .mesh-dot { background: var(--brand-accent); }
.mesh-${uid} .mesh-chip:active { transform: scale(0.97); }

.mesh-${uid} .mesh-dot {
  flex: 0 0 auto;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--text) 34%, transparent);
  transition: background-color 180ms var(--ease-out-strong);
}
.mesh-${uid} .mesh-label { min-width: 0; }
.mesh-${uid} .mesh-affordance {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  color: var(--text-muted);
}

/* Level 1 only: the through-link to /solutions/[slug]. Split off the
   label by a hairline so it is obviously a second target, not a decoration. */
.mesh-${uid} .mesh-jump {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  border-left: 1px solid var(--mesh-line);
  border-radius: 0 999px 999px 0;
  color: var(--text-muted);
  transition: color 180ms var(--ease-out-strong), background-color 180ms var(--ease-out-strong);
}
@media (hover: hover) and (pointer: fine) {
  .mesh-${uid} .mesh-jump:hover { color: var(--text); background: var(--mesh-accent-wash); }
}

.mesh-${uid} .mesh-hub {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  width: 96px;
  height: 96px;
  justify-content: center;
  border-radius: 999px;
  color: var(--text);
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.mesh-${uid} .mesh-node-hub {
  max-width: none;
  border-color: color-mix(in oklab, var(--brand-accent) 42%, transparent);
}
.mesh-${uid} .mesh-node-hub .mesh-hub-icon { color: var(--brand-accent); }
@media (hover: hover) and (pointer: fine) {
  .mesh-${uid} .mesh-node-hub:hover { border-color: var(--brand-accent); background: var(--mesh-accent-wash); }
}

.mesh-${uid} .mesh-ghost-chip { opacity: 0; pointer-events: none; }
.mesh-${uid} .mesh-panel-body { min-height: 6.5rem; }

/* --------------------------------------------------------------- list --- */
.mesh-${uid} .mesh-row {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 0;
  text-align: left;
  color: inherit;
  transition: color 180ms var(--ease-out-strong);
}
.mesh-${uid} .mesh-row-caret {
  flex: 0 0 auto;
  margin-top: 0.15rem;
  color: var(--text-muted);
  transition: transform 200ms var(--ease-out-strong), color 180ms var(--ease-out-strong);
}
.mesh-${uid} .mesh-row[aria-expanded="true"] .mesh-row-caret {
  transform: rotate(90deg);
  color: var(--brand-accent);
}
.mesh-${uid} .mesh-row:active { transform: scale(0.985); }
.mesh-${uid} .mesh-sublist {
  margin-left: 0.6rem;
  padding-left: 1rem;
  border-left: 1px solid var(--border);
}

@media (prefers-reduced-motion: reduce) {
  .mesh-${uid} .mesh-node,
  .mesh-${uid} .mesh-chip,
  .mesh-${uid} .mesh-jump,
  .mesh-${uid} .mesh-row,
  .mesh-${uid} .mesh-row-caret { transition: none; }
  .mesh-${uid} .mesh-chip:active,
  .mesh-${uid} .mesh-row:active { transform: none; }
}`,
        }}
      />

      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: `.mesh-${uid} .mesh-stage { display: none !important; }
.mesh-${uid} .mesh-list { display: block !important; }`,
          }}
        />
      </noscript>

      <div className="container-page py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TextReveal
            lines={headlineLines}
            className="font-display max-w-2xl text-3xl font-extrabold leading-[1.06] tracking-tight md:text-5xl"
          />
          <FadeUp delay={0.15}>
            <p className="max-w-xs text-sm" style={{ color: "var(--text-muted)" }}>
              {standfirst}
            </p>
          </FadeUp>
        </div>

        {/* ------------------------------------------------------------ mesh */}
        <div className="mesh-stage mt-12">
          <div
            ref={stageRef}
            className="mesh-field"
            onKeyDown={(e) => {
              if (e.key === "Escape" && !resting) {
                e.stopPropagation();
                collapseOne();
              }
            }}
          >
            <svg
              aria-hidden="true"
              className="mesh-wires"
              width={size.w || undefined}
              height={size.h || undefined}
              viewBox={size.w > 0 ? `0 0 ${size.w} ${size.h}` : undefined}
            >
              <path ref={edgeBaseRef} className="mesh-wire-base" d="" />
              <path ref={edgeBranchRef} className="mesh-wire-branch" d="" />
              <path ref={edgeActiveRef} className="mesh-wire-active" d="" />
            </svg>

            <div role="group" aria-label="Services mesh" className="mesh-group">
              <span
                className="mesh-node mesh-node-hub"
                data-depth={0}
                ref={(el) => registerNode(HUB_ID, el)}
              >
                <button
                  type="button"
                  className="mesh-hub"
                  onClick={() => applyState([], [], HUB_ID)}
                  onFocus={() => setActiveId(HUB_ID)}
                >
                  <Graph size={20} weight="duotone" aria-hidden="true" className="mesh-hub-icon" />
                  <span>All services</span>
                  <span className="sr-only">, collapse the map back to the five solutions</span>
                </button>
              </span>
              {renderGroup(visible, 0)}
            </div>

            {/* Nodes on their way out. Decorative only: they are already gone
                from the accessible tree, they are just still on screen. */}
            <div aria-hidden="true" className="mesh-ghosts">
              {ghosts.map((g) => (
                <span
                  key={g.id}
                  ref={(el) => {
                    if (el) ghostRefs.current.set(g.id, el);
                    else ghostRefs.current.delete(g.id);
                  }}
                  className="mesh-node mesh-ghost-chip"
                  data-depth={g.depth}
                >
                  <span className="mesh-chip">
                    <span className="mesh-dot" />
                    <span className="mesh-label">{g.name}</span>
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div
            className="mt-6 flex flex-wrap items-start gap-x-10 gap-y-4 border-t pt-6"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="mesh-panel-body min-w-0 flex-1" aria-hidden="true">
              <p className="eyebrow" style={{ color: "var(--mesh-accent-text)" }}>
                {activeNode ? serviceDepthLabel[activeNode.depth] : "The whole map"}
              </p>
              <p className="font-display mt-2 text-2xl font-bold leading-[1.15]">
                {activeNode ? activeNode.name : `${flat.length} nodes open, four levels deep`}
              </p>
              {trail.length > 1 && (
                <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  {trail.slice(0, -1).map((t) => t.name).join("  ›  ")}
                </p>
              )}
              <p
                className="mt-3 max-w-2xl text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {activeNode ? activeNode.description : standfirst}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              {activeSolution?.href && (
                <a
                  className="font-display inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--mesh-accent-text)]"
                  href={activeSolution.href}
                >
                  {`Explore ${activeSolution.name}`}
                  <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
                </a>
              )}
              <p aria-hidden="true" className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Click or press Enter on a node to open it.
                <br />
                Escape closes the deepest open level.
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ list */}
        <div className="mesh-list mt-10">
          <MeshList
            nodes={tree}
            level={0}
            openTop={openTop}
            drill={drill}
            uid={uid}
            onToggle={toggle}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- list view */

function MeshList({
  nodes,
  level,
  openTop,
  drill,
  uid,
  onToggle,
}: {
  nodes: ServiceTreeNode[];
  level: number;
  openTop: string[];
  drill: string[];
  uid: string;
  onToggle: (node: ServiceTreeNode, level: number) => void;
}) {
  return (
    <ul className={level === 0 ? "" : "mesh-sublist"}>
      {nodes.map((node) => {
        const open = level === 0 ? openTop.includes(node.id) : drill[level - 1] === node.id;
        const hasChildren = node.children.length > 0;
        const groupId = `${uid}-l-${node.id}`;
        return (
          <li
            key={node.id}
            className={level === 0 ? "border-t first:border-t-0" : ""}
            style={level === 0 ? { borderColor: "var(--border)" } : undefined}
          >
            <button
              type="button"
              className="mesh-row"
              aria-expanded={hasChildren ? open : undefined}
              aria-controls={hasChildren && open ? groupId : undefined}
              onClick={() => onToggle(node, level)}
            >
              <CaretRight
                size={14}
                weight="bold"
                aria-hidden="true"
                className="mesh-row-caret"
                style={{ opacity: hasChildren ? 1 : 0.25 }}
              />
              <span className="min-w-0">
                <span
                  className="font-display block font-semibold"
                  style={{
                    fontSize: level === 0 ? "1rem" : level === 3 ? "0.8125rem" : "0.875rem",
                  }}
                >
                  {node.name}
                </span>
                <span
                  className="mt-1 block text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {node.description}
                </span>
              </span>
            </button>
            {open && hasChildren && (
              <div id={groupId} className="pb-3">
                {node.href && (
                  <a
                    className="font-display mb-2 inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--mesh-accent-text)]"
                    href={node.href}
                  >
                    {`Explore ${node.name}`}
                    <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
                  </a>
                )}
                <MeshList
                  nodes={node.children}
                  level={level + 1}
                  openTop={openTop}
                  drill={drill}
                  uid={uid}
                  onToggle={onToggle}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
