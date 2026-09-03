"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { MagneticButton } from "@/components/motion/MagneticButton";

export type Chapter = {
  eyebrow: string;
  heading: string;
  body: string;
  /** Two banners per chapter, India context, then a global one, crossfade
   *  partway through the panel's scroll hold rather than showing a single
   *  static image. No credit line is rendered for either, by design. */
  imageIndia: string;
  altIndia: string;
  imageGlobal: string;
  altGlobal: string;
  /** Where "the model travels" for this industry actually leads. Without
   *  this the chapter was a dead end, full-bleed photography and copy with
   *  no way to act on it short of scrolling on to the next industry. */
  ctaHref: string;
};

/**
 * One chapter of the homepage narrative: a full-bleed image that holds the
 * viewport while its copy rises through, then releases to the next chapter.
 *
 * The hold is CSS `position: sticky` inside a tall wrapper, deliberately not
 * a GSAP `pin: true` trigger, pinning rewraps the DOM in a pin-spacer, and
 * this codebase has a history of insertBefore crashes when React re-renders
 * a pinned subtree underneath it. Sticky gets the same effect with no DOM
 * surgery, and it degrades to plain stacked sections when unsupported.
 */
function ChapterPanel({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The image recedes slightly as its chapter ends, so the next one reads as
  // arriving on top rather than cutting in.
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [0, 1, 1, 0]);

  // India holds the first half of the panel, then crossfades to the global
  // shot for the second half; both fall back toward the same recede-at-the-
  // end opacity as the single-image version did.
  const indiaOpacity = useTransform(scrollYProgress, [0, 0.4, 0.5], [1, 1, 0]);
  const globalOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.75, 1], [0, 1, 1, 0.35]);

  return (
    <div ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div className="absolute inset-0" style={reduced ? undefined : { scale }}>
          <motion.div
            className="absolute inset-0"
            style={reduced ? undefined : { opacity: indiaOpacity }}
          >
            <Image
              src={chapter.imageIndia}
              alt={chapter.altIndia}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            style={reduced ? { opacity: 0 } : { opacity: globalOpacity }}
          >
            <Image
              src={chapter.imageGlobal}
              alt={chapter.altGlobal}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          {/* Scrim: the copy sits on photography whose brightness we do not
              control, so contrast is guaranteed rather than hoped for, a flat
              floor across the whole frame, plus a heavier gradient under the
              text block itself. Measured against the brightest of the four
              images, not the average. */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,0.92)_0%,rgba(8,8,8,0.72)_38%,rgba(8,8,8,0.30)_70%,rgba(8,8,8,0.20)_100%)]" />
        </motion.div>

        <motion.div
          className="container-page relative flex h-full max-w-4xl flex-col justify-end pb-[14vh]"
          style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <p className="eyebrow text-white/60">{chapter.eyebrow}</p>
          <h3 className="font-display mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
            {chapter.heading}
          </h3>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{chapter.body}</p>
          <div className="mt-8">
            <MagneticButton href={chapter.ctaHref} variant="ghost-inverse">
              <span className="inline-flex items-center gap-2">
                {`Explore ${chapter.eyebrow}`}
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </span>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function StickyChapters({ chapters }: { chapters: Chapter[] }) {
  return (
    <section aria-label="How the work moves">
      {chapters.map((chapter, i) => (
        <ChapterPanel key={chapter.heading} chapter={chapter} index={i} />
      ))}
    </section>
  );
}
