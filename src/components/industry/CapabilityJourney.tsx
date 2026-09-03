"use client";

import { useState } from "react";
import {
  Megaphone,
  Target,
  Toolbox,
  TrendUp,
  HeartStraight,
  MagnifyingGlass,
  ChartLineUp,
  Handshake,
  Compass,
  Sparkle,
  Briefcase,
  GraduationCap,
  ChalkboardTeacher,
  Certificate,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";
import type { CapabilityGroup } from "@/content/types";

const GROUP_ICONS: Record<string, Icon> = {
  "Create demand": Megaphone,
  "Convert active shoppers": Target,
  "Equip markets and dealers": Toolbox,
  "Grow owner value": TrendUp,
  "Build trust and understanding": HeartStraight,
  "Help people find care": MagnifyingGlass,
  "Grow priority services and referrals": ChartLineUp,
  "Strengthen relationships after the first interaction": Handshake,
  "Define the place": Compass,
  "Make it visible and vivid": Sparkle,
  "Create qualified demand": Target,
  "Help sales and leasing teams convert it": Briefcase,
  "Grow enrolment": GraduationCap,
  "Build the brand": Megaphone,
  "Strengthen delivery": ChalkboardTeacher,
  "Prove outcomes": Certificate,
};

/**
 * Four capability groups, four items each: sixteen short paragraphs, of which
 * exactly four should ever be visible. The tabs already did that job; what
 * changed is the shape underneath them. Boxed cards made every item look like
 * a product tile of equal weight. Hairline rows with an oversized index mark
 * read as a contents page, which is what this is.
 *
 * The panel swap is a short cross-fade with a small rise. Anything longer and
 * the tab stops feeling like a control.
 */
export function CapabilityJourney({
  heading,
  intro,
  groups,
}: {
  heading: string;
  intro?: string;
  groups: CapabilityGroup[];
}) {
  const [active, setActive] = useState(0);
  const group = groups[active];
  const reduced = useReducedMotion();
  const GroupIcon = GROUP_ICONS[group.title] ?? Sparkle;

  return (
    <section className="container-page py-24 md:py-36">
      <div className="max-w-3xl">
        <TextReveal
          lines={toLines(heading)}
          className="font-display text-3xl font-bold leading-[1.06] md:text-5xl"
        />
        {intro && (
          <FadeUp delay={0.1}>
            <p className="mt-5 text-lg text-[var(--text-muted)]">{intro}</p>
          </FadeUp>
        )}
      </div>

      <div
        role="tablist"
        aria-label={heading}
        className="mt-12 flex flex-wrap gap-x-1 gap-y-1 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {groups.map((g, i) => {
          const TabIcon = GROUP_ICONS[g.title] ?? Sparkle;
          return (
            <button
              key={g.title}
              role="tab"
              id={`capability-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`capability-panel-${i}`}
              onClick={() => setActive(i)}
              className="relative flex items-center gap-2.5 px-3 py-4 font-display text-sm font-semibold transition-colors duration-200 active:scale-[0.98] sm:px-4 sm:text-base"
              style={{ color: i === active ? "var(--text)" : "var(--text-muted)" }}
            >
              <TabIcon size={24} weight={i === active ? "fill" : "regular"} aria-hidden="true" />
              {g.title}
              {i === active && (
                <motion.span
                  layoutId="capability-tab-underline"
                  className="absolute inset-x-0 -bottom-px h-[2px]"
                  style={{ background: "var(--brand-accent)" }}
                  transition={
                    reduced ? { duration: 0 } : { duration: 0.35, ease: [0.23, 1, 0.32, 1] }
                  }
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`capability-panel-${active}`}
        aria-labelledby={`capability-tab-${active}`}
        className="relative mt-12 overflow-hidden"
      >
        <GroupIcon
          size={260}
          weight="thin"
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 hidden opacity-[0.045] lg:block"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={group.title}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="relative grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16"
          >
            <p className="font-display max-w-sm text-2xl font-bold leading-snug md:sticky md:top-[calc(var(--header-height)+3rem)] md:self-start md:text-3xl">
              {group.summary}
            </p>

            <ul className="border-t" style={{ borderColor: "var(--border)" }}>
              {group.items.map((item, i) => (
                <li
                  key={item.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-b py-6 md:gap-8"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="font-display pt-1 text-sm font-semibold tabular-nums"
                    style={{ color: "var(--brand-accent)" }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold md:text-xl">{item.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
