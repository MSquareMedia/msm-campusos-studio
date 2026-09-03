import type { Metadata } from "next";
import Script from "next/script";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getAllPortfolio } from "@/lib/case-studies-content";
import { WorkIndex } from "@/components/homepage/WorkIndex";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description: "Brands this team has built, before and alongside SOTAPO.",
  path: "/work",
});

/**
 * The full portfolio index, as its own page.
 *
 * Used to live embedded on the homepage; moved out when the homepage
 * consolidated onto a single "past work" format (the case-study cards in
 * CaseStudyHighlights). WorkIndex itself is unchanged, same typographic
 * index, same cursor-reveal images, just no longer sharing a page with a
 * different visual language for the same idea.
 */
export default async function WorkPage() {
  const portfolio = await getAllPortfolio();
  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: "Work", path: "/work" },
  ]);

  return (
    <>
      <Script
        id="work-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <WorkIndex pieces={portfolio} />
    </>
  );
}
