"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function noopSubscribe() {
  return () => {};
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsCoarsePointer() {
  return useMediaQuery("(pointer: coarse)");
}

/**
 * For components that render a structurally different DOM tree for their
 * GSAP ScrollTrigger-pinned version vs. their static fallback (PinnedJourney,
 * SpatialReveal). Always starts false so server and first client paint match
 * exactly (no hydration correction), then flips true after mount only on a
 * fine pointer with no reduced-motion preference. GSAP never initializes
 * until this settles, so React never has to tear the pinned tree back down
 * out from under GSAP's pin-spacer wrapper, which is what causes
 * insertBefore crashes when a live media-query listener flips mid-session.
 */
export function useEnableScrollMotion() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // Deliberately synchronous: this must resolve strictly after the DOM
    // this effect's own component rendered has committed and stayed put for
    // one paint, and strictly before any sibling effect (GSAP's pin setup)
    // can touch it. useSyncExternalStore's instant hydration-correction
    // would instead race that GSAP effect and crash; see the doc comment
    // above.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!reduced && !coarse) setEnabled(true);
  }, []);

  return enabled;
}

export { ScrollTrigger };
export default gsap;
