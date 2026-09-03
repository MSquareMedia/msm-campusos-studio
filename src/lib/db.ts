import "server-only";
import { neon } from "@neondatabase/serverless";

/**
 * Submission storage, backed by the Vercel Postgres (Neon) integration.
 *
 * The connection string is read at call time rather than module scope so the
 * site still builds and renders with no database attached: every page here is
 * static marketing content, and a missing env var must not take the whole
 * build down. `isConfigured()` is the switch every caller checks first.
 */

export type SubmissionKind = "audit" | "contact" | "careers" | "osiq";

export type Submission = {
  id: number;
  kind: SubmissionKind;
  payload: Record<string, string>;
  created_at: string;
};

function connectionString(): string | undefined {
  // Vercel's Postgres/Neon integration injects several aliases depending on
  // how the store was attached; accept whichever is present.
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.DATABASE_URL_UNPOOLED
  );
}

export function isConfigured(): boolean {
  return Boolean(connectionString());
}

/** Shared Neon client accessor, other tables (see case-studies-db.ts) reuse
 *  this instead of re-reading the connection string themselves. */
export function sql() {
  const url = connectionString();
  if (!url) throw new Error("No database connection string configured.");
  return neon(url);
}

/**
 * Creates the table if it does not exist. Called before each write rather
 * than in a migration step: there is exactly one table, it is additive, and
 * this keeps provisioning to "paste the env var and deploy" with no separate
 * migration run for whoever sets this up.
 */
async function ensureTable() {
  const q = sql();
  await q`
    CREATE TABLE IF NOT EXISTS submissions (
      id          SERIAL PRIMARY KEY,
      kind        TEXT NOT NULL,
      payload     JSONB NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function insertSubmission(
  kind: SubmissionKind,
  payload: Record<string, string>
): Promise<void> {
  await ensureTable();
  const q = sql();
  // Parameterised by the driver's tagged template, so the payload is never
  // interpolated into SQL text.
  await q`INSERT INTO submissions (kind, payload) VALUES (${kind}, ${JSON.stringify(payload)})`;
}

export async function listSubmissions(limit = 200): Promise<Submission[]> {
  await ensureTable();
  const q = sql();
  const rows = await q`
    SELECT id, kind, payload, created_at
    FROM submissions
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows as Submission[];
}
