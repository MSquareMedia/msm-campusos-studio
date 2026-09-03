import "server-only";
import { portfolio as staticPortfolio, type PortfolioPiece } from "@/content/portfolio";
import { caseStudies as staticCaseStudies } from "@/content/case-studies";
import type { IndustryCaseStudy } from "@/content/types";
import {
  listRecords,
  seedIfEmpty,
  isConfigured,
  type CaseStudyRecord,
} from "@/lib/case-studies-db";

/**
 * Read-side of the case-study CMS: turns the merged `CaseStudyRecord[]` (DB,
 * seeded from the static files below on first use) back into the exact
 * `PortfolioPiece[]` / `IndustryCaseStudy[]` shapes every page and component
 * already consumes, so nothing below this layer changed when the CMS was
 * added. Falls back to the static arrays untouched when no database is
 * attached, see ADMIN_SETUP.md.
 */

function buildSeed(): CaseStudyRecord[] {
  return staticPortfolio.map((piece): CaseStudyRecord => {
    const cs = piece.caseStudyId
      ? staticCaseStudies.find((c) => c.id === piece.caseStudyId)
      : undefined;
    return {
      slug: piece.slug,
      industry: cs?.industry ?? "portfolio",
      status: cs?.status ?? "published",
      title: cs?.title ?? piece.title,
      category: piece.category,
      image: piece.image,
      summary: piece.summary,
      approvedClientLabel: cs?.approvedClientLabel,
      clientType: cs?.clientType,
      geography: cs?.geography,
      challenge: cs?.challenge,
      insight: cs?.insight,
      idea: cs?.idea,
      scope: cs?.scope,
      execution: cs?.execution,
      results: cs?.results,
      testimonial: cs?.testimonial,
      heroAsset: cs?.heroAsset,
      gallery: cs?.gallery ?? piece.gallery,
      services: cs?.services ?? piece.services,
      disclosure: cs?.disclosure,
      body: piece.body,
      resultsSimple: piece.results,
      videoUrl: piece.videoUrl,
    };
  });
}

let seeded = false;
async function ensureSeeded() {
  if (seeded || !isConfigured()) return;
  await seedIfEmpty(buildSeed());
  seeded = true;
}

async function getRecords(): Promise<CaseStudyRecord[]> {
  if (!isConfigured()) return buildSeed();
  await ensureSeeded();
  const rows = await listRecords();
  return rows.length > 0 ? rows : buildSeed();
}

function hasNarrative(r: CaseStudyRecord): boolean {
  return Boolean(r.challenge && r.idea);
}

function toPortfolioPiece(r: CaseStudyRecord): PortfolioPiece {
  return {
    title: r.title,
    category: r.category,
    image: r.image,
    slug: r.slug,
    summary: r.summary,
    body: r.body,
    services: r.services,
    results: r.resultsSimple,
    videoUrl: r.videoUrl,
    caseStudyId: hasNarrative(r) ? r.slug : undefined,
    gallery: r.gallery,
  };
}

function toIndustryCaseStudy(r: CaseStudyRecord): IndustryCaseStudy {
  return {
    id: r.slug,
    industry: r.industry as IndustryCaseStudy["industry"],
    status: r.status,
    approvedClientLabel: r.approvedClientLabel ?? r.title,
    geography: r.geography,
    clientType: r.clientType,
    title: r.title,
    challenge: r.challenge ?? "",
    insight: r.insight,
    idea: r.idea ?? "",
    scope: r.scope ?? [],
    execution: r.execution ?? [],
    results: r.results ?? [],
    testimonial: r.testimonial,
    heroAsset: r.heroAsset ?? { src: r.image, alt: r.title, type: "image" },
    gallery: r.gallery,
    services: r.services ?? [],
    disclosure: r.disclosure,
  };
}

/** Every portfolio card, in stored order, includes brand work with no
 *  case-study narrative attached. */
export async function getAllPortfolio(): Promise<PortfolioPiece[]> {
  const records = await getRecords();
  return records.map(toPortfolioPiece);
}

/** Every case study with a narrative, published or draft, for admin use
 *  and for the homepage's "all published work" index (which filters itself). */
export async function getAllCaseStudies(): Promise<IndustryCaseStudy[]> {
  const records = await getRecords();
  return records.filter(hasNarrative).map(toIndustryCaseStudy);
}

/** Published case studies for one industry, in stored order, the direct
 *  replacement for the old static `getPublishedCaseStudies`. */
export async function getPublishedCaseStudies(
  industry: IndustryCaseStudy["industry"]
): Promise<IndustryCaseStudy[]> {
  const all = await getAllCaseStudies();
  return all.filter((cs) => cs.industry === industry && cs.status === "published");
}

/** Raw merged records, used only by the admin UI, which needs to edit
 *  fields (like `resultsSimple`) that the public shapes above don't expose. */
export async function getAllRecords(): Promise<CaseStudyRecord[]> {
  return getRecords();
}

export async function getRecordBySlug(slug: string): Promise<CaseStudyRecord | undefined> {
  const records = await getRecords();
  return records.find((r) => r.slug === slug);
}
