"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap, { usePrefersReducedMotion, useIsCoarsePointer } from "@/lib/motion";
import { AgencyMotionBackdrop } from "./AgencyMotionBackdrop";
import { NetworkCanvas } from "./NetworkCanvas";
import { OrbitRings } from "@/components/OrbitRings";
import { MagneticButton } from "@/components/MagneticButton";
import { primaryCta, secondaryCta } from "@/lib/site-config";

const TICKER_ITEMS = [
  "STRATEGY",
  "BRAND",
  "CREATIVE",
  "MEDIA",
  "DIGITAL EXPERIENCE",
  "DATA & AI",
];

/**
 * The homepage hero. Word-by-word GSAP entrance on the giant headline
 * (inspired by big-agency reveal patterns, reimplemented on the project's
 * existing GSAP stack rather than pulling in framer-motion or a WebGL
 * renderer for a single section), a pointer-parallax backdrop (same
 * onPointerMove technique already used by IndustryHero), and a marquee
 * ticker for texture. Backdrop stays the abstract gradient field, not a
 * photo, the homepage speaks for all four industries at once.
 */
export function CinematicHero({
  eyebrow,
  headline,
  supportingCopy,
}: {
  eyebrow: string;
  headline: string;
  supportingCopy: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const coarsePointer = useIsCoarsePointer();
  const sectionRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const words = headline.split(" ");

  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      const spans = wordRefs.current.filter(Boolean);
      gsap.fromTo(
        spans,
        { yPercent: 110, opacity: 0, filter: "blur(14px)" },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.08,
          ease: "expo.out",
          delay: 0.15,
        }
      );
      gsap.fromTo(
        ".hero-fade-in",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power2.out", delay: 0.75 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reducedMotion || coarsePointer || !backdropRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width - 0.5;
    const y = (e.clientY - bounds.top) / bounds.height - 0.5;
    backdropRef.current.style.transform = `translate3d(${x * -24}px, ${y * -24}px, 0) scale(1.06)`;
  }

  function handlePointerLeave() {
    if (!backdropRef.current) return;
    backdropRef.current.style.transform = "translate3d(0,0,0) scale(1.06)";
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: "100dvh" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div ref={backdropRef} className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: "scale(1.06)" }}>
        <AgencyMotionBackdrop />
        <NetworkCanvas />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.12) 100%)",
        }}
        aria-hidden="true"
      />
      <OrbitRings className="right-[-120px] top-1/2 h-[560px] w-[560px] -translate-y-1/2 md:right-[-40px]" />

      <div className="container-page relative z-10 flex w-full flex-col pb-8 pt-8 text-white">
        <p className="hero-fade-in eyebrow text-[var(--brand-accent)]" style={reducedMotion ? undefined : { opacity: 0 }}>
          {eyebrow}
        </p>

        <h1 className="font-display mt-5 max-w-5xl text-[clamp(2.75rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="mr-[0.22em] inline-block overflow-hidden align-top">
              <span
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className="inline-block"
                style={reducedMotion ? undefined : { willChange: "transform" }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="hero-fade-in mt-6 max-w-lg text-base text-white/85 md:text-lg"
          style={reducedMotion ? undefined : { opacity: 0 }}
        >
          {supportingCopy}
        </p>

        <div className="hero-fade-in mt-9 flex flex-wrap gap-4" style={reducedMotion ? undefined : { opacity: 0 }}>
          <MagneticButton>
            <Link href={primaryCta.href} className="btn btn-primary">
              {primaryCta.label}
            </Link>
          </MagneticButton>
          <MagneticButton>
            <a href="#industries" className="btn btn-secondary text-white border-white">
              {secondaryCta.label}
            </a>
          </MagneticButton>
        </div>

        <div className="hero-fade-in mt-14 overflow-hidden border-t border-white/15 pt-5" style={reducedMotion ? undefined : { opacity: 0 }}>
          <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center gap-10 font-display text-xs font-semibold tracking-[0.25em] text-white/50">
                {item}
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--brand-accent)]" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
