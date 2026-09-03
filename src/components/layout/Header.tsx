"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { MSMLogo } from "./MSMLogo";
import { SolutionsMenu, IndustriesMenu, type MenuId } from "./NavMenus";
import { industryNav, solutionsNav, primaryCta, caseStudiesLink } from "@/lib/site-config";
import { AuditCTA } from "./AuditCTA";

type NavGroup = { slug: string; label: string; href: string; blurb: string };

function MobileGroup({ label, items, onNavigate }: { label: string; items: NavGroup[]; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b py-1" style={{ borderColor: "var(--border)" }}>
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 font-display font-medium"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        {label}
        <CaretDown size={14} weight="bold" aria-hidden="true" className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="flex flex-col gap-1 pb-3 pl-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="py-2 text-sm text-[var(--text-muted)]"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<MenuId | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  /** Pointer open. Hovering one trigger while another panel is open swaps them
      with no close-open flicker, because the panel is one shared shell. */
  const hoverOpen = useCallback(
    (id: MenuId) => {
      cancelClose();
      setMenu(id);
    },
    [cancelClose],
  );

  /** The 140ms grace is the diagonal: the pointer has to cross a gap between
      the trigger and the panel to reach the columns, and closing on the first
      frame of that journey is the classic dropdown that cannot be caught. */
  const hoverClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  }, [cancelClose]);

  const closeNow = useCallback(() => {
    cancelClose();
    setMenu(null);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  /** Escape closes and returns focus to the trigger the user opened, so the
      keyboard never lands somewhere it did not ask to be. */
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && menu) {
      const trigger = triggers.current[menu];
      closeNow();
      trigger?.focus();
    }
  }

  /** Focus is never trapped, so the panel has to know when the keyboard has
      walked away from it: anything focused outside the open panel and its own
      trigger closes it. Tab from the last column lands on the next trigger and
      the previous panel goes with it, rather than hanging open behind a menu
      the user has already left. */
  function onFocusCapture(event: React.FocusEvent<HTMLDivElement>) {
    if (!menu) return;
    const target = event.target as HTMLElement;
    if (target === triggers.current[menu]) return;
    if (document.getElementById(`${menu}-panel`)?.contains(target)) return;
    closeNow();
  }

  /** Focus leaving the header entirely (Tab past the CTAs, or a click into the
      page) closes it too, which focusin alone cannot see. */
  function onBlurCapture(event: React.FocusEvent<HTMLDivElement>) {
    if (!menu) return;
    const next = event.relatedTarget as Node | null;
    if (!next || !event.currentTarget.contains(next)) closeNow();
  }

  return (
    <header
      className="sticky top-0 z-50 border-b bg-[var(--surface)]/95 backdrop-blur"
      style={{ borderColor: "var(--border)", height: "var(--header-height)" }}
    >
      <a href="#main-content" className="sr-only-focusable">
        Skip to content
      </a>
      {/* The panels live next to their triggers in the DOM, for tab order, but
          position against this wrapper, so a five-column menu can run the full
          width of the page instead of hanging off a 90px word. */}
      <div className="relative h-full" onKeyDown={onKeyDown} onFocusCapture={onFocusCapture} onBlurCapture={onBlurCapture}>
        <div className="container-page flex h-full items-center justify-between gap-4">
          <MSMLogo />

          {/* One line at every desktop width is the constraint that shapes this
              row. The budget at 768px is 688px of content: logo, four nav
              items and the audit button, which leaves 85px of slack. Careers
              is the item that waits for lg, because it is the least-visited of
              the five and it is also in the footer and the mobile sheet; the
              contact link waits for lg too. Gaps open as the viewport does. */}
          <nav
            className="hidden md:flex items-center gap-4 whitespace-nowrap font-display text-sm font-medium lg:gap-5 xl:gap-6"
            aria-label="Primary"
          >
            <Link href="/about" className="transition-colors hover:text-[var(--brand-accent)]">
              About Us
            </Link>
            <SolutionsMenu
              id="solutions"
              label="Solutions"
              open={menu === "solutions"}
              triggerRef={(el) => {
                triggers.current.solutions = el;
              }}
              onToggle={() => (menu === "solutions" ? closeNow() : hoverOpen("solutions"))}
              onHoverOpen={() => hoverOpen("solutions")}
              onHoverClose={hoverClose}
              onKeepOpen={cancelClose}
              onNavigate={closeNow}
            />
            <IndustriesMenu
              id="industries"
              label="Industries"
              open={menu === "industries"}
              triggerRef={(el) => {
                triggers.current.industries = el;
              }}
              onToggle={() => (menu === "industries" ? closeNow() : hoverOpen("industries"))}
              onHoverOpen={() => hoverOpen("industries")}
              onHoverClose={hoverClose}
              onKeepOpen={cancelClose}
              onNavigate={closeNow}
            />
            <Link
              href={caseStudiesLink.href}
              className="transition-colors hover:text-[var(--brand-accent)]"
              onMouseEnter={hoverClose}
            >
              {caseStudiesLink.label}
            </Link>
            <Link
              href="/careers"
              className="hidden transition-colors hover:text-[var(--brand-accent)] lg:inline"
            >
              Careers
            </Link>
          </nav>

          {/* Audit takes the accent fill; contact steps down to a text link.
              Both filled would read as two equal priorities, which is the same
              as no priority. */}
          <div className="hidden shrink-0 items-center gap-4 md:flex">
            <Link
              href={primaryCta.href}
              className="hidden whitespace-nowrap font-display text-sm font-medium transition-colors hover:text-[var(--brand-accent)] lg:inline"
            >
              {primaryCta.label}
            </Link>
            <AuditCTA className="md:px-3.5 lg:px-5" />
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M4 4L18 18M18 4L4 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2 6H20M2 11H20M2 16H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t bg-[var(--surface)] max-h-[calc(100dvh-var(--header-height))] overflow-y-auto"
          style={{ borderColor: "var(--border)" }}
          aria-label="Primary"
        >
          <div className="container-page flex flex-col py-2">
            <Link
              href="/about"
              className="border-b py-3 font-display font-medium"
              style={{ borderColor: "var(--border)" }}
              onClick={() => setOpen(false)}
            >
              About Us
            </Link>
            <MobileGroup label="Solutions" items={solutionsNav} onNavigate={() => setOpen(false)} />
            <MobileGroup label="Industries" items={industryNav} onNavigate={() => setOpen(false)} />
            <Link
              href={caseStudiesLink.href}
              className="border-b py-3 font-display font-medium"
              style={{ borderColor: "var(--border)" }}
              onClick={() => setOpen(false)}
            >
              {caseStudiesLink.label}
            </Link>
            <Link
              href="/careers"
              className="py-3 font-display font-medium"
              onClick={() => setOpen(false)}
            >
              Careers
            </Link>
            <AuditCTA className="mt-4 justify-center" />
            <Link
              href={primaryCta.href}
              className="btn btn-secondary mt-3 justify-center"
              onClick={() => setOpen(false)}
            >
              {primaryCta.label}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
