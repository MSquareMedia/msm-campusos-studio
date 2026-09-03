"use client";

import { useRef, type ElementType } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * Headline that rises into place a line at a time, each line masked by its own
 * overflow-hidden wrapper so the words appear to slide out from behind a
 * physical edge rather than fading in from nothing.
 *
 * Fires once. A headline that re-animates every time it scrolls back into view
 * gets irritating fast on a long page.
 */
export function TextReveal({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
  onMount = false,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  /** For headlines that are already on screen at first paint (page heroes).
   *  Waiting for an intersection callback there means the words are hidden
   *  behind their mask until the observer happens to run, which on a slow or
   *  backgrounded first frame reads as a headline that never arrived. */
  onMount?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const show = onMount || inView;

  return (
    <div ref={ref}>
      <Tag className={className}>
        {lines.map((line, i) => (
          // pb reserve: descenders (g, y, p) get clipped by overflow-hidden
          // without it, and the -mb pulls the visual rhythm back to normal.
          <span key={`${i}-${line}`} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className="block"
              initial={reduced ? undefined : { y: "110%" }}
              animate={show && !reduced ? { y: "0%" } : undefined}
              transition={{
                duration: 0.75,
                delay: delay + i * 0.075,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

/**
 * Body copy that fades up as a block. Deliberately plainer than TextReveal:
 * if the supporting paragraph competes with the headline for attention, the
 * hierarchy is broken.
 */
export function FadeUp({
  children,
  className = "",
  delay = 0,
  y = 20,
  onMount = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Same reasoning as TextReveal's: above-the-fold copy plays on mount
   *  rather than waiting to be told it is visible. */
  onMount?: boolean;
}) {
  const reduced = useReducedMotion();
  const target = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={reduced ? undefined : { opacity: 0, y }}
      animate={onMount && !reduced ? target : undefined}
      whileInView={onMount || reduced ? undefined : target}
      viewport={onMount ? undefined : { once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
