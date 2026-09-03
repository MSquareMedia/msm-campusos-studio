"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play, X } from "@phosphor-icons/react/dist/ssr";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { PlaceholderMedia } from "./PlaceholderMedia";
import { primaryCta, secondaryCta } from "@/lib/site-config";
import { usePrefersReducedMotion, useIsCoarsePointer } from "@/lib/motion";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";

type Variant = "automotive" | "healthcare" | "real-estate" | "education";

/**
 * Full-bleed opening frame. The picture is the page's first argument, so it
 * gets the whole viewport and the words sit on it rather than beside it.
 *
 * As the reader scrolls away the media drifts up at roughly half page speed
 * while the copy lifts and fades slightly faster. The two rates are what make
 * the frame read as depth instead of as a background image scrolling off.
 */
export function IndustryHero({
  variant,
  eyebrow,
  headline,
  supportingCopy,
  mediaLabel,
  mediaSrc,
  video,
  capabilitiesHref,
  enablePointerDrift = false,
}: {
  variant: Variant;
  eyebrow: string;
  headline: string;
  supportingCopy: string;
  mediaLabel: string;
  mediaSrc?: string;
  video?: { youtubeId: string; title: string };
  capabilitiesHref: string;
  enablePointerDrift?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const reduced = useReducedMotion();
  const coarsePointer = useIsCoarsePointer();
  const [playing, setPlaying] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    if (!enablePointerDrift || reducedMotion || coarsePointer || !mediaRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width - 0.5;
    const y = (e.clientY - bounds.top) / bounds.height - 0.5;
    const maxShift = 10;
    mediaRef.current.style.transform = `translate3d(${x * maxShift}px, ${y * maxShift}px, 0) scale(1.08)`;
  }

  function handlePointerLeave() {
    if (!mediaRef.current) return;
    mediaRef.current.style.transform = "translate3d(0,0,0) scale(1.08)";
  }

  const showCopy = !(video && playing);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: "100dvh" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: mediaY }}>
        <div
          ref={mediaRef}
          className="h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: "scale(1.08)" }}
        >
          {video && playing ? (
            // Letterboxed to the video's own 16:9 rather than stretched to
            // the full-bleed hero height: an unconstrained h-full/w-full
            // iframe distorts a 16:9 upload into whatever the viewport's
            // aspect ratio happens to be.
            <div className="flex h-full w-full items-center justify-center bg-black">
              <div className="aspect-video w-full max-h-full">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : mediaSrc ? (
            <Image
              src={mediaSrc}
              alt={mediaLabel}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <PlaceholderMedia variant={variant} label={mediaLabel} className="h-full w-full" />
          )}
        </div>
      </motion.div>

      {showCopy && (
        <div
          className="absolute inset-0"
          style={{
            background:
              // Weighted to the lower half where the copy sits. Some hero
              // photographs are bright interiors, and white type needs a real
              // floor under it, not a decorative tint.
              "linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.62) 38%, rgba(0,0,0,0.18) 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Once playing there was previously no way back to the poster/copy,           the iframe simply replaced them for good. A visible close control
          restores that exit. */}
      {video && playing && (
        <button
          type="button"
          onClick={() => setPlaying(false)}
          className="group absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          aria-label="Close video"
        >
          <X size={20} weight="bold" />
        </button>
      )}

      {/* The whole frame is the hit area, but the visible control sits in the
          upper third: dead-centre it lands on top of the headline. */}
      {video && !playing && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 z-10 flex items-start justify-center pt-[26dvh]"
          aria-label={`Play video: ${video.title}`}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 transition-transform duration-200 [transition-timing-function:var(--ease-out-strong)] group-hover:scale-105 group-active:scale-[0.97] md:h-24 md:w-24">
            <Play size={32} weight="fill" color="var(--brand-accent)" />
          </span>
        </button>
      )}

      {showCopy && (
        <motion.div
          className="container-page relative z-20 pb-20 pt-8 text-white md:pb-28"
          style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          {/* The accent red does not hold 4.5:1 against a bright photograph,
              so on the hero the brand mark is a rule and the label itself is
              white. Everywhere the eyebrow sits on a page surface it stays
              accent-coloured. */}
          <FadeUp y={12} onMount>
            <p className="eyebrow flex items-center gap-3 text-white">
              <span
                className="inline-block h-[2px] w-8"
                style={{ background: "var(--brand-accent)" }}
                aria-hidden="true"
              />
              {eyebrow}
            </p>
          </FadeUp>
          <TextReveal
            as="h1"
            lines={toLines(headline)}
            delay={0.08}
            onMount
            className="font-display mt-5 max-w-[15ch] text-[clamp(2.5rem,9vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight md:text-7xl md:leading-[0.98]"
          />
          <FadeUp delay={0.32} y={14} onMount>
            <p className="mt-7 max-w-md text-base text-white/85 md:text-lg">{supportingCopy}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <MagneticButton href={primaryCta.href}>{primaryCta.label}</MagneticButton>
              <MagneticButton href={capabilitiesHref} variant="ghost-inverse">
                {secondaryCta.label}
              </MagneticButton>
            </div>
          </FadeUp>
        </motion.div>
      )}
    </section>
  );
}
