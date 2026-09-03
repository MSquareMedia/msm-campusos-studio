/**
 * Shared schema for the multi-step conversational flows (audit, contact,
 * careers). Every flow is declared as data so the engine, animation, focus
 * management, keyboard handling, validation, review step, is written once
 * and behaves identically on all three surfaces.
 */

export type FlowValues = Record<string, string>;

/** Returns an error message, or null when the value is acceptable. */
export type Validator = (value: string, values: FlowValues) => string | null;

export type ChoiceOption = {
  value: string;
  label: string;
  /** One short clarifying line under the option label. */
  hint?: string;
};

type FieldBase = {
  name: string;
  /** Always rendered as a real <label> above the control. Never a placeholder. */
  label: string;
  /** Optional guidance rendered between the label and the control. */
  help?: string;
  validate?: Validator;
  /** Shown on the review step when the field was left blank. */
  emptyLabel?: string;
};

export type FieldDef =
  | (FieldBase & {
      kind: "text";
      type?: "text" | "email" | "url" | "tel";
      autoComplete?: string;
      /** Example format, shown as a hint, not as placeholder-as-label. */
      example?: string;
    })
  | (FieldBase & {
      kind: "textarea";
      rows?: number;
      maxLength?: number;
    })
  | (FieldBase & {
      kind: "choice";
      options: ChoiceOption[];
    })
  | (FieldBase & {
      /**
       * Many-of-many. Real checkboxes, never auto-advancing: the person is not
       * finished until they say so, which is exactly why this kind is excluded
       * from `isAutoAdvanceStep` below.
       *
       * `FlowValues` is a flat string map, so the selection is stored as a
       * comma-separated list of option values in source order. That keeps the
       * stored shape identical to every other field for the API, the admin
       * table and the review step, with no special-casing downstream.
       */
      kind: "multichoice";
      options: ChoiceOption[];
      /**
       * Optional visual grouping. Each group names the option values it holds;
       * any option not named by a group renders after the groups, so a
       * mismatch loses nothing.
       */
      groups?: Array<{ label: string; values: string[] }>;
    });

/** Splits the stored comma-separated value into option values. */
export function parseMulti(value: string): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

/** Joins option values back into the stored form, preserving source order. */
export function serializeMulti(values: string[], options: ChoiceOption[]): string {
  const chosen = new Set(values);
  return options
    .filter((option) => chosen.has(option.value))
    .map((option) => option.value)
    .join(",");
}

export type StepDef = {
  id: string;
  /** Small uppercase category above the question. */
  eyebrow: string;
  /** The question itself, set large. One question per screen. */
  question: string;
  /** Optional supporting sentence under the question. */
  help?: string;
  fields: FieldDef[];
};

/** A step auto-advances only when it is a single choice field and nothing else. */
export function isAutoAdvanceStep(step: StepDef): boolean {
  return step.fields.length === 1 && step.fields[0].kind === "choice";
}
