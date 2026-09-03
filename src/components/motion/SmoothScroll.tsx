"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap, { ScrollTrigger } from "@/lib/motion";

/**
 * Lenis smooth scroll, driven off GSAP's ticker so Lenis and every existing
 * ScrollTrigger advance on the same frame (two independent RAF loops produce
 * visible jitter between a pinned element and the page under it).
 *
 * Disabled entirely under `prefers-reduced-motion` and on coarse pointers:
 * touch platforms already have momentum scrolling tuned to the OS, and
 * hijacking it costs more than it adds.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Strong ease-out: the page answers the wheel immediately, then settles.
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links must go through Lenis, otherwise native smooth scrolling
    // fights the loop and the page ends up somewhere between the two.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -100 });
    };
    document.addEventListener("click", onClick);

    // Arriving with a hash already in the URL, the header's "Case Studies"
    // link from another page is the live case. Lenis owns the scroll position
    // once it mounts, so the browser's own jump-to-fragment either never
    // happens or is immediately overwritten, leaving the visitor at the top of
    // a very long page wondering where they were sent. Two frames of delay
    // lets layout settle before measuring, otherwise the target's offset is
    // read before images above it have reserved their space.
    let hashRaf = 0;
    if (window.location.hash.length > 1) {
      hashRaf = requestAnimationFrame(() => {
        hashRaf = requestAnimationFrame(() => {
          const target = document.querySelector(window.location.hash);
          if (target) lenis.scrollTo(target as HTMLElement, { offset: -100, immediate: true });
        });
      });
    }

    return () => {
      cancelAnimationFrame(hashRaf);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
