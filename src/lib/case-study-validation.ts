import type { CaseStudyRecord, CaseStudyIndustry } from "@/lib/case-studies-db";

/**
 * Hand-rolled validation for the admin case-study form, this project has no
 * schema-validation library, and one more table's worth of fields does not
 * earn adding one. Mirrors the shape checks in api/submissions/route.ts:
 * re-check everything server-side, because the client form is a courtesy,
 * not a control.
 */

const INDUSTRIES: CaseStudyIndustry[] = [
  "automotive",
  "healthcare",
  "real-estate",
  "education",
  "portfolio",
];

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function validateRecord(body: unknown): { record: CaseStudyRecord } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Malformed body." };
  const b = body as Record<string, unknown>;

  if (typeof b.slug !== "string" || !SLUG_RE.test(b.slug) || b.slug.length > 80) {
    return { error: "Slug must be lowercase letters, numbers, and hyphens only." };
  }
  if (typeof b.industry !== "string" || !INDUSTRIES.includes(b.industry as CaseStudyIndustry)) {
    return { error: "Unknown industry." };
  }
  if (b.status !== "draft" && b.status !== "published") {
    return { error: "Status must be draft or published." };
  }
  for (const field of ["title", "category", "image", "summary"] as const) {
    if (typeof b[field] !== "string" || (b[field] as string).trim().length === 0) {
      return { error: `${field} is required.` };
    }
  }

  const str = (v: unknown): string | undefined =>
    typeof v === "string" && v.trim().length > 0 ? v : undefined;
  const strArr = (v: unknown): string[] | undefined =>
    Array.isArray(v) && v.every((x) => typeof x === "string")
      ? (v as string[]).filter((x) => x.trim().length > 0)
      : undefined;

  let results: CaseStudyRecord["results"];
  if (Array.isArray(b.results)) {
    results = [];
    for (const r of b.results) {
      if (typeof r !== "object" || r === null) return { error: "Malformed result row." };
      const row = r as Record<string, unknown>;
      if (typeof row.value !== "string" || typeof row.label !== "string") {
        return { error: "Each result needs a value and a label." };
      }
      if (!row.value.trim() || !row.label.trim()) continue;
      results.push({
        value: row.value,
        label: row.label,
        sourceNote: typeof row.sourceNote === "string" ? row.sourceNote : "",
      });
    }
  }

  let gallery: CaseStudyRecord["gallery"];
  if (Array.isArray(b.gallery)) {
    gallery = (b.gallery as unknown[])
      .filter(
        (g): g is { src: string; alt: string } =>
          typeof g === "object" &&
          g !== null &&
          typeof (g as Record<string, unknown>).src === "string" &&
          typeof (g as Record<string, unknown>).alt === "string" &&
          ((g as Record<string, unknown>).src as string).trim().length > 0
      )
      .map((g) => ({ src: g.src, alt: g.alt }));
  }

  let testimonial: CaseStudyRecord["testimonial"];
  if (typeof b.testimonial === "object" && b.testimonial !== null) {
    const t = b.testimonial as Record<string, unknown>;
    if (typeof t.quote === "string" && t.quote.trim().length > 0) {
      testimonial = {
        quote: t.quote,
        name: typeof t.name === "string" ? t.name : "",
        role: typeof t.role === "string" ? t.role : "",
        approvalConfirmed: Boolean(t.approvalConfirmed),
      };
    }
  }

  let heroAsset: CaseStudyRecord["heroAsset"];
  if (typeof b.heroAsset === "object" && b.heroAsset !== null) {
    const h = b.heroAsset as Record<string, unknown>;
    if (typeof h.src === "string" && h.src.trim().length > 0) {
      heroAsset = {
        src: h.src,
        alt: typeof h.alt === "string" ? h.alt : "",
        type: h.type === "video" ? "video" : "image",
      };
    }
  }

  const record: CaseStudyRecord = {
    slug: b.slug,
    industry: b.industry as CaseStudyIndustry,
    status: b.status,
    title: b.title as string,
    category: b.category as string,
    image: b.image as string,
    summary: b.summary as string,
    approvedClientLabel: str(b.approvedClientLabel),
    clientType: str(b.clientType),
    geography: str(b.geography),
    challenge: str(b.challenge),
    insight: str(b.insight),
    idea: str(b.idea),
    scope: strArr(b.scope),
    execution: strArr(b.execution),
    results,
    testimonial,
    heroAsset,
    gallery,
    services: strArr(b.services),
    disclosure: str(b.disclosure),
    body: strArr(b.body),
    resultsSimple: strArr(b.resultsSimple),
    videoUrl: str(b.videoUrl),
  };

  return { record };
}
