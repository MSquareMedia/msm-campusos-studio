"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This removes it from the live site.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/case-studies/${slug}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Could not delete.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className="text-sm font-semibold disabled:opacity-50"
      style={{ color: "var(--danger)" }}
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
