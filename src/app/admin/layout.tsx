import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", minHeight: "100dvh" }}>
      <div className="container-page flex items-center gap-6 border-b py-4" style={{ borderColor: "var(--border)" }}>
        <span className="font-display text-sm font-bold">SOTAPO admin</span>
        <nav className="flex gap-5 text-sm text-[var(--text-muted)]">
          <Link href="/admin/case-studies" className="hover:text-[var(--text)]">
            Case studies
          </Link>
          <Link href="/admin/submissions" className="hover:text-[var(--text)]">
            Submissions
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
