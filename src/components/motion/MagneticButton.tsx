"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * CTA that leans toward the cursor as it approaches, then snaps back on exit.
 *
 * The pull is capped at ~0.28 of the distance from centre so the button never
 * detaches from its slot in the layout, and the whole effect is skipped on
 * coarse pointers via CSS-free logic: with no hover there is nothing to track,
 * and the tap still gets its scale feedback.
 */
export function MagneticButton({
  href,
  children,
  className = "",
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /** `ghost` sits on the page surface; `ghost-inverse` sits on photography or
   *  the dark surface, where the themeable text token would disappear. */
  variant?: "primary" | "ghost" | "ghost-inverse";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.28);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.28);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const base =
    "inline-flex items-center justify-center px-8 py-4 font-display text-sm font-semibold tracking-wide transition-[background-color,color,transform] duration-200 [transition-timing-function:var(--ease-out-strong)] active:scale-[0.97]";
  const skin =
    variant === "primary"
      ? "bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent-dark)]"
      : variant === "ghost-inverse"
        ? "border border-white/70 text-white hover:bg-white hover:text-[var(--surface-inverse)]"
        : "border border-current text-[var(--text)] hover:bg-[var(--surface-inverse)] hover:text-[var(--text-inverse)] hover:border-[var(--surface-inverse)]";

  return (
    <motion.span
      className="inline-block"
      style={reduced ? undefined : { x: sx, y: sy }}
      onMouseMove={reduced ? undefined : onMove}
      onMouseLeave={reduced ? undefined : reset}
    >
      <Link ref={ref} href={href} className={`${base} ${skin} ${className}`}>
        {children}
      </Link>
    </motion.span>
  );
}
