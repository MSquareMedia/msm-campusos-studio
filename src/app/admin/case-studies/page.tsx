import Link from "next/link";
import type { Metadata } from "next";
import { getAllRecords } from "@/lib/case-studies-content";
import { isConfigured } from "@/lib/case-studies-db";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case studies, admin",
  robots: { index: false, follow: false },
};

const INDUSTRY_LABEL: Record<string, string> = {
  education: "Education",
  automotive: "Automotive",
  healthcare: "Healthcare",
  "real-estate": "Real estate",
  portfolio: "Portfolio (no case study)",
};

export default async function AdminCaseStudiesPage() {
  const configured = isConfigured();
  const records = await getAllRecords();

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Case studies</h1>
        <Link href="/admin/case-studies/new" className="btn btn-primary">
          New case study
        </Link>
      </div>

      {!configured && (
        <p className="mt-4 max-w-lg text-sm" style={{ color: "var(--danger)" }}>
          No database is attached. Edits here won&apos;t persist until a Postgres
          store is connected, see ADMIN_SETUP.md. The list below is the static
          content the site currently ships with.
        </p>
      )}

      <div className="mt-8 border-t" style={{ borderColor: "var(--border)" }}>
        {records.map((r) => (
          <div
            key={r.slug}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b py-4"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="font-display text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--brand-accent)" }}
            >
              {INDUSTRY_LABEL[r.industry] ?? r.industry}
            </span>
            <span className="font-display text-sm font-semibold">{r.title}</span>
            <span className="text-xs text-[var(--text-muted)]">/{r.slug}</span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{
                background: r.status === "published" ? "var(--surface-muted)" : "transparent",
                border: r.status === "published" ? "none" : "1px solid var(--border)",
                color: r.status === "published" ? "var(--text)" : "var(--text-muted)",
              }}
            >
              {r.status}
            </span>
            <div className="ml-auto flex items-center gap-4">
              <Link
                href={`/admin/case-studies/${r.slug}`}
                className="text-sm font-semibold"
                style={{ color: "var(--brand-accent)" }}
              >
                Edit
              </Link>
              <DeleteButton slug={r.slug} title={r.title} />
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <p className="py-8 text-[var(--text-muted)]">Nothing here yet.</p>
        )}
      </div>
    </div>
  );
}
