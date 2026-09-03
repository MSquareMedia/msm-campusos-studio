import type { Metadata } from "next";
import Script from "next/script";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { audit } from "@/content/audit";
import { AuditFlow } from "@/components/forms/AuditFlow";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";

export const metadata: Metadata = buildMetadata({
  title: audit.metaTitle,
  description: audit.metaDescription,
  path: "/audit",
});

export default function AuditPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: "Free audit", path: "/audit" },
  ]);

  return (
    <>
      <Script
        id="audit-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="container-page py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow" style={{ color: "var(--brand-accent)" }}>
            {audit.hero.eyebrow}
          </p>
          <TextReveal
            as="h1"
            lines={audit.hero.headline}
            className="font-display mt-4 text-4xl font-bold leading-[1.05] md:text-6xl"
          />
          <FadeUp delay={0.1}>
            <p className="mt-6 text-lg text-[var(--text-muted)]">{audit.hero.supportingCopy}</p>
          </FadeUp>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div>
            <AuditFlow />
          </div>

          {/* Sticky, never pinned with GSAP: position: sticky has no
              pin-spacer to insert and cannot desync from the scroller. */}
          <aside className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:self-start">
            <div
              className="border p-7"
              style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
            >
              <h2 className="font-display text-lg font-bold">{audit.aside.heading}</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {audit.aside.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-[var(--text-muted)]">
                    <CheckCircle
                      size={18}
                      weight="fill"
                      aria-hidden="true"
                      className="mt-0.5 shrink-0"
                      style={{ color: "var(--brand-accent)" }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-6 border-t pt-5 text-xs text-[var(--text-muted)]"
                style={{ borderColor: "var(--border)" }}
              >
                {audit.aside.note}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
