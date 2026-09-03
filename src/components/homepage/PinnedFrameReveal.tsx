"use client";

import { useEffect, useRef } from "react";
import gsap, { usePrefersReducedMotion } from "@/lib/motion";
import { AgencyMotionBackdrop } from "./AgencyMotionBackdrop";
import { industryNav } from "@/lib/site-config";

const MARQUEE_ITEMS = [...industryNav.map((i) => i.label), ...industryNav.map((i) => i.label)];

/**
 * A tall section with a `position: sticky` inner frame, not a GSAP
 * `pin: true` trigger. Sticky lets the browser own the pinning; GSAP only
 * scrubs transforms on elements already inside that sticky box. That
 * sidesteps the pin-spacer DOM-ownership conflict that crashed
 * PinnedJourney/SpatialReveal earlier (see IMPLEMENTATION_NOTES.md) â€” there
 * is no separate structural branch to swap out from under it, so nothing
 * to race.
 *
 * Deliberately industry-neutral: this runs on the homepage, which speaks
 * for all four industries at once, so the reveal card carries an animated
 * gradient backdrop and a marquee of industry names rather than a photo
 * tied to any single vertical.
 */
export function PinnedFrameReveal({
  titleTop,
  titleBottom,
}: {
  titleTop: string;
  titleBottom: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, { scale: 0.62, transformOrigin: "50% 50%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      tl.to(cardRef.current, { scale: 1.4, ease: "power1.inOut" }, 0);
      tl.to(topRef.current, { x: "-38vw", opacity: 0, ease: "power1.inOut" }, 0);
      tl.to(bottomRef.current, { x: "38vw", opacity: 0, ease: "power1.inOut" }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="container-page py-20 md:py-28">
        <div className="relative aspect-video w-full overflow-hidden">
          <AgencyMotionBackdrop />
          <div className="relative flex h-full flex-col items-center justify-center gap-4 text-center">
            <span className="font-display text-2xl font-extrabold uppercase text-white md:text-4xl">
              {titleTop}
            </span>
            <span className="font-display text-2xl font-extrabold uppercase text-white md:text-4xl">
              {titleBottom}
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[var(--surface-inverse)]">
        <span
          ref={topRef}
          aria-hidden="true"
          className="font-display absolute top-[18%] text-[clamp(2.5rem,9vw,7rem)] font-extrabold uppercase leading-none text-white"
        >
          {titleTop}
        </span>
        <div
          ref={cardRef}
          className="relative aspect-video w-[70vw] max-w-4xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
        >
          <AgencyMotionBackdrop />
          <div className="relative flex h-full items-center overflow-hidden">
            <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
              {MARQUEE_ITEMS.map((label, i) => (
                <span
                  key={`${label}-${i}`}
                  className="font-display flex items-center gap-8 text-[clamp(1.5rem,4vw,3rem)] font-extrabold uppercase text-white"
                >
                  {label}
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--brand-accent)]" />
                </span>
              ))}
            </div>
          </div>
        </div>
        <span
          ref={bottomRef}
          aria-hidden="true"
          className="font-display absolute bottom-[18%] text-[clamp(2.5rem,9vw,7rem)] font-extrabold uppercase leading-none text-white"
        >
          {titleBottom}
        </span>
      </div>
    </section>
  );
}
