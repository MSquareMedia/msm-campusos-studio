import "server-only";
import { sql, isConfigured } from "@/lib/db";

/**
 * Editable case-study / portfolio storage.
 *
 * One row per slug, holding a merged record that carries both the
 * portfolio-card fields (title, image, summary) and, when the piece is a
 * full case study, the narrative fields (challenge, idea, execution,
 * results). This is the single admin-editable source; `case-studies-content.ts`
 * derives the `PortfolioPiece[]` and `IndustryCaseStudy[]` shapes every page
 * and component already expects, so nothing downstream of that layer needs
 * to know the CMS exists.
 *
 * Falls back to the static content files when no database is attached (see
 * isConfigured in lib/db.ts), the site must keep working with zero setup.
 */

export type CaseStudyIndustry =
  | "automotive"
  | "healthcare"
  | "real-estate"
  | "education"
  | "portfolio";

export type CaseStudyRecord = {
  slug: string;
  industry: CaseStudyIndustry;
  status: "draft" | "published";
  title: string;
  category: string;
  image: string;
  summary: string;
  approvedClientLabel?: string;
  clientType?: string;
  geography?: string;
  challenge?: string;
  insight?: string;
  idea?: string;
  scope?: string[];
  execution?: string[];
  results?: Array<{ value: string; label: string; sourceNote: string }>;
  testimonial?: { quote: string; name: string; role: string; approvalConfirmed: boolean };
  heroAsset?: { src: string; alt: string; type: "image" | "video" };
  gallery?: Array<{ src: string; alt: string }>;
  services?: string[];
  disclosure?: string;
  body?: string[];
  resultsSimple?: string[];
  videoUrl?: string;
};

export { isConfigured };

async function ensureTable() {
  const q = sql();
  await q`
    CREATE TABLE IF NOT EXISTS case_studies (
      slug         TEXT PRIMARY KEY,
      data         JSONB NOT NULL,
      order_index  INTEGER NOT NULL DEFAULT 0,
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function listRecords(): Promise<CaseStudyRecord[]> {
  if (!isConfigured()) return [];
  await ensureTable();
  const q = sql();
  const rows = await q`
    SELECT data FROM case_studies ORDER BY order_index ASC, updated_at ASC
  `;
  return rows.map((r) => r.data as CaseStudyRecord);
}

export async function getRecord(slug: string): Promise<CaseStudyRecord | undefined> {
  if (!isConfigured()) return undefined;
  await ensureTable();
  const q = sql();
  const rows = await q`SELECT data FROM case_studies WHERE slug = ${slug} LIMIT 1`;
  return (rows[0]?.data as CaseStudyRecord | undefined) ?? undefined;
}

export async function upsertRecord(
  record: CaseStudyRecord,
  orderIndex?: number
): Promise<void> {
  await ensureTable();
  const q = sql();
  if (orderIndex === undefined) {
    // Preserve existing position on edit; only assign a fresh position
    // (end of the list) the first time a slug is created.
    const [{ next }] = await q`
      SELECT COALESCE(MAX(order_index), -1) + 1 AS next FROM case_studies
    `;
    await q`
      INSERT INTO case_studies (slug, data, order_index, updated_at)
      VALUES (${record.slug}, ${JSON.stringify(record)}, ${next}, NOW())
      ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
    `;
  } else {
    await q`
      INSERT INTO case_studies (slug, data, order_index, updated_at)
      VALUES (${record.slug}, ${JSON.stringify(record)}, ${orderIndex}, NOW())
      ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, order_index = EXCLUDED.order_index, updated_at = NOW()
    `;
  }
}

export async function deleteRecord(slug: string): Promise<void> {
  await ensureTable();
  const q = sql();
  await q`DELETE FROM case_studies WHERE slug = ${slug}`;
}

/** Seeds the table from the static content files, once, only when the table
 *  is empty, never overwrites rows an admin has already edited. */
export async function seedIfEmpty(seed: CaseStudyRecord[]): Promise<void> {
  if (!isConfigured()) return;
  await ensureTable();
  const q = sql();
  const [{ count }] = await q`SELECT COUNT(*)::int AS count FROM case_studies`;
  if (Number(count) > 0) return;
  for (let i = 0; i < seed.length; i += 1) {
    const record = seed[i];
    await q`
      INSERT INTO case_studies (slug, data, order_index)
      VALUES (${record.slug}, ${JSON.stringify(record)}, ${i})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
}
