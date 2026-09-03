"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";

/**
 * Vertical scroll drives a horizontal pan.
 *
 * Pinning is done with `position: sticky` inside a deliberately tall wrapper,
 * never GSAP's `pin: true`. GSAP's pin injects a pin-spacer element around the
 * pinned node, and when React later rerenders that subtree it can try to
 * remove a child whose parent GSAP has since replaced, which is the
 * insertBefore crash this codebase has hit before. Sticky adds no wrapper and
 * has nothing to unwind.
 *
 * The wrapper's height is the pan distance plus one viewport, so the rail
 * finishes exactly as the section releases. Distance is measured from the real
 * rendered track after layout and remeasured on resize, because it depends on
 * content width rather than anything computable up front.
 *
 * The same children render in both modes: when the pan is off (narrow screen,
 * reduced motion, first paint before measurement) the track simply wraps into
 * a stacked column. Nothing is duplicated and nothing is hidden.
 */
export function StickyRail({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    function measure() {
      const el = trackRef.current;
      if (!el) return;
      const wide = window.matchMedia("(min-width: 768px)").matches;
      // Measuring the row's natural width means reading it while it is laid
      // out as a row; the stacked fallback would report a useless number, so
      // the flag below only ever turns the pan on, never off mid-scroll.
      setDistance(wide ? Math.max(0, el.scrollWidth - window.innerWidth) : 0);
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  // A light spring takes the stepping out of a scroll wheel without adding the
  // lag that makes a scrubbed pan feel detached from the hand.
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);

  const enabled = !reduced && distance > 0;

  return (
    <div
      ref={wrapRef}
      className={className}
      style={enabled ? { height: `calc(100dvh + ${distance}px)` } : undefined}
    >
      <div className={enabled ? "sticky top-0 h-[100dvh] overflow-hidden" : ""}>
        {/* No max-width container on the track: the row has to be allowed to
            overflow the viewport, which is the entire source of the pan
            distance. Left padding matches .container-page's gutter so the
            first tile lines up with the heading above it. */}
        <motion.div
          ref={trackRef}
          className="flex flex-col gap-10 px-6 md:h-full md:w-max md:flex-row md:items-center md:gap-8 md:px-0 md:pl-[max(40px,calc((100vw-1280px)/2+40px))] md:pr-[12vw] md:will-change-transform"
          style={enabled ? { x } : undefined}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
