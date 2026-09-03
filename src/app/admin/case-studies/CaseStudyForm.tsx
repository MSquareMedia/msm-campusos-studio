"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { CaseStudyRecord, CaseStudyIndustry } from "@/lib/case-studies-db";

/**
 * One form, two modes (create / edit), for the merged card+narrative record.
 *
 * Array fields (scope, execution, services, body, resultsSimple) are edited
 * as newline-separated textareas rather than a repeatable-row UI, this is
 * an internal admin tool for a handful of editors, and a textarea is far
 * less code than a drag-reorderable list for the same result. `results`
 * (the structured stat rows with a source note) get one line each in the
 * form `value | label | sourceNote`, parsed back into objects on submit.
 */

const INDUSTRIES: { value: CaseStudyIndustry; label: string }[] = [
  { value: "education", label: "Education" },
  { value: "automotive", label: "Automotive" },
  { value: "healthcare", label: "Healthcare" },
  { value: "real-estate", label: "Real estate" },
  { value: "portfolio", label: "Portfolio (no case study narrative)" },
];

function joinLines(v?: string[]): string {
  return (v ?? []).join("\n");
}
function splitLines(v: string): string[] {
  return v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
function joinResults(v?: CaseStudyRecord["results"]): string {
  return (v ?? []).map((r) => `${r.value} | ${r.label} | ${r.sourceNote}`).join("\n");
}
function splitResults(v: string): CaseStudyRecord["results"] {
  return splitLines(v).map((line) => {
    const [value = "", label = "", sourceNote = ""] = line.split("|").map((s) => s.trim());
    return { value, label, sourceNote };
  });
}
function joinGallery(v?: CaseStudyRecord["gallery"]): string {
  return (v ?? []).map((g) => `${g.src} | ${g.alt}`).join("\n");
}
function splitGallery(v: string): CaseStudyRecord["gallery"] {
  const rows = splitLines(v).map((line) => {
    const [src = "", alt = ""] = line.split("|").map((s) => s.trim());
    return { src, alt };
  });
  return rows.length > 0 ? rows : undefined;
}

type FieldState = {
  slug: string;
  industry: CaseStudyIndustry;
  status: "draft" | "published";
  title: string;
  category: string;
  image: string;
  summary: string;
  approvedClientLabel: string;
  clientType: string;
  geography: string;
  challenge: string;
  insight: string;
  idea: string;
  scope: string;
  execution: string;
  results: string;
  services: string;
  disclosure: string;
  body: string;
  resultsSimple: string;
  videoUrl: string;
  gallery: string;
  heroSrc: string;
  heroAlt: string;
  heroType: "image" | "video";
  testimonialQuote: string;
  testimonialName: string;
  testimonialRole: string;
  testimonialApproved: boolean;
};

function recordToFields(r?: CaseStudyRecord): FieldState {
  return {
    slug: r?.slug ?? "",
    industry: r?.industry ?? "education",
    status: r?.status ?? "draft",
    title: r?.title ?? "",
    category: r?.category ?? "",
    image: r?.image ?? "",
    summary: r?.summary ?? "",
    approvedClientLabel: r?.approvedClientLabel ?? "",
    clientType: r?.clientType ?? "",
    geography: r?.geography ?? "",
    challenge: r?.challenge ?? "",
    insight: r?.insight ?? "",
    idea: r?.idea ?? "",
    scope: joinLines(r?.scope),
    execution: joinLines(r?.execution),
    results: joinResults(r?.results),
    services: joinLines(r?.services),
    disclosure: r?.disclosure ?? "",
    body: joinLines(r?.body),
    resultsSimple: joinLines(r?.resultsSimple),
    videoUrl: r?.videoUrl ?? "",
    gallery: joinGallery(r?.gallery),
    heroSrc: r?.heroAsset?.src ?? "",
    heroAlt: r?.heroAsset?.alt ?? "",
    heroType: r?.heroAsset?.type ?? "image",
    testimonialQuote: r?.testimonial?.quote ?? "",
    testimonialName: r?.testimonial?.name ?? "",
    testimonialRole: r?.testimonial?.role ?? "",
    testimonialApproved: r?.testimonial?.approvalConfirmed ?? false,
  };
}

function fieldsToRecord(f: FieldState): CaseStudyRecord {
  return {
    slug: f.slug.trim(),
    industry: f.industry,
    status: f.status,
    title: f.title.trim(),
    category: f.category.trim(),
    image: f.image.trim(),
    summary: f.summary.trim(),
    approvedClientLabel: f.approvedClientLabel.trim() || undefined,
    clientType: f.clientType.trim() || undefined,
    geography: f.geography.trim() || undefined,
    challenge: f.challenge.trim() || undefined,
    insight: f.insight.trim() || undefined,
    idea: f.idea.trim() || undefined,
    scope: splitLines(f.scope),
    execution: splitLines(f.execution),
    results: splitResults(f.results),
    services: splitLines(f.services),
    disclosure: f.disclosure.trim() || undefined,
    body: splitLines(f.body),
    resultsSimple: splitLines(f.resultsSimple),
    videoUrl: f.videoUrl.trim() || undefined,
    gallery: splitGallery(f.gallery),
    heroAsset: f.heroSrc.trim()
      ? { src: f.heroSrc.trim(), alt: f.heroAlt.trim(), type: f.heroType }
      : undefined,
    testimonial: f.testimonialQuote.trim()
      ? {
          quote: f.testimonialQuote.trim(),
          name: f.testimonialName.trim(),
          role: f.testimonialRole.trim(),
          approvalConfirmed: f.testimonialApproved,
        }
      : undefined,
  };
}

const inputClass =
  "w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--brand-accent)]";
const inputStyle = { borderColor: "var(--border)" };

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </span>
      {children}
      {hint && <span className="text-xs text-[var(--text-muted)]">{hint}</span>}
    </label>
  );
}

