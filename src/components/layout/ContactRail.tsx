"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { ContactForm } from "@/components/forms/ContactForm";

/**
 * A vertical "Contact Us" tab fixed to the right edge of the viewport,
 * present on every page, opening the same form as /contact in a
 * side panel rather than a full navigation.
 *
 * Sits at vertical centre so it never collides with OSiQ's launcher, which
 * lives in the bottom-right corner, two right-edge affordances would read
 * as competing exits from the page if they were stacked on top of each other.
 */
export function ContactRail() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Escape closes and returns focus to the tab, same pattern as OSiQ's panel.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLElement>("input, textarea")?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Contact us"
        className="fixed right-0 top-1/2 z-[65] flex -translate-y-1/2 items-center gap-2 rounded-l-lg px-3 py-4 font-display text-sm font-semibold tracking-wide text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-[background-color,padding-right] duration-200 [transition-timing-function:var(--ease-out-strong)] hover:bg-[var(--brand-accent-dark)] hover:pr-4 active:scale-[0.98]"
        style={{
          background: "var(--brand-accent)",
          writingMode: "vertical-rl",
        }}
      >
        <span className="rotate-180">Contact Us</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close contact form"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Contact SOTAPO"
              className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col overflow-y-auto bg-[var(--surface)] p-8 shadow-[-20px_0_60px_rgba(0,0,0,0.22)] md:p-10"
              initial={reduced ? undefined : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduced ? undefined : { x: "100%" }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow" style={{ color: "var(--brand-accent)" }}>
                    SOTAPO
                  </p>
                  <h2 className="font-display mt-2 text-2xl font-bold leading-[1.1] md:text-3xl">
                    Start a conversation.
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="shrink-0 rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-black/5 hover:text-[var(--text)]"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mt-4 text-[var(--text-muted)]">
                Tell us who you are and what you need. One screen, no questionnaire.
              </p>

              <div className="mt-8">
                <ContactForm />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
