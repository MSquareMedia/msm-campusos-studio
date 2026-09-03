"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap, { usePrefersReducedMotion } from "@/lib/motion";

const PARTS = /^([^\d]*)([\d,]+)(.*)$/;

/**
 * Animates a stat's numeric portion counting up from 0 on scroll-into-view
 * (matches the count-up pattern on srvedge.com / srvmedia.com). Preserves
 * any non-numeric prefix ("₹") and suffix ("+", "%", " Cr+", "k+") exactly
 * as written, so it works for every value shape already in the content
 * files without per-stat configuration. Renders the final value immediately
 * under reduced motion or when the string isn't a simple number.
 */
export function CountUpStat({
  value,
  className = "",
  style,
}: {
  value: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const match = value.match(PARTS);

  useEffect(() => {
    if (reducedMotion || !match || !ref.current) return;
    const [, prefix, digits, suffix] = match;
    const target = parseInt(digits.replace(/,/g, ""), 10);
    const hasCommas = digits.includes(",");
    const el = ref.current;
    const counter = { n: 0 };

    const write = (n: number) => {
      el.textContent = prefix + (hasCommas ? n.toLocaleString("en-US") : String(n)) + suffix;
    };

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => write(Math.round(counter.n)),
        // The tween is an embellishment on a number that is already correct in
        // the DOM. If frames are throttled, a backgrounded tab, low-power
        // mode, onUpdate can fire once at zero and then never again, leaving
        // "0%" on screen under a label like "drop in cost per application".
        // A stalled animation may cost the flourish; it must never publish a
        // wrong figure. onComplete and onInterrupt both settle on the truth.
        onComplete: () => {
          settled = true;
          write(target);
        },
        onInterrupt: () => write(target),
      });
    });

    // Belt and braces for the case the callbacks above cannot cover: if the
    // frame loop stops outright, onUpdate may have already written "0" and
    // neither onComplete nor onInterrupt will ever fire. Timers keep running
    // when rAF does not, so this is the one guarantee that the correct figure
    // ends up on screen. Comfortably longer than the 1.6s tween, so it never
    // cuts a healthy animation short.
    let settled = false;
    const failsafe = window.setTimeout(() => {
      if (!settled) write(target);
    }, 3200);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [reducedMotion, match]);

  return (
    <span ref={ref} className={className} style={style}>
      {value}
    </span>
  );
}