export function CaseStudyForm({ record }: { record?: CaseStudyRecord }) {
  const router = useRouter();
  const isEdit = Boolean(record);
  const [f, setF] = useState<FieldState>(() => recordToFields(record));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FieldState>(key: K, value: FieldState[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const payload = fieldsToRecord(f);
    const url = isEdit ? `/api/admin/case-studies/${record!.slug}` : "/api/admin/case-studies";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setBusy(false);
    if (res.ok) {
      router.push("/admin/case-studies");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-8 py-10">
      {error && (
        <p
          role="alert"
          className="rounded-md px-4 py-3 text-sm"
          style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
        >
          {error}
        </p>
      )}

      <section className="grid grid-cols-2 gap-5">
        <Field label="Slug" hint="Lowercase, hyphens only. Used in the URL and can't change after creation.">
          <input
            className={inputClass}
            style={inputStyle}
            value={f.slug}
            onChange={(e) => set("slug", e.target.value)}
            disabled={isEdit}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
          />
        </Field>
        <Field label="Status">
          <select
            className={inputClass}
            style={inputStyle}
            value={f.status}
            onChange={(e) => set("status", e.target.value as FieldState["status"])}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field label="Industry">
          <select
            className={inputClass}
            style={inputStyle}
            value={f.industry}
            onChange={(e) => set("industry", e.target.value as CaseStudyIndustry)}
          >
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category" hint="Shown as the small label above the title, e.g. &quot;Education, Performance Media&quot;.">
          <input className={inputClass} style={inputStyle} value={f.category} onChange={(e) => set("category", e.target.value)} required />
        </Field>
      </section>

      <section className="grid gap-5">
        <Field label="Title">
          <input className={inputClass} style={inputStyle} value={f.title} onChange={(e) => set("title", e.target.value)} required />
        </Field>
        <Field label="Card / hero image path" hint="e.g. /images/education/case-studies/example-hero.jpg, upload the file to public/ first.">
          <input className={inputClass} style={inputStyle} value={f.image} onChange={(e) => set("image", e.target.value)} required />
        </Field>
        <Field label="Summary" hint="Short card description. Used everywhere the challenge/idea narrative below isn't shown.">
          <textarea className={inputClass} style={inputStyle} rows={2} value={f.summary} onChange={(e) => set("summary", e.target.value)} required />
        </Field>
      </section>

      <section className="grid grid-cols-2 gap-5">
        <Field label="Approved client label" hint="e.g. &quot;IDP&quot; or &quot;a leading institute&quot; if the name can't be published.">
          <input className={inputClass} style={inputStyle} value={f.approvedClientLabel} onChange={(e) => set("approvedClientLabel", e.target.value)} />
        </Field>
        <Field label="Client type">
          <input className={inputClass} style={inputStyle} value={f.clientType} onChange={(e) => set("clientType", e.target.value)} />
        </Field>
        <Field label="Geography">
          <input className={inputClass} style={inputStyle} value={f.geography} onChange={(e) => set("geography", e.target.value)} />
        </Field>
        <Field label="Video URL" hint="Only set if a real video reel exists.">
          <input className={inputClass} style={inputStyle} value={f.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} />
        </Field>
      </section>

      <section className="flex flex-col gap-5 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <p className="font-display text-sm font-bold">Case study narrative</p>
        <p className="-mt-3 text-xs text-[var(--text-muted)]">
          Leave challenge and idea blank to keep this as a portfolio-only card with no
          full case-study page.
        </p>
        <Field label="Challenge">
          <textarea className={inputClass} style={inputStyle} rows={2} value={f.challenge} onChange={(e) => set("challenge", e.target.value)} />
        </Field>
        <Field label="Insight (optional)">
          <textarea className={inputClass} style={inputStyle} rows={2} value={f.insight} onChange={(e) => set("insight", e.target.value)} />
        </Field>
        <Field label="Idea">
          <textarea className={inputClass} style={inputStyle} rows={2} value={f.idea} onChange={(e) => set("idea", e.target.value)} />
        </Field>
        <Field label="Scope" hint="One item per line.">
          <textarea className={inputClass} style={inputStyle} rows={4} value={f.scope} onChange={(e) => set("scope", e.target.value)} />
        </Field>
        <Field label="Execution" hint="One step per line, shown as a numbered list.">
          <textarea className={inputClass} style={inputStyle} rows={4} value={f.execution} onChange={(e) => set("execution", e.target.value)} />
        </Field>
        <Field label="Results" hint="One per line: value | label | source note, e.g. 28% | Drop in cost per application | Figures as supplied by the client.">
          <textarea className={inputClass} style={inputStyle} rows={4} value={f.results} onChange={(e) => set("results", e.target.value)} />
        </Field>
        <Field label="Services" hint="One per line.">
          <textarea className={inputClass} style={inputStyle} rows={3} value={f.services} onChange={(e) => set("services", e.target.value)} />
        </Field>
        <Field label="Disclosure (optional)" hint="Legal/attribution footnote shown under the narrative.">
          <textarea className={inputClass} style={inputStyle} rows={2} value={f.disclosure} onChange={(e) => set("disclosure", e.target.value)} />
        </Field>
      </section>

      <section className="flex flex-col gap-5 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <p className="font-display text-sm font-bold">Testimonial (optional)</p>
        <Field label="Quote">
          <textarea className={inputClass} style={inputStyle} rows={2} value={f.testimonialQuote} onChange={(e) => set("testimonialQuote", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Name">
            <input className={inputClass} style={inputStyle} value={f.testimonialName} onChange={(e) => set("testimonialName", e.target.value)} />
          </Field>
          <Field label="Role">
            <input className={inputClass} style={inputStyle} value={f.testimonialRole} onChange={(e) => set("testimonialRole", e.target.value)} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={f.testimonialApproved}
            onChange={(e) => set("testimonialApproved", e.target.checked)}
          />
          Client has approved this quote for publication
        </label>
      </section>

      <section className="flex flex-col gap-5 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <p className="font-display text-sm font-bold">Hero asset (optional override)</p>
        <p className="-mt-3 text-xs text-[var(--text-muted)]">
          Defaults to the card image above when left blank. Only needed if the homepage
          case-study index should show a different image.
        </p>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Src">
            <input className={inputClass} style={inputStyle} value={f.heroSrc} onChange={(e) => set("heroSrc", e.target.value)} />
          </Field>
          <Field label="Alt text">
            <input className={inputClass} style={inputStyle} value={f.heroAlt} onChange={(e) => set("heroAlt", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-5 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <p className="font-display text-sm font-bold">Portfolio-only fields</p>
        <p className="-mt-3 text-xs text-[var(--text-muted)]">
          Used only when this card has no case-study narrative above, e.g. brand/design
          work with just a summary and a gallery.
        </p>
        <Field label="Body paragraphs" hint="One paragraph per line.">
          <textarea className={inputClass} style={inputStyle} rows={4} value={f.body} onChange={(e) => set("body", e.target.value)} />
        </Field>
        <Field label="Simple results" hint="One line per stat, shown as plain text (no source note), e.g. &quot;15 Million+ views&quot;.">
          <textarea className={inputClass} style={inputStyle} rows={3} value={f.resultsSimple} onChange={(e) => set("resultsSimple", e.target.value)} />
        </Field>
      </section>

      <section className="flex flex-col gap-5 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <p className="font-display text-sm font-bold">Gallery (optional)</p>
        <Field label="Images" hint="One per line: /path/to/image.jpg | alt text">
          <textarea className={inputClass} style={inputStyle} rows={4} value={f.gallery} onChange={(e) => set("gallery", e.target.value)} />
        </Field>
      </section>

      <div className="flex items-center gap-4 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <button type="submit" disabled={busy} className="btn btn-primary disabled:opacity-50">
          {busy ? "Saving…" : isEdit ? "Save changes" : "Create case study"}
        </button>
        <button type="button" onClick={() => router.push("/admin/case-studies")} className="text-sm text-[var(--text-muted)]">
          Cancel
        </button>
      </div>
    </form>
  );
}
