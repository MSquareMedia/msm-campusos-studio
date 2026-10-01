"use client";

import { useState, type FormEvent } from "react";
import { industryNav } from "@/lib/site-config";
import { getClientUtmParams } from "@/lib/utm";

type FormState = "idle" | "submitting" | "success" | "error";

type Errors = Partial<Record<"name" | "email" | "company" | "phone" | "message", string>>;

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name) next.name = "Enter your full name.";
    if (!email) {
      next.email = "Enter your work email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }
    if (!company) next.company = "Enter your company name.";
    if (!phone) next.phone = "Enter a phone number so we can contact you.";
    if (!message) next.message = "Tell us briefly what you need.";

    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const validation = validate(data);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      setState("error");
      return;
    }

    setState("submitting");
    setSubmitError(null);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "contact",
          payload: {
            ...getClientUtmParams(),
            name: String(data.get("name") ?? "").trim(),
            email: String(data.get("email") ?? "").trim(),
            company: String(data.get("company") ?? "").trim(),
            phone: String(data.get("phone") ?? "").trim(),
            industry: String(data.get("industry") ?? "").trim(),
            message: String(data.get("message") ?? "").trim(),
            page_url: `${window.location.origin}${window.location.pathname}`,
          },
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setSubmitError(
          result?.code === "not_configured"
            ? "This form is not connected to our inbox yet. Please email us instead."
            : "Something went wrong sending your message. Please try again.",
        );
        setState("error");
        return;
      }
      setState("success");
    } catch {
      setSubmitError("We could not reach the server. Check your connection and try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className="border p-8"
        style={{ borderColor: "var(--border)" }}
      >
        <h3 className="font-display text-xl font-bold">Message received.</h3>
        <p className="mt-2 text-[var(--text-muted)]">
          A member of the SOTAPO team will follow up shortly.
        </p>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0 && state === "error";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {hasErrors && (
        <div role="alert" className="border p-4 text-sm" style={{ borderColor: "var(--brand-accent)" }}>
          Please fix the highlighted fields before sending.
        </div>
      )}
      {submitError && (
        <div role="alert" className="border p-4 text-sm" style={{ borderColor: "var(--brand-accent)" }}>
          {submitError}
        </div>
      )}

      <Field label="Full name" name="name" error={errors.name} autoComplete="name" />
      <Field
        label="Work email"
        name="email"
        type="email"
        error={errors.email}
        autoComplete="email"
      />
      <Field label="Company" name="company" error={errors.company} autoComplete="organization" />
      <Field label="Phone" name="phone" type="tel" error={errors.phone} autoComplete="tel" />

      <div className="flex flex-col gap-2">
        <label htmlFor="industry" className="font-display text-sm font-semibold">
          Industry
        </label>
        <select
          id="industry"
          name="industry"
          className="border bg-transparent px-4 py-3"
          style={{ borderColor: "var(--border)", borderRadius: "var(--radius-control)" }}
        >
          {industryNav.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="font-display text-sm font-semibold">
          What do you need help with?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="border bg-transparent px-4 py-3"
          style={{
            borderColor: errors.message ? "var(--brand-accent)" : "var(--border)",
            borderRadius: "var(--radius-control)",
          }}
        />
        {errors.message && (
          <p id="message-error" className="text-sm" style={{ color: "var(--brand-accent)" }}>
            {errors.message}
          </p>
        )}
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        Please do not include health, medical, or other sensitive personal details in this form.
      </p>

      <button type="submit" className="btn btn-primary self-start" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending..." : "Start a conversation"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-display text-sm font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="border bg-transparent px-4 py-3"
        style={{
          borderColor: error ? "var(--brand-accent)" : "var(--border)",
          borderRadius: "var(--radius-control)",
        }}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm" style={{ color: "var(--brand-accent)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
