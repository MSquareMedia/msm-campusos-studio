import type { Metadata } from "next";
import Script from "next/script";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { careers } from "@/content/careers";
import { CareersHero } from "@/components/industry/careers/CareersHero";
import { CulturePillars } from "@/components/industry/careers/CulturePillars";
import { RoleCategories } from "@/components/industry/careers/RoleCategories";
import { CareersFlow } from "@/components/forms/CareersFlow";

export const metadata: Metadata = buildMetadata({
  title: careers.metaTitle,
  description: careers.metaDescription,
  path: "/careers",
});

export default function CareersPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: "Careers", path: "/careers" },
  ]);

  return (
    <>
      <Script
        id="careers-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <CareersHero
        eyebrow={careers.hero.eyebrow}
        headline={careers.hero.headline}
        supportingCopy={careers.hero.supportingCopy}
      />

      <CulturePillars
        heading={careers.culture.heading}
        intro={careers.culture.intro}
        pillars={careers.culture.pillars}
      />

      <RoleCategories
        heading={careers.roles.heading}
        intro={careers.roles.intro}
        categories={careers.roles.categories}
        ctaLabel={careers.roles.ctaLabel}
      />

      <section id="open-application" className="container-page scroll-mt-28 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:self-start">
            <p className="eyebrow" style={{ color: "var(--brand-accent)" }}>
              Open application
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold leading-[1.1] md:text-4xl">
              {careers.finalCta.heading}
            </h2>
            <p className="mt-4 text-lg text-[var(--text-muted)]">{careers.finalCta.body}</p>
          </div>
          <CareersFlow />
        </div>
      </section>
    </>
  );
}
