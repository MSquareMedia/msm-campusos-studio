"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Full-bleed autoplaying brand film, the first thing visitors see. Muted
 * autoplay + playsInline is required for browsers to allow autoplay at
 * all; reduced-motion visitors get the poster frame only, no playback.
 * Deliberately minimal copy here, the headline treatment lives in the
 * section immediately below (CinematicHero), so this section carries mood
 * and brand, not a second competing headline.
 */
export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion || !videoRef.current) return;
    const video = videoRef.current;
    const playPromise = video.play();
    if (playPromise) playPromise.catch(() => {});
  }, [reducedMotion]);

  return (
    <section className="relative flex items-end overflow-hidden" style={{ minHeight: "100dvh" }}>
      <div className="absolute inset-0 bg-black">
        {!reducedMotion && (
          <video
            ref={videoRef}
            className="h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: ready ? 1 : 0 }}
            poster="/images/homepage/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setReady(true)}
          >
            <source src="/videos/homepage-hero.mp4" type="video/mp4" />
          </video>
        )}
        {reducedMotion && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/homepage/hero-poster.jpg"
            alt="SOTAPO"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.25) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="container-page relative z-10 flex w-full items-center justify-between pb-10 pt-8 text-white">
        <p className="eyebrow text-white/80">SOTAPO</p>
        <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70 md:flex">
          Scroll
          <ArrowDown size={14} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
