"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  PencilSimple,
  PaperPlaneTilt,
  Keyboard,
} from "@phosphor-icons/react/dist/ssr";
import { ChoiceField, MultiChoiceField, TextAreaField, TextField } from "./Fields";
import { isAutoAdvanceStep, parseMulti, type FlowValues, type StepDef } from "./types";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** How long a chosen option stays visibly selected before the step advances. */
const AUTO_ADVANCE_MS = 280;
const AUTO_ADVANCE_MS_REDUCED = 120;

type Phase = "steps" | "review" | "sending" | "done";

export type StepFlowProps = {
  steps: StepDef[];
  /** Heading for the built-in review step. */
  reviewQuestion: string;
  reviewHelp?: string;
  submitLabel: string;
  /** Rendered once the flow completes. Receives the collected answers. */
  renderSuccess: (values: FlowValues, restart: () => void) => React.ReactNode;
  /** Namespaces field ids so two flows can coexist on one page. */
  idPrefix: string;
  /** Which intake this is. Stored against the row so admin can filter. */
  kind: "audit" | "contact" | "careers";
};

export function StepFlow({
  steps,
  reviewQuestion,
  reviewHelp,
  submitLabel,
  renderSuccess,
  idPrefix,
  kind,
}: StepFlowProps) {
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [phase, setPhase] = useState<Phase>("steps");
  const [values, setValues] = useState<FlowValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stepRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Suppresses the focus grab on first paint so the page does not steal focus. */
  const hasMoved = useRef(false);

  const onReview = phase === "review" || phase === "sending";
  const step = steps[index];
  const total = steps.length + 1; // + review
  const position = onReview ? total : index + 1;
  const progress = position / total;

  const clearTimer = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  };
  useEffect(() => clearTimer, []);

  /* ---------------------------------------------------------------- values */

  const setValue = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the error the moment the person starts fixing it. Re-validation
    // happens on the next advance, never on every keystroke, validating as
    // someone types tells them they are wrong before they have finished.
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const validateStep = useCallback(
    (target: StepDef) => {
      const found: Record<string, string> = {};
      for (const field of target.fields) {
        const message = field.validate?.(values[field.name] ?? "", values);
        if (message) found[field.name] = message;
      }
      return found;
    },
    [values],
  );

  /* ------------------------------------------------------------ navigation */

  const goNext = useCallback(
    (skipValidation = false) => {
      clearTimer();
      if (phase !== "steps") return;

      if (!skipValidation) {
        const found = validateStep(step);
        if (Object.keys(found).length > 0) {
          setErrors(found);
          // Put focus on the first thing that is actually wrong.
          const firstBad = step.fields.find((f) => found[f.name]);
          if (firstBad) {
            const el = stepRef.current?.querySelector<HTMLElement>(
              `[name="${CSS.escape(firstBad.name)}"]`,
            );
            el?.focus();
          }
          return;
        }
      }

      hasMoved.current = true;
      setDirection(1);
      if (index === steps.length - 1) setPhase("review");
      else setIndex((i) => i + 1);
    },
    [index, phase, step, steps.length, validateStep],
  );

  const goBack = useCallback(() => {
    clearTimer();
    hasMoved.current = true;
    setDirection(-1);
    setErrors({});
    if (phase === "review") {
      setPhase("steps");
      setIndex(steps.length - 1);
      return;
    }
    if (index > 0) setIndex((i) => i - 1);
  }, [index, phase, steps.length]);

  const jumpTo = useCallback((target: number) => {
    clearTimer();
    hasMoved.current = true;
    setDirection(-1);
    setErrors({});
    setPhase("steps");
    setIndex(target);
  }, []);

  const restart = useCallback(() => {
    setValues({});
    setErrors({});
    setIndex(0);
    setDirection(1);
    setPhase("steps");
  }, []);

  /* --------------------------------------------------------------- submit */

  const submit = useCallback(async () => {
    setPhase("sending");
    setSubmitError(null);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, payload: values }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // Distinguish "not wired up yet" from "we lost your answers", because
        // the first is our problem to fix and the second means they should
        // reach out another way. Either way, never show a success state for a
        // submission that did not save.
        setSubmitError(
          data?.code === "not_configured"
            ? "This form is not connected to our inbox yet, so nothing was saved. Please email us instead."
            : "Something went wrong saving this, and your answers were not stored. Please try again."
        );
        setPhase("review");
        return;
      }
      setPhase("done");
    } catch {
      setSubmitError(
        "We could not reach the server, so nothing was saved. Check your connection and try again."
      );
      setPhase("review");
    }
  }, [kind, values]);

  /* -------------------------------------------------- focus + keyboard --- */

  // Move focus into the newly mounted step. This is a callback ref rather than
  // an effect on `index`, because AnimatePresence mode="wait" does not mount
  // the incoming step until the outgoing one has finished leaving, an effect
  // keyed on the index would fire while the OLD node was still in the DOM and
  // focus the wrong step. The ref fires exactly when the new node lands.
  //
  // Preferred target is the field the person is meant to fill: focusing it
  // announces both the field label and, via aria-live below, the step position.
  const attachStep = useCallback((node: HTMLDivElement | null) => {
    stepRef.current = node;
    if (!node || !hasMoved.current) return;
    const target =
      node.querySelector<HTMLElement>("[data-autofocus='true']") ??
      node.querySelector<HTMLElement>("input, textarea, select, button") ??
      node;
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
  }, []);

  // Escape steps backwards from anywhere in the flow.
  useEffect(() => {
    if (phase === "done") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (index === 0 && phase === "steps") return;
        e.preventDefault();
        goBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBack, index, phase]);

  // Number keys pick an option on single-choice steps, as long as focus is not
  // inside a text control (where digits are legitimate input).
  useEffect(() => {
    if (phase !== "steps" || !isAutoAdvanceStep(step)) return;
    const field = step.fields[0];
    if (field.kind !== "choice") return;

    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement && el.type !== "radio") return;
      if (el instanceof HTMLTextAreaElement) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1) return;
      if (field.kind !== "choice") return;
      const option = field.options[n - 1];
      if (!option) return;
      e.preventDefault();
      setValue(field.name, option.value);
      clearTimer();
      advanceTimer.current = setTimeout(
        () => goNext(true),
        reduced ? AUTO_ADVANCE_MS_REDUCED : AUTO_ADVANCE_MS,
      );
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, phase, reduced, setValue, step]);

  /* ------------------------------------------------------------ animation */

  const enterX = reduced ? 0 : direction * 32;
  const exitX = reduced ? 0 : direction * -32;
  const stepMotion = {
    initial: { opacity: 0, x: enterX },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: exitX },
    transition: { duration: reduced ? 0.15 : 0.28, ease: EASE_OUT },
  };

  /* ---------------------------------------------------------------- views */

  const answered = useMemo(
    () =>
      steps.map((s, i) => ({
        index: i,
        question: s.question,
        eyebrow: s.eyebrow,
        answer: s.fields
          .map((f) => {
            const raw = values[f.name] ?? "";
            if (!raw) return f.emptyLabel ?? "Not provided";
            if (f.kind === "choice") {
              return f.options.find((o) => o.value === raw)?.label ?? raw;
            }
            if (f.kind === "multichoice") {
              // Read back as the labels the person actually saw, not as the
              // ids we happen to store.
              return parseMulti(raw)
                .map((v) => f.options.find((o) => o.value === v)?.label ?? v)
                .join(", ");
            }
            return raw;
          })
          .join(" · "),
      })),
    [steps, values],
  );

  if (phase === "done") {
    return (
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        {renderSuccess(values, restart)}
      </motion.div>
    );
  }

  return (
    <div
      className="border"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {/* Progress: scaleX only, so the bar never triggers layout. */}
      <div className="relative h-[3px] w-full" style={{ background: "var(--border)" }}>
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left"
          style={{ background: "var(--brand-accent)" }}
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: reduced ? 0.15 : 0.5, ease: EASE_OUT }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 border-b px-6 py-3.5 md:px-9" style={{ borderColor: "var(--border)" }}>
        <p className="font-display text-xs font-semibold tabular-nums tracking-[0.18em] text-[var(--text-muted)]">
          <span style={{ color: "var(--text)" }}>{String(position).padStart(2, "0")}</span>
          <span className="mx-1.5">/</span>
          {String(total).padStart(2, "0")}
        </p>
        <p className="hidden items-center gap-2 text-xs text-[var(--text-muted)] sm:flex">
          <Keyboard size={15} aria-hidden="true" />
          <span>
            <kbd className="font-display font-semibold">Enter</kbd> to continue,{" "}
            <kbd className="font-display font-semibold">Esc</kbd> to go back
          </span>
        </p>
      </div>

      {/* Announces the step change for screen-reader users independently of
          where focus lands. */}
      <p aria-live="polite" className="sr-only">
        {onReview
          ? `Final step, ${position} of ${total}. ${reviewQuestion}`
          : `Step ${position} of ${total}. ${step.question}`}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onReview) void submit();
          else goNext();
        }}
        onKeyDown={(e) => {
          // Enter submits from inputs and radios natively. In a textarea Enter
          // has to keep meaning "new line", so the modifier combination people
          // already expect from chat and comment boxes advances instead.
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            if (onReview) void submit();
            else goNext();
          }
        }}
        noValidate
        className="px-6 py-8 md:px-9 md:py-10"
      >
        <div className="min-h-[24rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={onReview ? "__review" : step.id}
              ref={attachStep}
              tabIndex={-1}
              className="outline-none"
              {...stepMotion}
            >
              {onReview ? (
                <ReviewStep
                  idPrefix={idPrefix}
                  question={reviewQuestion}
                  help={reviewHelp}
                  rows={answered}
                  onEdit={jumpTo}
                />
              ) : (
                <>
                  <p className="eyebrow" style={{ color: "var(--brand-accent)" }}>
                    {step.eyebrow}
                  </p>
                  <h2 className="font-display mt-3 text-2xl font-bold leading-[1.15] md:text-[2rem]">
                    {step.question}
                  </h2>
                  {step.help && (
                    <p className="mt-3 max-w-prose text-[var(--text-muted)]">{step.help}</p>
                  )}

                  <div className="mt-8 flex flex-col gap-7">
                    {step.fields.map((field, fi) => {
                      const shared = {
                        value: values[field.name] ?? "",
                        error: errors[field.name],
                        autoFocus: fi === 0,
                      };
                      if (field.kind === "choice") {
                        return (
                          <ChoiceField
                            key={field.name}
                            field={field}
                            {...shared}
                            onSelect={(v, viaArrow) => {
                              setValue(field.name, v);
                              if (!isAutoAdvanceStep(step) || viaArrow) return;
                              clearTimer();
                              advanceTimer.current = setTimeout(
                                () => goNext(true),
                                reduced ? AUTO_ADVANCE_MS_REDUCED : AUTO_ADVANCE_MS,
                              );
                            }}
                          />
                        );
                      }
                      if (field.kind === "multichoice") {
                        return (
                          <MultiChoiceField
                            key={field.name}
                            field={field}
                            {...shared}
                            onChange={(v) => setValue(field.name, v)}
                          />
                        );
                      }
                      if (field.kind === "textarea") {
                        return (
                          <TextAreaField
                            key={field.name}
                            field={field}
                            {...shared}
                            onChange={(v) => setValue(field.name, v)}
                          />
                        );
                      }
                      return (
                        <TextField
                          key={field.name}
                          field={field}
                          {...shared}
                          onChange={(v) => setValue(field.name, v)}
                        />
                      );
                    })}
                  </div>

                  {step.fields.some((f) => f.kind === "textarea") && (
                    <p className="mt-4 text-xs text-[var(--text-muted)]">
                      Enter starts a new line here. Use the Continue button, or ⌘/Ctrl + Enter, to
                      move on.
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* A failed submit returns the user to review with their answers
            intact. Announced, because the failure happens after the button
            press and sighted users get the visual change for free. */}
        {submitError && (
          <p
            role="alert"
            className="mt-6 border-l-2 py-2 pl-3 text-sm"
            style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
          >
            {submitError}
          </p>
        )}

        <div
          className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            type="button"
            onClick={goBack}
            disabled={index === 0 && phase === "steps"}
            className="inline-flex items-center gap-2 px-4 py-3 font-display text-sm font-semibold
                       border transition-[background-color,color,transform,opacity] duration-200
                       [transition-timing-function:var(--ease-out-strong)]
                       hover:bg-[var(--surface-muted)] active:scale-[0.97]
                       disabled:pointer-events-none disabled:opacity-35"
            style={{ borderColor: "var(--field-border)", borderRadius: "var(--radius-control)" }}
          >
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            Back
          </button>

          <button
            type="submit"
            disabled={phase === "sending"}
            className="inline-flex items-center gap-2 px-6 py-3 font-display text-sm font-semibold text-white
                       transition-[background-color,transform,opacity] duration-200
                       [transition-timing-function:var(--ease-out-strong)]
                       active:scale-[0.97] disabled:opacity-70"
            style={{ background: "var(--brand-accent-dark)", borderRadius: "var(--radius-control)" }}
          >
            {onReview ? (
              <>
                {phase === "sending" ? "Sending…" : submitLabel}
                <PaperPlaneTilt size={16} weight="bold" aria-hidden="true" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ----------------------------------------------------------------- review */

function ReviewStep({
  idPrefix,
  question,
  help,
  rows,
  onEdit,
}: {
  idPrefix: string;
  question: string;
  help?: string;
  rows: { index: number; question: string; eyebrow: string; answer: string }[];
  onEdit: (index: number) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <>
      <p className="eyebrow" style={{ color: "var(--brand-accent)" }}>
        Review
      </p>
      <h2 id={`${idPrefix}-review-heading`} className="font-display mt-3 text-2xl font-bold leading-[1.15] md:text-[2rem]">
        {question}
      </h2>
      {help && <p className="mt-3 max-w-prose text-[var(--text-muted)]">{help}</p>}

      <ul className="mt-8 flex flex-col" aria-labelledby={`${idPrefix}-review-heading`}>
        {rows.map((row, i) => (
          <motion.li
            key={row.index}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: i * 0.045, ease: EASE_OUT }}
            className="flex items-start justify-between gap-6 border-b py-4 first:border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {row.eyebrow}
              </p>
              <p className="mt-1 break-words font-display font-semibold">{row.answer}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(row.index)}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold
                         transition-[color,transform] duration-200
                         [transition-timing-function:var(--ease-out-strong)] active:scale-[0.97]"
              style={{ color: "var(--brand-accent-dark)" }}
            >
              <PencilSimple size={14} weight="bold" aria-hidden="true" />
              Edit
              <span className="sr-only"> {row.eyebrow}</span>
            </button>
          </motion.li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------------------------------------- success */

export function SuccessPanel({
  heading,
  lead,
  children,
  honestNote,
  restartLabel,
  onRestart,
}: {
  heading: string;
  lead: string;
  children?: React.ReactNode;
  honestNote: string;
  restartLabel: string;
  onRestart: () => void;
}) {
  const reduced = useReducedMotion();
  return (
    <div
      role="status"
      className="relative overflow-hidden border p-8 md:p-12"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute -right-24 -top-24 block h-64 w-64 rounded-full"
        style={{ background: "var(--danger-soft)" }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      />

      <motion.div
        className="relative"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.55, bounce: 0.22 }}
      >
        <CheckCircle size={44} weight="fill" style={{ color: "var(--brand-accent)" }} aria-hidden="true" />
      </motion.div>

      <motion.h2
        className="font-display relative mt-6 text-2xl font-bold md:text-3xl"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06, ease: EASE_OUT }}
      >
        {heading}
      </motion.h2>

      <motion.p
        className="relative mt-3 max-w-prose text-lg text-[var(--text-muted)]"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: EASE_OUT }}
      >
        {lead}
      </motion.p>

      {children && (
        <motion.div
          className="relative mt-8"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18, ease: EASE_OUT }}
        >
          {children}
        </motion.div>
      )}

      <motion.div
        className="relative mt-8 border-t pt-6"
        style={{ borderColor: "var(--border)" }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24, ease: EASE_OUT }}
      >
        <p className="text-sm text-[var(--text-muted)]">{honestNote}</p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-4 inline-flex items-center gap-2 border px-4 py-2.5 font-display text-sm font-semibold
                     transition-[background-color,transform] duration-200
                     [transition-timing-function:var(--ease-out-strong)]
                     hover:bg-[var(--surface-muted)] active:scale-[0.97]"
          style={{ borderColor: "var(--field-border)", borderRadius: "var(--radius-control)" }}
        >
          {restartLabel}
        </button>
      </motion.div>
    </div>
  );
}
