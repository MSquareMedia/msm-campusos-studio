"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Image that uncovers itself with an animated clip-path as it enters the
 * viewport, while the picture inside drifts at a slower rate than the page.
 *
 * Two separate ideas doing two separate jobs: the clip is the entrance (a
 * wipe reads as deliberate where a fade reads as a slow-loading image), and
 * the parallax is ambient depth that continues the whole time the frame is on
 * screen. The inner image is over-scaled so the drift never exposes an edge.
 */
export function ScrollReveal({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 768px) 60vw, 100vw",
  caption,
  frameClassName = "",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  caption?: string;
  /** Sizes the clipped frame itself (aspect ratio or explicit height). The
   *  image inside is absolutely filled, so the frame needs its own box. */
  frameClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <figure className={className}>
      <motion.div
        ref={ref}
        className={`relative overflow-hidden ${frameClassName}`}
        initial={reduced ? undefined : { clipPath: "inset(0 0 100% 0)" }}
        animate={inView && !reduced ? { clipPath: "inset(0 0 0% 0)" } : undefined}
        transition={{ duration: 1.05, ease: [0.77, 0, 0.175, 1] }}
      >
        <motion.div className="relative h-full w-full" style={reduced ? undefined : { y }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="scale-[1.1] object-cover"
          />
        </motion.div>
      </motion.div>
      {caption && (
        <figcaption className="mt-3 text-xs text-[var(--text-muted)]">{caption}</figcaption>
      )}
    </figure>
  );
}
