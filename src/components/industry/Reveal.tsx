"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap, { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Lightweight fade-and-rise on scroll for otherwise-static sections
 * (capability tabs, services list, engagement steps, governance, case
 * studies). Signals hierarchy as the reader moves down the page; skipped
 * entirely under reduced motion so the DOM never depends on it.
 */
export function Reveal({
  children,
  className = "",
  y = 16,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion, y, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
