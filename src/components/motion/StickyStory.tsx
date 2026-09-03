"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";

export type StickyStoryMoment = {
  label: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  credit?: string;
};

/**
 * Narrative scroll: one image column holds its position while the written
 * moments pass it, and the picture cross-fades to whichever moment the reader
 * is currently inside.
 *
 * The pin is CSS `position: sticky` on purpose. GSAP's `pin: true` wraps the
 * element in a pin-spacer that React can tear out from under it on rerender,
 * which is a documented crash in this codebase. Sticky costs nothing, survives
 * hydration, and degrades to a plain stacked column when the browser is narrow.
 *
 * Only opacity animates. The active image sits on top of the others in the
 * same grid cell rather than being swapped in the DOM, so there is no reflow
 * and no flash of an unloaded picture mid-scroll.
 */
export function StickyStory({
  moments,
  side = "left",
}: {
  moments: StickyStoryMoment[];
  /** Which side the held image sits on. Alternate it between pages so two
   *  stories in the same site do not read as the same template. */
  side?: "left" | "right";
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  return (
    <div
      className={`container-page grid gap-x-16 gap-y-12 md:grid-cols-2 ${
        side === "right" ? "" : "md:[&>*:first-child]:order-2"
      }`}
    >
      {/* Text column. Each moment reports itself as active on entry; the
          threshold sits high so the swap lands as the moment reaches reading
          position, not as its first pixel appears. */}
      <div className="flex flex-col">
        {moments.map((moment, i) => (
          <Moment
            key={moment.title}
            moment={moment}
            index={i}
            onEnter={() => setActive(i)}
          />
        ))}
      </div>

      {/* Image column. On mobile it collapses to a single frame above the
          text; holding a picture in place needs a viewport tall enough for
          both, which phones do not have. */}
      <div className="row-start-1 md:row-start-auto">
        <div className="sticky top-[calc(var(--header-height)+2rem)]">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            {moments.map((moment, i) => (
              <motion.div
                key={moment.image + i}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.55, ease: [0.23, 1, 0.32, 1] }
                }
              >
                <Image
                  src={moment.image}
                  alt={moment.alt}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
          {moments[active]?.credit && (
            <p className="mt-3 text-xs text-[var(--text-muted)]">{moments[active].credit}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Moment({
  moment,
  index,
  onEnter,
}: {
  moment: StickyStoryMoment;
  index: number;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  // The latest callback is stashed in an effect rather than during render:
  // writing to a ref while rendering is a React lint error and is unsafe under
  // concurrent rendering, where a render can be thrown away.
  const onEnterRef = useRef(onEnter);
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  // Reporting up during render would be a setState-in-render on the parent.
  // The effect also means the last moment to enter wins when two briefly
  // overlap, which is the reading order the eye follows anyway.
  useEffect(() => {
    if (inView) onEnterRef.current();
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className="flex min-h-[60vh] flex-col justify-center border-t py-10 first:border-t-0 md:min-h-[80vh]"
      style={{ borderColor: "var(--border)" }}
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <span className="eyebrow text-[var(--brand-accent)]">{moment.label}</span>
      <h3 className="font-display mt-4 text-3xl font-bold leading-[1.05] md:text-5xl">
        {moment.title}
      </h3>
      <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
        {moment.description}
      </p>
      <span className="sr-only">Moment {index + 1}</span>
    </motion.div>
  );
}
