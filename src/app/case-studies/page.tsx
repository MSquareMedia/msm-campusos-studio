import type { Metadata } from "next";
import Script from "next/script";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getAllCaseStudies, getAllPortfolio } from "@/lib/case-studies-content";
import { industryNav } from "@/lib/site-config";
import { CaseStudiesIndex } from "@/components/case-studies/CaseStudiesIndex";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  description: "Every piece of real, named work this team has shipped, with the numbers each client reported.",
  path: "/case-studies",
});

/**
 * The full portfolio as one card grid, filterable by industry. Previously
 * the only "all case studies" surface was the homepage's curated set (just
 * the education highlights); this is the actual index those cards link out
 * to, and the target for the header's "Case Studies" nav item.
 */
export default async function CaseStudiesPage() {
  const [caseStudies, portfolio] = await Promise.all([getAllCaseStudies(), getAllPortfolio()]);
  const published = caseStudies.filter((cs) => cs.status === "published");
  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: "Case Studies", path: "/case-studies" },
  ]);

  return (
    <>
      <Script
        id="case-studies-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <CaseStudiesIndex pieces={portfolio} caseStudies={published} industries={industryNav} />
    </>
  );
}
