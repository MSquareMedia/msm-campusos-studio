"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { industryNav, solutionsMega } from "@/lib/site-config";

export type MenuId = "industries" | "solutions";

export type MenuProps = {
  id: MenuId;
  label: string;
  open: boolean;
  triggerRef: (el: HTMLButtonElement | null) => void;
  onToggle: () => void;
  onHoverOpen: () => void;
  onHoverClose: () => void;
  onKeepOpen: () => void;
  onNavigate: () => void;
};

/**
 * The header's two desktop menus.
 *
 * Both use the same shell so the header speaks one language: a full-width
 * panel dropping from the bottom edge of the header, square corners, one
 * hairline, one accent. Solutions is the wide one because it has to carry the
 * five macro service groups; Industries is the same panel at four columns.
 *
 * Interaction model is a disclosure, not an ARIA menu. `role="menu"` would
 * promise the application-menu keyboard model (arrow keys move focus, Tab
 * exits the whole widget) which is wrong for a set of navigation links, and
 * which the previous dropdown claimed without implementing. A button with
 * `aria-expanded` plus ordinary links is what site navigation actually wants:
 * pointer users get hover, keyboard users get Enter or Space to open, Tab to
 * walk the links, Escape to close and land back on the trigger. Focus alone
 * never opens the panel, so tabbing past Solutions is not an ambush of eleven
 * extra stops.
 *
 * The panel sits directly after its own trigger in the DOM and is positioned
 * against the header, so the tab order reads trigger then its columns then the
 * next trigger, while the panel still spans the full page width. `inert` keeps
 * a closed panel out of both the tab order and the accessibility tree, and
 * focus is never trapped: Tab past the last column continues into the header's
 * CTAs.
 *
 * It stays mounted and animates opacity and transform, so a fast
 * open-close-open retargets mid-flight instead of restarting from zero.
 */
const panelShell =
  // whitespace-normal: the panel lives inside the nav, which is nowrap so the
  // row itself can never break. Without this reset the columns inherit it and
  // every service line runs off into the next column.
  "absolute left-0 right-0 top-full z-40 hidden origin-top whitespace-normal border-b bg-[var(--surface)] md:block " +
  "shadow-[0_24px_64px_rgba(26,26,26,0.10)] " +
  "transition-[opacity,transform] duration-200 [transition-timing-function:var(--ease-out-strong)] " +
  "data-[state=closed]:pointer-events-none data-[state=closed]:-translate-y-2 data-[state=closed]:opacity-0";

const columnTitle =
  "font-display text-sm font-semibold leading-snug transition-colors group-hover:text-[var(--brand-accent)] group-focus-visible:text-[var(--brand-accent)]";

const columnBase =
  "group border-l px-5 py-8 first:border-l-0 first:pl-0 last:pr-0 transition-colors hover:bg-[var(--surface-muted)] focus-visible:bg-[var(--surface-muted)]";

function ColumnHead({ label }: { label: string }) {
  return (
    <span className="flex items-start gap-1.5">
      <span className={columnTitle}>{label}</span>
      <ArrowRight
        size={13}
        weight="bold"
        aria-hidden="true"
        className="mt-0.5 shrink-0 opacity-0 transition-[opacity,transform] duration-200 [transition-timing-function:var(--ease-out-strong)] group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </span>
  );
}

function Menu({
  id,
  label,
  open,
  triggerRef,
  onToggle,
  onHoverOpen,
  onHoverClose,
  onKeepOpen,
  columns,
  children,
}: MenuProps & { columns: 4 | 5; children: React.ReactNode }) {
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        onMouseEnter={onHoverOpen}
        onMouseLeave={onHoverClose}
        className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-[var(--brand-accent)] aria-expanded:text-[var(--brand-accent)]"
      >
        {label}
        <CaretDown
          size={11}
          weight="bold"
          aria-hidden="true"
          className={`transition-transform duration-200 [transition-timing-function:var(--ease-out-strong)] ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={`${id}-panel`}
        aria-labelledby={`${id}-trigger`}
        data-state={open ? "open" : "closed"}
        inert={!open}
        onMouseEnter={onKeepOpen}
        onMouseLeave={onHoverClose}
        className={panelShell}
        style={{ borderColor: "var(--border)" }}
      >
        <div className="container-page">
          <div className={columns === 5 ? "grid grid-cols-5" : "grid grid-cols-4"}>{children}</div>
        </div>
      </div>
    </>
  );
}

export function SolutionsMenu(props: MenuProps) {
  // Sub-service lines only show for the column under the pointer/focus, not
  // all five at once, five simultaneous service lists read as a wall of
  // text before the visitor has chosen a solution to look at.
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <Menu {...props} columns={5}>
      {solutionsMega.map((solution) => {
        const active = activeSlug === solution.slug;
        return (
          <Link
            key={solution.slug}
            href={solution.href}
            onClick={props.onNavigate}
            onMouseEnter={() => setActiveSlug(solution.slug)}
            onFocus={() => setActiveSlug(solution.slug)}
            onMouseLeave={() => setActiveSlug((prev) => (prev === solution.slug ? null : prev))}
            aria-label={`${solution.label} solutions`}
            className={columnBase}
            style={{ borderColor: "var(--border)" }}
          >
            <ColumnHead label={solution.label} />
            <span className="mt-1.5 block text-xs leading-snug text-[var(--text-muted)]">
              {solution.blurb}
            </span>
            <span
              className={`mt-4 block overflow-hidden border-t transition-[max-height,opacity] duration-200 [transition-timing-function:var(--ease-out-strong)] ${
                active ? "max-h-64 pt-4 opacity-100" : "max-h-0 opacity-0"
              }`}
              style={{ borderColor: "var(--border)" }}
            >
              {solution.services.map((service) => (
                <span
                  key={service}
                  className="mb-1.5 block text-[13px] leading-snug text-[var(--text-muted)] last:mb-0"
                >
                  {service}
                </span>
              ))}
            </span>
          </Link>
        );
      })}
    </Menu>
  );
}

export function IndustriesMenu(props: MenuProps) {
  return (
    <Menu {...props} columns={4}>
      {industryNav.map((industry) => (
        <Link
          key={industry.slug}
          href={industry.href}
          onClick={props.onNavigate}
          className={`${columnBase} py-7`}
          style={{ borderColor: "var(--border)" }}
        >
          <ColumnHead label={industry.label} />
          <span className="mt-1.5 block text-xs leading-snug text-[var(--text-muted)]">
            {industry.blurb}
          </span>
        </Link>
      ))}
    </Menu>
  );
}
