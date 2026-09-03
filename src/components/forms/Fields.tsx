"use client";

import { useRef } from "react";
import { Check, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { parseMulti, serializeMulti, type ChoiceOption, type FieldDef } from "./types";

/**
 * Field primitives shared by every flow.
 *
 * Layout contract, applied without exception:
 *   label (above)  →  help (optional)  →  control  →  error (below)
 * Placeholders are never used to carry the label. The error sits below the
 * control so it never pushes the label away from the thing it names.
 */

const controlBase =
  "w-full bg-transparent px-4 py-3.5 text-base text-[var(--text)] " +
  "border transition-[border-color,background-color] duration-200 " +
  "[transition-timing-function:var(--ease-out-strong)] " +
  "placeholder:text-[var(--text-muted)]/70 " +
  "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[var(--brand-accent)]";

function controlStyle(hasError: boolean): React.CSSProperties {
  return {
    borderColor: hasError ? "var(--danger)" : "var(--field-border)",
    borderRadius: "var(--radius-control)",
    background: hasError ? "var(--danger-soft)" : "transparent",
  };
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="flex items-start gap-1.5 text-sm font-medium"
      style={{ color: "var(--danger)" }}
    >
      <WarningCircle size={16} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

export function FieldShell({
  field,
  error,
  children,
}: {
  field: FieldDef;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={field.name} className="font-display text-sm font-semibold">
        {field.label}
      </label>
      {field.help && (
        <p id={`${field.name}-help`} className="-mt-0.5 text-sm text-[var(--text-muted)]">
          {field.help}
        </p>
      )}
      {children}
      <FieldError id={`${field.name}-error`} message={error} />
    </div>
  );
}

function describedBy(field: FieldDef, error?: string) {
  const ids = [field.help ? `${field.name}-help` : null, error ? `${field.name}-error` : null].filter(
    Boolean,
  );
  return ids.length ? ids.join(" ") : undefined;
}

export function TextField({
  field,
  value,
  error,
  autoFocus,
  onChange,
}: {
  field: Extract<FieldDef, { kind: "text" }>;
  value: string;
  error?: string;
  autoFocus?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <FieldShell field={field} error={error}>
      <input
        id={field.name}
        name={field.name}
        type={field.type ?? "text"}
        value={value}
        autoComplete={field.autoComplete}
        placeholder={field.example}
        data-autofocus={autoFocus ? "true" : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(field, error)}
        onChange={(e) => onChange(e.target.value)}
        className={controlBase}
        style={controlStyle(Boolean(error))}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  field,
  value,
  error,
  autoFocus,
  onChange,
}: {
  field: Extract<FieldDef, { kind: "textarea" }>;
  value: string;
  error?: string;
  autoFocus?: boolean;
  onChange: (v: string) => void;
}) {
  const remaining = field.maxLength ? field.maxLength - value.length : null;
  return (
    <FieldShell field={field} error={error}>
      <textarea
        id={field.name}
        name={field.name}
        rows={field.rows ?? 4}
        value={value}
        maxLength={field.maxLength}
        data-autofocus={autoFocus ? "true" : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(field, error)}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlBase} resize-y`}
        style={controlStyle(Boolean(error))}
      />
      {remaining !== null && (
        <p className="text-right text-xs tabular-nums text-[var(--text-muted)]">
          {remaining} characters left
        </p>
      )}
    </FieldShell>
  );
}

/**
 * Single-choice group built on real radio inputs, so arrow-key navigation,
 * grouping and screen-reader semantics come from the platform rather than
 * from re-implemented ARIA.
 *
 * The visible option row is the label; the input itself is visually hidden
 * and the focus ring is drawn on the row via peer-focus-visible so keyboard
 * focus stays obvious.
 */
export function ChoiceField({
  field,
  value,
  error,
  autoFocus,
  onSelect,
}: {
  field: Extract<FieldDef, { kind: "choice" }>;
  value: string;
  error?: string;
  autoFocus?: boolean;
  /** `viaArrow` is true when the change came from arrow-key roving, which
      must not trigger auto-advance, the person is still browsing. */
  onSelect: (v: string, viaArrow: boolean) => void;
}) {
  const arrowRef = useRef(false);

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-display text-sm font-semibold">{field.label}</legend>
      {field.help && (
        <p id={`${field.name}-help`} className="text-sm text-[var(--text-muted)]">
          {field.help}
        </p>
      )}

      <div
        className="mt-1 flex flex-col gap-2"
        onKeyDown={(e) => {
          arrowRef.current = e.key.startsWith("Arrow");
        }}
      >
        {field.options.map((option, i) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className="group relative flex cursor-pointer items-center gap-4 border px-4 py-3.5
                         transition-[border-color,background-color,transform] duration-200
                         [transition-timing-function:var(--ease-out-strong)]
                         active:scale-[0.99]
                         has-[:focus-visible]:outline has-[:focus-visible]:outline-2
                         has-[:focus-visible]:outline-offset-2
                         has-[:focus-visible]:outline-[var(--brand-accent)]"
              style={{
                borderColor: checked ? "var(--brand-accent)" : "var(--field-border)",
                background: checked ? "var(--danger-soft)" : "transparent",
                borderRadius: "var(--radius-control)",
              }}
            >
              <input
                type="radio"
                name={field.name}
                value={option.value}
                checked={checked}
                data-autofocus={autoFocus && (checked || (!value && i === 0)) ? "true" : undefined}
                aria-describedby={describedBy(field, error)}
                onChange={() => {
                  const viaArrow = arrowRef.current;
                  arrowRef.current = false;
                  onSelect(option.value, viaArrow);
                }}
                className="sr-only"
              />

              {/* Keyboard shortcut affordance: the row's ordinal doubles as a
                  hotkey (1–9) on single-choice steps. */}
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center border font-display text-xs font-semibold tabular-nums
                           transition-colors duration-200 [transition-timing-function:var(--ease-out-strong)]"
                style={{
                  borderColor: checked ? "var(--brand-accent)" : "var(--field-border)",
                  background: checked ? "var(--brand-accent)" : "transparent",
                  color: checked ? "#ffffff" : "var(--text-muted)",
                  borderRadius: "var(--radius-control)",
                }}
              >
                {i + 1}
              </span>

              <span className="min-w-0">
                <span className="block font-display text-[0.95rem] font-semibold leading-snug">
                  {option.label}
                </span>
                {option.hint && (
                  <span className="mt-0.5 block text-sm text-[var(--text-muted)]">{option.hint}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      <FieldError id={`${field.name}-error`} message={error} />
    </fieldset>
  );
}

/**
 * Many-of-many, built on real checkboxes inside a real fieldset, so grouping,
 * Space to toggle and screen-reader semantics come from the platform rather
 * than from re-implemented ARIA.
 *
 * Deliberately unlike ChoiceField in two ways. There is no number hotkey,
 * because a hotkey that toggles is a hotkey that silently untoggles. And there
 * is no auto-advance: the person decides when they are done choosing, so the
 * step waits for Continue.
 *
 * Groups render as nested fieldsets. A visible running count sits under the
 * legend and is announced politely, because on a long list the only thing the
 * person actually wants to know is how many they have picked so far.
 */
export function MultiChoiceField({
  field,
  value,
  error,
  autoFocus,
  onChange,
}: {
  field: Extract<FieldDef, { kind: "multichoice" }>;
  value: string;
  error?: string;
  autoFocus?: boolean;
  onChange: (v: string) => void;
}) {
  const selected = parseMulti(value);
  const chosen = new Set(selected);

  const toggle = (optionValue: string) => {
    const next = new Set(chosen);
    if (next.has(optionValue)) next.delete(optionValue);
    else next.add(optionValue);
    onChange(serializeMulti([...next], field.options));
  };

  const grouped = field.groups ?? [];
  const claimed = new Set(grouped.flatMap((group) => group.values));
  const ungrouped = field.options.filter((option) => !claimed.has(option.value));

  // Which checkbox the step engine should focus on arrival: the first one in
  // *render* order, which is not `field.options[0]` once groups reorder things.
  const firstRendered =
    grouped.flatMap((group) => group.values).find((v) => field.options.some((o) => o.value === v)) ??
    ungrouped[0]?.value;

  const renderOption = (option: ChoiceOption) => {
    const checked = chosen.has(option.value);
    return (
      <label
        key={option.value}
        className="group relative flex cursor-pointer items-center gap-3.5 border px-4 py-3
                   transition-[border-color,background-color,transform] duration-200
                   [transition-timing-function:var(--ease-out-strong)]
                   active:scale-[0.99]
                   has-[:focus-visible]:outline has-[:focus-visible]:outline-2
                   has-[:focus-visible]:outline-offset-2
                   has-[:focus-visible]:outline-[var(--brand-accent)]"
        style={{
          borderColor: checked ? "var(--brand-accent)" : "var(--field-border)",
          background: checked ? "var(--danger-soft)" : "transparent",
          borderRadius: "var(--radius-control)",
        }}
      >
        <input
          type="checkbox"
          name={field.name}
          value={option.value}
          checked={checked}
          data-autofocus={autoFocus && option.value === firstRendered ? "true" : undefined}
          aria-describedby={describedBy(field, error)}
          onChange={() => toggle(option.value)}
          className="sr-only"
        />

        <span
          aria-hidden="true"
          className="flex h-5 w-5 shrink-0 items-center justify-center border
                     transition-colors duration-200 [transition-timing-function:var(--ease-out-strong)]"
          style={{
            borderColor: checked ? "var(--brand-accent)" : "var(--field-border)",
            background: checked ? "var(--brand-accent)" : "transparent",
            borderRadius: "var(--radius-control)",
          }}
        >
          {checked && <Check size={13} weight="bold" color="#ffffff" />}
        </span>

        <span className="min-w-0">
          <span className="block font-display text-[0.95rem] font-semibold leading-snug">
            {option.label}
          </span>
          {option.hint && (
            <span className="mt-0.5 block text-sm text-[var(--text-muted)]">{option.hint}</span>
          )}
        </span>
      </label>
    );
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-display text-sm font-semibold">{field.label}</legend>
      {field.help && (
        <p id={`${field.name}-help`} className="text-sm text-[var(--text-muted)]">
          {field.help}
        </p>
      )}

      <p aria-live="polite" className="text-sm tabular-nums text-[var(--text-muted)]">
        {selected.length === 0
          ? "Nothing selected yet"
          : `${selected.length} selected of ${field.options.length}`}
      </p>

      <div className="mt-2 flex flex-col gap-6">
        {grouped.map((group) => {
          const options = group.values
            .map((v) => field.options.find((option) => option.value === v))
            .filter((option): option is ChoiceOption => Boolean(option));
          if (options.length === 0) return null;
          return (
            <fieldset key={group.label} className="flex flex-col gap-2">
              <legend className="eyebrow pb-2 text-[var(--text-muted)]">{group.label}</legend>
              {/* Two columns from `sm` up: fourteen full-width rows is a
                  scroll, and this step is meant to be surveyable in one look. */}
              <div className="grid gap-2 sm:grid-cols-2">{options.map(renderOption)}</div>
            </fieldset>
          );
        })}

        {ungrouped.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">{ungrouped.map(renderOption)}</div>
        )}
      </div>

      <FieldError id={`${field.name}-error`} message={error} />
    </fieldset>
  );
}
