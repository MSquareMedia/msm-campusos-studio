import type { Metadata } from "next";
import Script from "next/script";
import { buildMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { scrollGradientStyle } from "@/lib/theme";
import { realEstate } from "@/content/real-estate";
import { getPublishedCaseStudies } from "@/lib/case-studies-content";

export const revalidate = 60;
import { IndustryHero } from "@/components/industry/IndustryHero";
import { SpatialReveal } from "@/components/industry/real-estate/SpatialReveal";
import { PointOfView } from "@/components/industry/PointOfView";
import { CapabilityJourney } from "@/components/industry/CapabilityJourney";
import { ImageBreak } from "@/components/industry/ImageBreak";
import { CapabilityExplorer } from "@/components/industry/real-estate/CapabilityExplorer";
import { ProofStatBand } from "@/components/industry/ProofStatBand";
import { CaseStudyFeature } from "@/components/industry/CaseStudyFeature";
import { ClientWordmarks } from "@/components/industry/ClientWordmarks";
import { TestimonialSection } from "@/components/industry/TestimonialSection";
import { EngagementModel } from "@/components/industry/EngagementModel";
import { GovernanceSection } from "@/components/industry/GovernanceSection";
import { FinalCTA } from "@/components/industry/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: realEstate.metaTitle,
  description: realEstate.metaDescription,
  path: "/real-estate",
});

export default async function RealEstatePage() {
  const publishedCaseStudies = await getPublishedCaseStudies("real-estate");
  const service = serviceJsonLd({
    name: realEstate.metaTitle,
    description: realEstate.metaDescription,
    path: "/real-estate",
    industry: "Real Estate",
  });
  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: "Real Estate", path: "/real-estate" },
  ]);

  return (
    <>
      <Script
        id="real-estate-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <Script
        id="real-estate-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <IndustryHero
        variant="real-estate"
        eyebrow={realEstate.hero.eyebrow}
        headline={realEstate.hero.headline}
        supportingCopy={realEstate.hero.supportingCopy}
        mediaLabel="Modern minimalist living room with natural light"
        mediaSrc="/images/real-estate/hero.jpg"
        capabilitiesHref="#capabilities"
      />

      {realEstate.proofStats && (
        <ProofStatBand
          heading={realEstate.proofStats.heading}
          stats={realEstate.proofStats.stats}
          variant="inverse"
        />
      )}

      {/* Everything between the (untouched) hero/proof band and the final
          CTA sits on one continuous white-to-peach gradient, same
          treatment as the homepage, so the background never hard-cuts
          between flat sections as the page scrolls. */}
      <div style={scrollGradientStyle}>
      <SpatialReveal
        heading={realEstate.story.heading}
        intro={realEstate.story.intro}
        moments={realEstate.story.moments}
      />

      <PointOfView
        heading={realEstate.pov.heading}
        body={realEstate.pov.body}
        flowSteps={realEstate.capabilityGroups.map((g) => g.title)}
      />

      <div id="capabilities">
        <CapabilityJourney
          heading="Full-spectrum capability, applied where it matters"
          groups={realEstate.capabilityGroups}
        />
      </div>

      <ImageBreak
        src="/images/real-estate/detail.jpg"
        alt="Corner of a modern glass building facade against the sky"
        credit="Photography by Jonathan Simcoe, via Wikimedia Commons (CC0)."
      />

      {realEstate.capabilityExplorer && (
        <CapabilityExplorer
          heading={realEstate.capabilityExplorer.heading}
          intro={realEstate.capabilityExplorer.intro}
          assetTypes={realEstate.capabilityExplorer.assetTypes}
          capabilityGroups={realEstate.capabilityGroups}
          modernServiceItems={realEstate.modernServices.items}
        />
      )}

      <CaseStudyFeature
        industryLabel={realEstate.industryLabel}
        caseStudies={publishedCaseStudies}
      />

      {realEstate.clients && (
        <ClientWordmarks
          heading={realEstate.clients.heading}
          disclosure={realEstate.clients.disclosure}
          logos={realEstate.clients.logos}
        />
      )}

      {realEstate.testimonials && (
        <TestimonialSection
          heading="What our real estate partners say"
          testimonials={realEstate.testimonials}
        />
      )}

      <EngagementModel steps={realEstate.engagementModel} />

      <GovernanceSection
        heading={realEstate.governance.heading}
        body={realEstate.governance.body}
        note={realEstate.governance.note}
      />
      </div>

      <FinalCTA heading={realEstate.finalCta.heading} body={realEstate.finalCta.body} />
    </>
  );
}
