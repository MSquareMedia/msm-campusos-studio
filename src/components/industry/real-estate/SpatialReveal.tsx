"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";
import type { StoryMoment } from "@/content/types";

/**
 * The reader stands inside the property while the sequence moves around them:
 * a full-bleed frame held behind the page cross-fades from step to step as the
 * written moments pass over it. Real estate is the one industry here whose
 * subject is a place, so it gets the one section on the site where the
 * photograph is the room rather than an illustration beside the text.
 *
 * The held frame is `position: sticky` and the moments are pulled back over it
 * with a negative margin. This used to be a GSAP `pin: true` horizontal rail;
 * pin injects a pin-spacer wrapper that React's reconciler can invalidate,
 * which is the documented insertBefore crash in this codebase. Sticky adds no
 * wrapper at all.
 *
 * Under reduced motion nothing cross-fades and nothing is held: the moments
 * render as a plain stacked sequence with their own frames.
 */
export function SpatialReveal({
  heading,
  intro,
  moments,
}: {
  heading: string;
  intro: string;
  moments: StoryMoment[];
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 md:py-32">
      <div className="container-page max-w-3xl">
        <TextReveal
          lines={toLines(heading)}
          className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl"
        />
        <FadeUp delay={0.1}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
            {intro}
          </p>
        </FadeUp>
      </div>

      {reduced ? (
        <div className="container-page mt-16 flex flex-col gap-16">
          {moments.map((moment) => (
            <figure key={moment.title} className="grid gap-6 md:grid-cols-2 md:items-center">
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src={moment.image}
                  alt={moment.alt ?? `Real estate journey moment: ${moment.title}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption>
                <span className="eyebrow text-[var(--brand-accent)]">{moment.label}</span>
                <h3 className="font-display mt-3 text-2xl font-bold md:text-3xl">{moment.title}</h3>
                <p className="mt-3 max-w-sm text-[var(--text-muted)]">{moment.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="relative mt-16 md:mt-20">
          {/* Held frame. Every image stays mounted and only opacity moves, so
              stepping between moments never waits on a network request. */}
          <div className="sticky top-0 h-[100dvh] overflow-hidden">
            {moments.map((moment, i) => (
              <motion.div
                key={moment.image}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              >
                <Image
                  src={moment.image}
                  alt={moment.alt ?? `Real estate journey moment: ${moment.title}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            ))}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.25) 100%)",
              }}
              aria-hidden="true"
            />
          </div>

          <div className="relative -mt-[100dvh]">
            {moments.map((moment, i) => (
              <SpatialMoment
                key={moment.title}
                moment={moment}
                onEnter={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function SpatialMoment({
  moment,
  onEnter,
}: {
  moment: StoryMoment;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // A tight band around the viewport centre: the frame should change as the
  // moment arrives at reading height, not as it clears the bottom edge.
  const inView = useInView(ref, { margin: "-48% 0px -48% 0px" });

  const onEnterRef = useRef(onEnter);
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    if (inView) onEnterRef.current();
  }, [inView]);

  return (
    <div ref={ref} className="flex min-h-[85vh] items-center md:min-h-[100dvh]">
      <div className="container-page">
        <motion.div
          className="max-w-md text-white"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="eyebrow text-[var(--brand-accent)]">{moment.label}</span>
          <h3 className="font-display mt-4 text-3xl font-bold leading-[1.05] md:text-5xl">
            {moment.title}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-white/80 md:text-lg">
            {moment.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
