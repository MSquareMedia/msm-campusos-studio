"use client";

import { useEffect, useRef } from "react";
import gsap, { useEnableScrollMotion } from "@/lib/motion";
import { Reveal } from "@/components/industry/Reveal";
import { CountUpStat } from "@/components/industry/CountUpStat";

type ImpactStat = {
  value: string;
  label: string;
};

// Ten stats, uniform weight, five to a row on desktop. The previous eight had
// one tile spanning two columns as a "hero" figure; adding two more without
// dropping that span left an uneven half-row at the end, so every tile is now
// the same size and the grid resolves to two clean rows instead.
const STATS: ImpactStat[] = [
  { value: "₹750 Cr+", label: "Admission revenue generated for clients" },
  { value: "190,000+", label: "Students helped into global institutions" },
  { value: "60,000+", label: "Admissions driven for clients" },
  { value: "50L+", label: "Leads delivered" },
  { value: "10Cr+", label: "Social engagements" },
  { value: "1,500+", label: "Partner campuses worldwide" },
  { value: "6,000+", label: "Certified recruitment agents" },
  { value: "800+", label: "Clients served" },
  { value: "29", label: "Countries with active presence" },
  { value: "+40%", label: "Growth in qualified enquiries for clients" },
];

/**
 * Dark surface-inverse band (existing token, not a new color) for a single
 * deliberate "color block" moment on an otherwise light homepage. Background
 * glyph drifts on scroll via a GSAP scrub tied to transform only (no
 * `window.scroll` listener, no layout-affecting properties) for the parallax
 * effect; tiles get a CSS-only hover lift since the motion here doesn't need
 * pointer tracking.
 */
export function ImpactNumbers() {
  const motionEnabled = useEnableScrollMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motionEnabled || !sectionRef.current || !bgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [motionEnabled]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y"
      style={{ background: "var(--surface-inverse)", borderColor: "var(--surface-inverse)" }}
    >
      <div
        ref={bgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-1/4 select-none text-center font-display text-[28vw] font-extrabold leading-none tracking-tighter"
        style={{ color: "rgba(255,255,255,0.03)" }}
      >
        GROWTH
      </div>

      <div className="container-page relative py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-[var(--text-inverse)] md:text-5xl">
            Admissions and revenue, not just impressions.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[var(--text-inverse-muted)]">
            The number that matters is what it did for enrollment and revenue. Here is what this
            team has moved, across the platforms and the careers that built it.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-none border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((stat) => (
            <Reveal
              key={stat.label}
              y={12}
              className="group relative bg-[var(--surface-inverse)] p-6 transition-colors duration-300 hover:bg-white/[0.04] md:p-7"
            >
              <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-[var(--brand-accent)]" />
              <CountUpStat
                value={stat.value}
                className="font-display block text-3xl font-extrabold text-[var(--text-inverse)] transition-transform duration-300 group-hover:-translate-y-1 md:text-4xl"
              />
              <p className="mt-3 text-sm text-[var(--text-inverse-muted)]">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
