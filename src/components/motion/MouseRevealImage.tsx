"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "motion/react";

/**
 * A line of text that reveals an image following the cursor on hover.
 *
 * The image position is driven by motion values through a spring rather than
 * written straight from the pointer event: tying pixels directly to the mouse
 * reads as mechanical because it has no momentum of its own. The slight lag
 * and overshoot is the whole effect.
 *
 * Decorative only. Under reduced motion, or on a coarse pointer where there is
 * no hover to speak of, the row renders as a plain link and the image never
 * mounts, so nothing is lost but the flourish.
 */
export function MouseRevealImage({
  label,
  meta,
  src,
  alt,
  href,
  children,
}: {
  label: string;
  meta?: string;
  src: string;
  alt: string;
  href?: string;
  children?: ReactNode;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);

  // Lower stiffness on x than y so the card trails horizontally as the cursor
  // sweeps across the row: the tilt below reads off that lag.
  const sx = useSpring(x, { stiffness: 190, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });
  const sOpacity = useSpring(opacity, { stiffness: 320, damping: 34 });
  const rotate = useTransform(sx, [-400, 400], [-9, 9]);

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  const Row = (
    <div className="flex flex-1 items-baseline justify-between gap-6">
      <span className="font-display text-2xl font-bold tracking-tight transition-transform duration-[400ms] [transition-timing-function:var(--ease-out-strong)] group-hover:translate-x-3 md:text-4xl">
        {label}
      </span>
      {meta && (
        <span className="shrink-0 text-xs text-[var(--text-muted)] md:text-sm">{meta}</span>
      )}
    </div>
  );

  return (
    <div
      ref={ref}
      onMouseMove={reduced ? undefined : onMove}
      onMouseEnter={reduced ? undefined : () => opacity.set(1)}
      onMouseLeave={reduced ? undefined : () => opacity.set(0)}
      className="group relative border-b"
      style={{ borderColor: "var(--border)" }}
    >
      {href ? (
        <a href={href} className="flex items-center py-6 md:py-8">
          {Row}
        </a>
      ) : (
        <div className="flex items-center py-6 md:py-8">{Row}</div>
      )}

      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-[220px] w-[300px] overflow-hidden md:block"
          // Centering uses the standalone `translate` property, not a
          // -translate-x-1/2 utility: Motion writes x/y into `transform`, and
          // an inline transform silently wins over the utility class, which
          // would anchor the card's top-left corner to the cursor instead of
          // its centre. `translate` composes with `transform` rather than
          // replacing it.
          style={{ x: sx, y: sy, rotate, opacity: sOpacity, translate: "-50% -50%" }}
        >
          <Image src={src} alt={alt} fill sizes="300px" className="object-cover" />
        </motion.div>
      )}
      {children}
    </div>
  );
}
