"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { House, Buildings, Stack, Bank } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import gsap, { usePrefersReducedMotion } from "@/lib/motion";
import { Reveal } from "../Reveal";
import type { CapabilityGroup, ModernServiceItem } from "@/content/types";

const ASSET_TYPE_ICONS: Icon[] = [House, Buildings, Stack, Bank];

type AssetType = {
  id: string;
  label: string;
  description: string;
  capabilityRefs: string[];
};

/**
 * Interactive asset-type selector, answering "what capability mix applies to
 * my property" without inventing any performance projections. Every card it
 * renders is a real title + description already approved in
 * `capabilityGroups[].items[]` or `modernServices.items[]`, this component
 * only curates which existing items apply to which asset type by exact
 * title match, it never writes new claims of its own. Analogous in
 * *interactivity* to a competitor's ROI calculator widget, without
 * fabricating leads/CPL/booking numbers this codebase has no honest
 * benchmark for (see the no-fabricated-stats discipline in
 * src/content/real-estate.ts).
 *
 * Motion is a direct, un-pinned gsap.fromTo stagger on tab change (no
 * ScrollTrigger, no `pin: true`), safe under this codebase's documented
 * pin-spacer crash history, and skipped outright under reduced motion.
 */
export function CapabilityExplorer({
  heading,
  intro,
  assetTypes,
  capabilityGroups,
  modernServiceItems,
}: {
  heading: string;
  intro: string;
  assetTypes: AssetType[];
  capabilityGroups: CapabilityGroup[];
  modernServiceItems: ModernServiceItem[];
}) {
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const itemsByTitle = useMemo(() => {
    const map = new Map<string, { title: string; description: string }>();
    for (const group of capabilityGroups) {
      for (const item of group.items) {
        if (!map.has(item.title)) map.set(item.title, item);
      }
    }
    for (const item of modernServiceItems) {
      if (!map.has(item.title)) map.set(item.title, item);
    }
    return map;
  }, [capabilityGroups, modernServiceItems]);

  const activeType = assetTypes[active];
  const resolvedItems = useMemo(
    () => activeType.capabilityRefs.map((ref) => itemsByTitle.get(ref)).filter(Boolean) as Array<{
      title: string;
      description: string;
    }>,
    [activeType, itemsByTitle]
  );

  useEffect(() => {
    if (reducedMotion || !panelRef.current) return;
    const cards = panelRef.current.querySelectorAll("[data-capability-card]");
    if (!cards.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.035 }
      );
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reducedMotion]);

  return (
    // No background of its own, see ModernServicesExplorer's note on why.
    <section id="capability-explorer">
      <div className="container-page py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-[var(--text-muted)]">{intro}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
          <div
            role="tablist"
            aria-label="Asset type"
            className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {assetTypes.map((type, i) => {
              const TypeIcon = ASSET_TYPE_ICONS[i % ASSET_TYPE_ICONS.length];
              const isActive = i === active;
              return (
                <button
                  key={type.id}
                  type="button"
                  role="tab"
                  id={`asset-type-tab-${type.id}`}
                  aria-selected={isActive}
                  aria-controls="asset-type-panel"
                  onClick={() => setActive(i)}
                  className="group flex w-[min(80vw,320px)] shrink-0 items-start gap-4 border p-5 text-left transition-colors duration-300 lg:w-full lg:shrink"
                  style={{
                    borderColor: isActive ? "var(--brand-accent)" : "var(--border)",
                    background: isActive ? "var(--surface-inverse)" : "var(--surface)",
                  }}
                >
                  <TypeIcon
                    size={26}
                    weight={isActive ? "fill" : "regular"}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                    color={isActive ? "var(--brand-accent)" : "var(--text-muted)"}
                  />
                  <span className="flex flex-col gap-1">
                    <span
                      className="font-display text-base font-semibold"
                      style={{ color: isActive ? "var(--text-inverse)" : "var(--text)" }}
                    >
                      {type.label}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: isActive ? "var(--text-inverse-muted)" : "var(--text-muted)" }}
                    >
                      {type.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            ref={panelRef}
            role="tabpanel"
            id="asset-type-panel"
            aria-labelledby={`asset-type-tab-${activeType.id}`}
            className="grid content-start gap-3 sm:grid-cols-2"
          >
            {resolvedItems.map((item) => (
              <div
                key={item.title}
                data-capability-card
                className="border p-5"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <h3 className="font-display text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
