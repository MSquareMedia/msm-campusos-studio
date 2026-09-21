"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { LinkedinLogo, Play, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react/dist/ssr";
import { motion, useInView, useReducedMotion } from "motion/react";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";
import type { StoryReveal } from "@/content/types";

/**
 * Chapter III: the reveal. This is where MSM CampusOS is named for the first
 * time on the page, after the industry and the Westfield story have made the
 * case for it. The logo lands first, then the argument, then the film.
 *
 * The film is deferred: a still poster is all that ships until the frame
 * scrolls near the viewport, and only then is the player mounted, muted and
 * captioned. Visitors who prefer reduced motion never get autoplay, they get
 * the poster and a play control.
 */
export function ChapterReveal({ reveal }: { reveal: StoryReveal }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const nearViewport = useInView(frameRef, { once: true, margin: "200px 0px" });
  const reduced = useReducedMotion();
  const [userStarted, setUserStarted] = useState(false);
  const [sound, setSound] = useState(false);

  const mounted = userStarted || (nearViewport && !reduced);
  const { video } = reveal;
  const src =
    `https://www.youtube-nocookie.com/embed/${video.youtubeId}` +
    `?autoplay=1&mute=${sound ? 0 : 1}&loop=1&playlist=${video.youtubeId}` +
    `&cc_load_policy=1&playsinline=1&rel=0&modestbranding=1`;

  return (
    <section className="py-24 md:py-36">
      <div className="container-page">
        <motion.div
          className="mx-auto flex w-fit items-center justify-center"
          initial={reduced ? undefined : { opacity: 0, scale: 0.94 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <Image
            src={reveal.logo.src}
            alt={reveal.logo.alt}
            width={reveal.logo.width}
            height={reveal.logo.height}
            sizes="(min-width: 768px) 320px, 220px"
            className="h-auto w-[220px] md:w-[320px]"
          />
        </motion.div>

        <div className="mx-auto mt-14 max-w-3xl text-center md:mt-20">
          <span className="eyebrow text-[var(--brand-accent)]">{reveal.label}</span>
          <TextReveal
            lines={toLines(reveal.heading)}
            className="font-display mt-5 text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl"
          />
          <FadeUp delay={0.15}>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
              {reveal.body}
            </p>
          </FadeUp>
        </div>

        <figure className="mx-auto mt-14 max-w-5xl md:mt-20">
          <div
            ref={frameRef}
            className="relative aspect-video w-full overflow-hidden bg-black"
          >
            <Image
              src={video.posterSrc}
              alt=""
              fill
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
            />
            {mounted ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={src}
                title={video.title}
                loading="lazy"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setUserStarted(true)}
                className="group absolute inset-0 z-10 flex items-center justify-center bg-black/25"
                aria-label={`Play film: ${video.title}`}
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 transition-transform duration-200 [transition-timing-function:var(--ease-out-strong)] group-hover:scale-105 group-active:scale-[0.97] md:h-24 md:w-24">
                  <Play size={32} weight="fill" color="var(--brand-accent)" />
                </span>
              </button>
            )}
          </div>

          <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <span className="font-display text-sm font-semibold md:text-base">{reveal.caption}</span>
            <span className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  setUserStarted(true);
                  setSound((on) => !on);
                }}
                aria-pressed={sound}
                className="font-display inline-flex items-center gap-2 text-sm font-medium underline-offset-4 transition-colors hover:text-[var(--brand-accent)] hover:underline"
              >
                {sound ? (
                  <SpeakerSlash size={18} weight="fill" aria-hidden="true" />
                ) : (
                  <SpeakerHigh size={18} weight="fill" aria-hidden="true" />
                )}
                {sound ? "Mute" : "Watch with sound"}
              </button>
              {reveal.linkedinUrl && (
                <a
                  href={reveal.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="MSM CampusOS on LinkedIn"
                  className="text-[var(--text-muted)] transition-colors hover:text-[var(--brand-accent)]"
                >
                  <LinkedinLogo size={20} weight="fill" aria-hidden="true" />
                </a>
              )}
            </span>
          </figcaption>
        </figure>

        <FadeUp className="mx-auto mt-16 max-w-5xl md:mt-24" delay={0.05}>
          <p
            className="font-display border-l-[3px] pl-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl"
            style={{ borderColor: "var(--brand-accent)" }}
          >
            {reveal.closing}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
