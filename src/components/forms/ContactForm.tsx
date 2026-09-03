"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import { TextAreaField, TextField } from "./Fields";
import { email, fullName, minLength } from "./validators";
import type { FieldDef, FlowValues } from "./types";

/**
 * The contact form: one screen, five fields, one button.
 *
 * Deliberately NOT the step flow used by the free assessment. That flow earns
 * its length because the assessment is the product, each answer changes what
 * gets reviewed, so walking someone through it question by question is the
 * point. Somebody who has decided to get in touch has already converted; making
 * them page through six screens to say "here is my email and what I need" adds
 * friction to a decision they have already taken.
 *
 * Same field primitives, validators and error copy as the flow, so the two
 * surfaces stay consistent without sharing an interaction model.
 */

const FIELDS: FieldDef[] = [
  {
    kind: "text",
    name: "name",
    label: "Full name",
    autoComplete: "name",
    validate: fullName,
  },
  {
    kind: "text",
    name: "email",
    type: "email",
    label: "Work email",
    example: "you@organisation.com",
    autoComplete: "email",
    validate: email,
  },
  {
    kind: "text",
    name: "company",
    label: "Company or institution",
    autoComplete: "organization",
    help: "Optional. Skip it if your email already says it.",
    emptyLabel: "Not given",
  },
  {
    kind: "textarea",
    name: "message",
    label: "What do you need help with?",
    rows: 5,
    maxLength: 1200,
    validate: minLength(
      15,
      "Tell us what you are after, even in a line.",
      "A sentence or two, so we know who should reply.",
    ),
  },
];

export function ContactForm() {
  const reduced = useReducedMotion();
  const [values, setValues] = useState<FlowValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const setValue = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the error as soon as they start fixing it. Re-validation happens
    // on submit, never per keystroke, telling someone their email is invalid
    // while they are still typing it is just nagging.
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;

    const found: Record<string, string> = {};
    for (const field of FIELDS) {
      const message = field.validate?.(values[field.name] ?? "", values);
      if (message) found[field.name] = message;
    }
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Focus the first thing that is actually wrong, so a keyboard or screen
      // reader user is taken to the problem rather than told one exists.
      const firstBad = FIELDS.find((f) => found[f.name]);
      if (firstBad) {
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${CSS.escape(firstBad.name)}"]`)
          ?.focus();
      }
      return;
    }

    setSending(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "contact", payload: values }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // Never show a success state for a message that did not save.
        setSubmitError(
          data?.code === "not_configured"
            ? "This form is not connected to our inbox yet, so nothing was saved. Please email us instead."
            : "Something went wrong sending this, and your message was not saved. Please try again.",
        );
        setSending(false);
        return;
      }
      setSent(true);
    } catch {
      setSubmitError(
        "We could not reach the server, so nothing was saved. Check your connection and try again.",
      );
    }
    setSending(false);
  }

  if (sent) {
    return (
      <motion.div
        role="status"
        className="border p-8 md:p-10"
        style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <CheckCircle size={30} weight="fill" style={{ color: "var(--brand-accent)" }} />
        <h2 className="font-display mt-4 text-2xl font-bold">
          {values.name?.trim() ? `Thanks, ${values.name.trim()}.` : "Thanks."}
        </h2>
        <p className="mt-3 max-w-md text-[var(--text-muted)]">
          Your message has been saved to the SOTAPO intake and the team can see it. We have
          not set a turnaround promise here, so if it is urgent, do follow up through the MSM Unify
          site as well.
        </p>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="max-w-xl">
      <div className="flex flex-col gap-6">
        {FIELDS.map((field) =>
          field.kind === "textarea" ? (
            <TextAreaField
              key={field.name}
              field={field}
              value={values[field.name] ?? ""}
              error={errors[field.name]}
              onChange={(v) => setValue(field.name, v)}
            />
          ) : field.kind === "text" ? (
            <TextField
              key={field.name}
              field={field}
              value={values[field.name] ?? ""}
              error={errors[field.name]}
              onChange={(v) => setValue(field.name, v)}
            />
          ) : null,
        )}
      </div>

      {submitError && (
        <p
          role="alert"
          className="mt-6 border-l-2 py-2 pl-3 text-sm"
          style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
        >
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 font-display text-sm font-semibold text-white transition-[background-color,transform,opacity] duration-200 [transition-timing-function:var(--ease-out-strong)] active:scale-[0.97] disabled:opacity-70"
        style={{ background: "var(--brand-accent)", borderRadius: "var(--radius-control)" }}
      >
        {sending ? "Sending…" : "Send message"}
        <PaperPlaneTilt size={16} weight="bold" aria-hidden="true" />
      </button>
    </form>
  );
}
