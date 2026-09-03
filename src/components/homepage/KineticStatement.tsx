"use client";

import { useEffect, useRef } from "react";
import gsap, { useEnableScrollMotion } from "@/lib/motion";
import { Reveal } from "@/components/industry/Reveal";

/**
 * The agency thesis statement, read a word at a time as the section scrolls
 * past, a `position: sticky` inner viewport (same safe pattern as
 * PinnedFrameReveal, not a GSAP `pin: true` trigger) with a scrubbed
 * word-by-word opacity/color ramp. Falls back to a plain static paragraph
 * whenever scroll motion is disabled (reduced motion, coarse pointer, or
 * before the one-time mount check resolves).
 */
export function KineticStatement({ line, body }: { line: string; body: string }) {
  const motionEnabled = useEnableScrollMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const words = line.split(" ");

  useEffect(() => {
    if (!motionEnabled || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const spans = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
      gsap.set(spans, { opacity: 0.16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      spans.forEach((span, i) => {
        tl.to(span, { opacity: 1, ease: "none", duration: 1 }, i);
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [motionEnabled, words.length]);

  if (!motionEnabled) {
    return (
      <section className="border-y" style={{ borderColor: "var(--border)" }}>
        <div className="container-page py-24 md:py-32">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-display text-3xl font-bold leading-tight md:text-5xl">{line}</p>
            <p className="mt-6 text-lg text-[var(--text-muted)]">{body}</p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative border-y" style={{ borderColor: "var(--border)", height: "220vh" }}>
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center">
        <p className="font-display mx-auto max-w-4xl px-6 text-center text-3xl font-bold leading-tight md:text-6xl">
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className="mr-[0.28em] inline-block"
            >
              {word}
            </span>
          ))}
        </p>
        <p className="mt-8 max-w-lg px-6 text-center text-lg text-[var(--text-muted)]">{body}</p>
      </div>
    </section>
  );
}
