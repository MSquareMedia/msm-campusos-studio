"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

export type OrbState =
  | "idle"
  | "listening"
  | "thinking"
  | "creating"
  | "insight"
  | "speaking";

/**
 * OSiQ's face, such as it is.
 *
 * Deliberately not eyes and a mouth. A marketing intelligence that blinks at a
 * CMO reads as a toy; the brief is something that looks like it is computing,
 * not something pretending to be alive. So the personality is carried entirely
 * by a node lattice and how it behaves per state:
 *
 *   listening → a ring expands outward from the rim, on a slow repeat
 *   thinking  → nodes accelerate and wire up to their nearest neighbours
 *   creating  → the lattice pushes apart, then reforms
 *   insight   → one node ignites in the brand red
 *   speaking  → a waveform traces the circumference
 *
 * Canvas rather than SVG or DOM: the lattice is ~48 points with per-frame
 * neighbour tests, and doing that as elements would mean 48 style
 * recalculations a frame. One canvas is one composite.
 *
 * Palette is fixed rather than token-driven on purpose. This is a lit object,
 * not a page surface, the graphite core and the white rim light have to stay
 * put when the surrounding page flips to dark mode, or the sphere stops
 * reading as a sphere.
 */

const NODE_COUNT = 72;
const ACCENT = "232, 37, 42"; // --brand-accent, as rgb parts for alpha use

type Node = { x: number; y: number; z: number };

/** Fibonacci sphere: even coverage without the clustering you get at the poles
 *  from naive lat/long sampling. */
function buildNodes(count: number): Node[] {
  const nodes: Node[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    nodes.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius });
  }
  return nodes;
}

