import type { Metadata } from "next";
import { listSubmissions, isConfigured, type Submission } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Submissions",
  // Belt and braces alongside the Basic-auth gate in middleware.ts: even a
  // leaked URL should never end up in an index.
  robots: { index: false, follow: false },
};

const KIND_LABEL: Record<string, string> = {
  audit: "Free audit",
  contact: "Contact",
  careers: "Careers",
};

function formatWhen(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Row({ submission }: { submission: Submission }) {
  const entries = Object.entries(submission.payload);
  return (
    <details
      className="group border-b"
      style={{ borderColor: "var(--border)" }}
      open={false}
    >
      <summary className="flex cursor-pointer flex-wrap items-baseline gap-x-4 gap-y-1 py-4 marker:content-none">
        <span
          className="font-display text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--brand-accent)" }}
        >
          {KIND_LABEL[submission.kind] ?? submission.kind}
        </span>
        <span className="font-display text-sm font-semibold">
          {submission.payload.name || submission.payload.email || `#${submission.id}`}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          {submission.payload.email}
        </span>
        <span className="ml-auto text-xs tabular-nums text-[var(--text-muted)]">
          {formatWhen(submission.created_at)}
        </span>
      </summary>
      <dl className="grid gap-x-6 gap-y-2 pb-5 pl-1 sm:grid-cols-[180px_1fr]">
        {entries.map(([key, value]) => (
          <div key={key} className="contents">
            <dt className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              {key}
            </dt>
            <dd className="text-sm whitespace-pre-wrap break-words">{value || ", "}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

export default async function SubmissionsPage() {
  if (!isConfigured()) {
    return (
      <div className="container-page py-20">
        <h1 className="font-display text-2xl font-bold">Submissions</h1>
        <p className="mt-4 max-w-lg text-[var(--text-muted)]">
          No database is attached yet. Add a Postgres store to this Vercel project and
          redeploy; the table is created automatically on the first submission. Setup
          steps are in <code>ADMIN_SETUP.md</code>.
        </p>
      </div>
    );
  }

  let submissions: Submission[] = [];
  let error: string | null = null;
  try {
    submissions = await listSubmissions();
  } catch {
    error = "Could not read from the database. Check the connection string.";
  }

  return (
    <div className="container-page py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Submissions</h1>
        <p className="text-sm text-[var(--text-muted)]">
          {submissions.length} most recent
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-6 text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      {!error && submissions.length === 0 && (
        <p className="mt-6 text-[var(--text-muted)]">
          Nothing submitted yet. Entries appear here as soon as someone completes a
          form.
        </p>
      )}

      {submissions.length > 0 && (
        <div className="mt-8 border-t" style={{ borderColor: "var(--border)" }}>
          {submissions.map((submission) => (
            <Row key={submission.id} submission={submission} />
          ))}
        </div>
      )}
    </div>
  );
}
