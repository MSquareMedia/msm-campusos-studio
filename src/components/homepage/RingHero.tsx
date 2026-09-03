"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { primaryCta } from "@/lib/site-config";

export type HeroLogo = { name: string; src: string };

/**
 * The homepage hero: statement, one CTA, and the client marquee, all inside
 * the first viewport.
 *
 * Replaces the autoplaying brand film. A full-bleed video pushed the actual
 * proposition below the fold and cost several megabytes before a visitor read
 * a word; this states the position immediately and puts the client logos, * the strongest credibility on the page, in the same first impression.
 *
 * The backdrop is concentric SVG rings with one slowly rotating accent arc.
 * SVG rather than canvas because it is eight static circles and one rotation:
 * a canvas would mean a render loop running forever for something CSS can do
 * on the compositor. Masked so the rings fade out before they reach the edges
 * and never fight the headline for contrast.
 */
export function RingHero({
  headline,
  supportingCopy,
  logos,
}: {
  headline: string;
  supportingCopy: string;
  logos: HeroLogo[];
}) {
  // Duplicated for the seamless -50% translate. The copy is aria-hidden so
  // screen readers do not hear every client name twice.
  const marqueeSet = (ariaHidden: boolean) => (
    <div className="hero-logo-set" aria-hidden={ariaHidden || undefined}>
      {logos.map((logo) => (
        // White card behind every mark. Against the dark hero, a bare logo
        // with a transparent or colour-matched background loses its edges;
        // the card gives every mark the same flat, legible plate regardless
        // of what colour or shape it is. Every source asset is cropped tight
        // to its own content first, so the card's own padding is the only
        // padding in play.
        <div
          key={`${logo.name}-${ariaHidden ? "dup" : "orig"}`}
          className="flex h-11 shrink-0 items-center justify-center rounded-lg bg-white px-4 md:h-14 md:px-5"
        >
          <Image
            src={logo.src}
            alt={ariaHidden ? "" : logo.name}
            width={200}
            height={80}
            className="h-6 w-auto object-contain md:h-8"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{
        minHeight: "calc(100dvh - var(--header-height))",
        background: "var(--surface-inverse)",
      }}
    >
      <div className="hero-rings pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="absolute left-1/2 top-[46%] h-[min(150vw,1020px)] w-[min(150vw,1020px)] -translate-x-1/2 -translate-y-1/2"
          viewBox="0 0 800 800"
          fill="none"
        >
          {[92, 138, 184, 232, 280, 328, 376, 424].map((r, i) => (
            <circle
              key={r}
              cx="400"
              cy="400"
              r={r}
              className={i % 2 === 1 ? "hero-ring hero-ring-mid" : "hero-ring"}
            />
          ))}
          <g className="hero-ring-spin">
            <circle
              cx="400"
              cy="400"
              r="232"
              strokeDasharray="52 1400"
              strokeLinecap="round"
              className="hero-ring-accent"
            />
            <circle
              cx="400"
              cy="400"
              r="328"
              strokeDasharray="36 2020"
              strokeDashoffset="380"
              strokeLinecap="round"
              className="hero-ring-accent"
            />
          </g>
        </svg>
      </div>

      <div className="container-page relative flex flex-1 flex-col items-center justify-center py-10 text-center md:py-16">
        <h1 className="hero-enter font-display max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-tight text-white md:text-6xl lg:text-7xl">
          {headline}
        </h1>

        <p className="hero-enter hero-enter-1 mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
          {supportingCopy}
        </p>

        <div className="hero-enter hero-enter-2 mt-9">
          <Link
            href={primaryCta.href}
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-7 py-3.5 font-display text-sm font-semibold text-white transition-[background-color,transform] duration-200 [transition-timing-function:var(--ease-out-strong)] hover:bg-[var(--brand-accent-dark)] active:scale-[0.97]"
          >
            {primaryCta.label}
            <ArrowRight
              size={16}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-200 [transition-timing-function:var(--ease-out-strong)] group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      <div className="relative pb-7 md:pb-10">
        <div className="hero-logo-marquee">
          <div className="hero-logo-track">
            {marqueeSet(false)}
            {marqueeSet(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