export function OrbAvatar({
  state = "idle",
  size = 96,
  className = "",
}: {
  state?: OrbState;
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  // Read state from a ref inside the loop so a state change never restarts the
  // animation, restarting would snap the rotation back to zero and read as a
  // stutter every time OSiQ starts thinking.
  const stateRef = useRef<OrbState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cap DPR at 2: beyond that the extra pixels are invisible at this size and
    // just cost fill rate on phones.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const nodes = buildNodes(NODE_COUNT);
    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.42;

    let frame = 0;
    let raf = 0;
    let rotation = 0;
    // Eased toward its target each frame so state changes glide instead of
    // cutting: the difference between a machine reacting and a machine lurching.
    let energy = 0;
    let burst = 0;

    function draw() {
      const s = stateRef.current;
      const targetEnergy =
        s === "thinking" ? 1 : s === "creating" ? 0.85 : s === "speaking" ? 0.5 : s === "listening" ? 0.35 : 0.12;
      energy += (targetEnergy - energy) * 0.06;
      burst += ((s === "creating" ? 1 : 0) - burst) * 0.05;

      rotation += 0.0016 + energy * 0.006;
      frame += 1;

      ctx!.clearRect(0, 0, size, size);

      /* ---------------------------------------------------- outer glass ---- */
      const shell = ctx!.createRadialGradient(
        cx - R * 0.35,
        cy - R * 0.4,
        R * 0.05,
        cx,
        cy,
        R
      );
      // Graphite through the body, brightening hard at the rim. The dark is
      // carried all the way out to the silhouette rather than sitting in a
      // disc inside a pale ring, which is the specific arrangement that reads
      // as an iris. What is left is a dark glass sphere with a lit edge.
      shell.addColorStop(0, "rgba(96,98,108,0.96)");
      shell.addColorStop(0.45, "rgba(58,59,68,0.97)");
      shell.addColorStop(0.86, "rgba(38,39,46,0.98)");
      shell.addColorStop(1, "rgba(150,152,162,0.95)");
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.fillStyle = shell;
      ctx!.fill();

      /* ------------------------------------------------- graphite centre --- */
      // There is no painted core. Every earlier attempt at one read as a
      // pupil: a dark disc centred inside a light ring is an eye, whatever the
      // gradient does. The "dark graphite centre" the brief asks for is
      // produced instead by the lattice itself, the sphere's own points are
      // densest through the middle under perspective, so drawing them in
      // graphite builds a dark structured mass with an irregular edge. It
      // reads as a knot of wiring, which is the intended idea, rather than as
      // something looking back at you.
      //
      // All that is painted here is ordinary lit-sphere shading: light from
      // the upper left, shadow bottom-right, no concentric anything.
      const shade = ctx!.createLinearGradient(
        cx - R * 0.5,
        cy - R * 0.7,
        cx + R * 0.6,
        cy + R * 0.9
      );
      shade.addColorStop(0, "rgba(255,255,255,0.14)");
      shade.addColorStop(0.55, "rgba(80,82,94,0.06)");
      shade.addColorStop(1, "rgba(8,8,12,0.42)");
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.fillStyle = shade;
      ctx!.fill();

      // Specular highlight, upper left, opposite the shaded mass. This is what
      // sells "lit sphere" and is the other half of not reading as an eye.
      const spec = ctx!.createRadialGradient(
        cx - R * 0.42,
        cy - R * 0.46,
        0,
        cx - R * 0.42,
        cy - R * 0.46,
        R * 0.7
      );
      spec.addColorStop(0, "rgba(255,255,255,0.30)");
      spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.fillStyle = spec;
      ctx!.fill();

      /* -------------------------------------------------------- lattice ---- */
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);
      const tilt = Math.sin(rotation * 0.5) * 0.28;
      // Creating pushes the lattice apart; the sphere visibly comes apart and
      // knits back together rather than just speeding up.
      const spread = 1 + burst * (0.22 + Math.sin(frame * 0.05) * 0.1);

      const projected = nodes.map((n) => {
        const x1 = n.x * cosR - n.z * sinR;
        const z1 = n.x * sinR + n.z * cosR;
        const y1 = n.y * Math.cos(tilt) - z1 * Math.sin(tilt);
        const z2 = n.y * Math.sin(tilt) + z1 * Math.cos(tilt);
        // Depth drives brightness and dot size ONLY, never position. Scaling
        // position by depth pulls the far hemisphere in toward the middle and
        // piles the lattice into a dense round clot at the centre, which is
        // the pupil problem all over again. Projected straight, the points
        // land where they actually are on the sphere: sparse through the
        // middle, bunching toward the silhouette, the way a wireframe globe
        // reads.
        const depth = (z2 + 1.6) / 2.6;
        return {
          x: cx + x1 * R * 0.88 * spread,
          y: cy + y1 * R * 0.88 * spread,
          depth,
        };
      });

      // Connections. Only near-neighbour pairs, and only once energy is up, so
      // idle stays quiet and thinking visibly wires itself together.
      // Connections are always drawn, faintly at rest and wiring up under
      // load. At zero they were invisible, which lost the one thing the brief
      // actually asks the orb to communicate: that it is interconnected.
      const maxDist = R * (0.3 + energy * 0.34);
      ctx!.lineWidth = 1;
      for (let i = 0; i < projected.length; i += 1) {
        for (let j = i + 1; j < projected.length; j += 1) {
          const a = projected[i];
          const b = projected[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > maxDist) continue;
          const near = Math.min(a.depth, b.depth);
          const strength = (1 - dist / maxDist) * (0.22 + energy * 0.78) * (0.45 + near * 0.55);
          // Light lines: they sit over the graphite mass, so they have to be
          // brighter than it, not darker.
          ctx!.strokeStyle = `rgba(226,232,244,${strength})`;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      // Nodes sit on top of everything so the lattice reads as suspended
      // inside the glass rather than buried under it.
      const insightIndex = 11;
      projected.forEach((p, i) => {
        const isInsight = s === "insight" && i === insightIndex;
        if (isInsight) {
          const halo = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, R * 0.45);
          halo.addColorStop(0, `rgba(${ACCENT},0.5)`);
          halo.addColorStop(1, `rgba(${ACCENT},0)`);
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, R * 0.45, 0, Math.PI * 2);
          ctx!.fillStyle = halo;
          ctx!.fill();
        }
        const r = (isInsight ? 3 : 1.7) * p.depth + (isInsight ? Math.sin(frame * 0.12) * 0.6 : 0);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, Math.max(0.5, r), 0, Math.PI * 2);
        ctx!.fillStyle = isInsight
          ? `rgba(${ACCENT},1)`
          : `rgba(238,241,248,${0.24 + p.depth * 0.66})`;
        ctx!.fill();
      });

      /* --------------------------------------------------- state overlays -- */

      // Listening: rings leaving the rim on a repeating cycle.
      if (s === "listening") {
        for (let k = 0; k < 2; k += 1) {
          const phase = ((frame * 0.012 + k * 0.5) % 1);
          ctx!.beginPath();
          ctx!.arc(cx, cy, R * (0.9 + phase * 0.55), 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(${ACCENT},${(1 - phase) * 0.5})`;
          ctx!.lineWidth = 1.3;
          ctx!.stroke();
        }
      }

      // Speaking: a waveform wrapped around the circumference. Amplitude is
      // pseudo-random per segment so it reads as speech, not as a sine wave.
      if (s === "speaking") {
        ctx!.beginPath();
        const segments = 72;
        for (let i = 0; i <= segments; i += 1) {
          const angle = (i / segments) * Math.PI * 2;
          const wobble =
            Math.sin(i * 0.7 + frame * 0.18) * 0.5 + Math.sin(i * 1.9 - frame * 0.11) * 0.5;
          const rr = R * 0.94 + wobble * R * 0.07;
          const x = cx + Math.cos(angle) * rr;
          const y = cy + Math.sin(angle) * rr;
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.closePath();
        ctx!.strokeStyle = `rgba(${ACCENT},0.85)`;
        ctx!.lineWidth = 1.4;
        ctx!.stroke();
      }

      /* ------------------------------------------------------- rim light --- */
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(255,255,255,${0.75 + energy * 0.2})`;
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // Thinking glow: a soft outer bloom, strongest while it computes.
      if (energy > 0.4) {
        const glow = ctx!.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.25);
        glow.addColorStop(0, `rgba(${ACCENT},${(energy - 0.4) * 0.22})`);
        glow.addColorStop(1, `rgba(${ACCENT},0)`);
        ctx!.beginPath();
        ctx!.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    if (reduced) {
      // One static frame: the orb still has to look like itself, it just does
      // not move. Zero energy means no lattice wiring and no overlays.
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => cancelAnimationFrame(raf);
  }, [size, reduced]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`OSiQ is ${state}`}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
