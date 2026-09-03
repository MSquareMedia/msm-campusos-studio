"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, Plus } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/industry/Reveal";

type RoleCategory = { title: string; description: string };

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * Disciplines rendered as an accordion rather than a static card grid.
 *
 * These stay role CATEGORIES, not job requisitions: SOTAPO does not run
 * a public requisition board, so listing invented postings, headcounts, or
 * locations would misrepresent the company. Each row expands to the discipline
 * detail and hands off to the open application below.
 *
 * Only one row is open at a time, a second open row would push the first one
 * off screen mid-read, which is the usual failure of multi-open accordions.
 */
export function RoleCategories({
  heading,
  intro,
  categories,
  ctaLabel,
}: {
  heading: string;
  intro: string;
  categories: RoleCategory[];
  ctaLabel: string;
}) {
  const [open, setOpen] = useState<string | null>(categories[0]?.title ?? null);
  const reduced = useReducedMotion();

  return (
    <section style={{ background: "var(--surface-muted)" }}>
      <div className="container-page py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-[var(--text-muted)]">{intro}</p>
        </Reveal>

        <div className="mt-12 max-w-3xl border-t" style={{ borderColor: "var(--field-border)" }}>
          {categories.map((category, i) => {
            const isOpen = open === category.title;
            const panelId = `role-panel-${i}`;
            const buttonId = `role-trigger-${i}`;
            return (
              <div key={category.title} className="border-b" style={{ borderColor: "var(--field-border)" }}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : category.title)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left
                               transition-[color,transform] duration-200
                               [transition-timing-function:var(--ease-out-strong)]
                               hover:text-[var(--brand-accent)] active:scale-[0.995]"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-display text-xs font-semibold tabular-nums text-[var(--text-muted)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-xl font-bold md:text-2xl">{category.title}</span>
                    </span>
                    {/* A rotating plus reads as open/close without needing two
                        icons to cross-fade, and rotation is transform-only. */}
                    <Plus
                      size={20}
                      weight="bold"
                      aria-hidden="true"
                      className="shrink-0 transition-transform duration-300 [transition-timing-function:var(--ease-out-strong)]"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: reduced ? 0.01 : 0.34, ease: EASE_OUT },
                        opacity: { duration: reduced ? 0.01 : 0.22, ease: EASE_OUT },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pl-0 md:pl-10">
                        <p className="max-w-prose text-[var(--text-muted)]">{category.description}</p>
                        <a
                          href="#open-application"
                          className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold
                                     transition-transform duration-200
                                     [transition-timing-function:var(--ease-out-strong)]
                                     hover:translate-x-0.5 active:scale-[0.97]"
                          style={{ color: "var(--brand-accent-dark)" }}
                        >
                          {ctaLabel}
                          <ArrowDown size={15} weight="bold" aria-hidden="true" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
