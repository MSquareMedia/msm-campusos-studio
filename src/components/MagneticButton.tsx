"use client";

import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion, useIsCoarsePointer } from "@/lib/motion";

/**
 * Wraps a single interactive child (a link or button) and nudges it toward
 * the cursor within a small radius. Purely a hover flourish: feedback that
 * the control is alive, not a layout mechanism. Skipped entirely on touch
 * and under reduced motion.
 */
export function MagneticButton({ children, strength = 14 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const coarsePointer = useIsCoarsePointer();
  const disabled = reducedMotion || coarsePointer;

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (disabled || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const x = e.clientX - bounds.left - bounds.width / 2;
    const y = e.clientY - bounds.top - bounds.height / 2;
    ref.current.style.transform = `translate(${(x / bounds.width) * strength}px, ${(y / bounds.height) * strength}px)`;
  }

  function handleLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="inline-block transition-transform duration-200 ease-out"
    >
      {children}
    </div>
  );
}
