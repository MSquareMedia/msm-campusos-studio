"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export type IndexEntry = { title: string; description: string; group?: string };

/**
 * A long capability list presented as an index rather than a wall of cards.
 *
 * The whole point is that only one description is on screen at a time. Twelve
 * services rendered as twelve cards is twelve paragraphs the reader has to
 * skim past; as an index it is twelve short lines they can scan in two
 * seconds, with the prose arriving only for the one they pointed at.
 *
 * Pointer-in selects on desktop because hovering an index is the natural
 * gesture, but the rows are real buttons, so keyboard focus and taps select
 * too. Nothing is hidden from a screen reader: every description stays in the
 * DOM inside the row it belongs to, visually collapsed on wide screens where
 * the side panel is doing the showing.
 */
export function IndexExplorer({
  entries,
  className = "",
}: {
  entries: IndexEntry[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = entries[active];

  return (
    <div className={`grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-16 ${className}`}>
      <ul className="border-t" style={{ borderColor: "var(--border)" }}>
        {entries.map((entry, i) => (
          <li key={entry.title} className="border-b" style={{ borderColor: "var(--border)" }}>
            {/* A new phase label prints only when it changes from the row
                above, so an ungrouped list (no `group` set on any entry)
                never prints anything here. */}
            {entry.group && entry.group !== entries[i - 1]?.group && (
              <p
                className={`font-display text-xs font-semibold uppercase tracking-wider ${i === 0 ? "pt-0" : "pt-6"}`}
                style={{ color: "var(--brand-accent)" }}
              >
                {entry.group}
              </p>
            )}
            <button
              type="button"
              onPointerEnter={(e) => {
                // Touch fires pointerenter immediately before the tap, which
                // would make the row select on the way past. Only a real
                // hovering device should preselect.
                if (e.pointerType === "mouse") setActive(i);
              }}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-current={i === active}
              className="group flex w-full items-baseline gap-5 py-4 text-left transition-transform duration-[350ms] [transition-timing-function:var(--ease-out-strong)] hover:translate-x-2 md:py-5"
            >
              <span
                className="font-display shrink-0 text-xs font-semibold tabular-nums transition-colors"
                style={{ color: i === active ? "var(--brand-accent)" : "var(--text-muted)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">
                <span
                  className="font-display block text-xl font-bold leading-tight transition-colors md:text-3xl"
                  style={{ color: i === active ? "var(--text)" : "var(--text-muted)" }}
                >
                  {entry.title}
                </span>
                {/* Visible only where there is no side panel to carry it. */}
                <span className="mt-2 block text-sm text-[var(--text-muted)] md:hidden">
                  {entry.description}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="hidden md:block" aria-hidden="true">
        <div className="sticky top-[calc(var(--header-height)+4rem)]">
          <span
            className="font-display block text-[7rem] font-extrabold leading-none tabular-nums"
            style={{ color: "transparent", WebkitTextStroke: "1px var(--border)" }}
          >
            {String(active + 1).padStart(2, "0")}
          </span>
          <AnimatePresence mode="wait">
            <motion.p
              key={current.title}
              className="mt-6 max-w-sm text-lg leading-relaxed text-[var(--text-muted)]"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              {current.description}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
