import type { Metadata } from "next";
import Script from "next/script";
import { buildMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { scrollGradientStyle } from "@/lib/theme";
import { automotive } from "@/content/automotive";
import { getPublishedCaseStudies } from "@/lib/case-studies-content";

export const revalidate = 60;
import { IndustryHero } from "@/components/industry/IndustryHero";
import { PinnedJourney } from "@/components/industry/automotive/PinnedJourney";
import { PointOfView } from "@/components/industry/PointOfView";
import { CapabilityJourney } from "@/components/industry/CapabilityJourney";
import { ImageBreak } from "@/components/industry/ImageBreak";
import { ModernServicesExplorer } from "@/components/industry/ModernServicesExplorer";
import { CaseStudyFeature } from "@/components/industry/CaseStudyFeature";
import { ClientWordmarks } from "@/components/industry/ClientWordmarks";
import { TestimonialSection } from "@/components/industry/TestimonialSection";
import { EngagementModel } from "@/components/industry/EngagementModel";
import { GovernanceSection } from "@/components/industry/GovernanceSection";
import { FinalCTA } from "@/components/industry/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: automotive.metaTitle,
  description: automotive.metaDescription,
  path: "/automotive",
});

export default async function AutomotivePage() {
  const publishedCaseStudies = await getPublishedCaseStudies("automotive");
  const service = serviceJsonLd({
    name: automotive.metaTitle,
    description: automotive.metaDescription,
    path: "/automotive",
    industry: "Automotive",
  });
  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: "Automotive", path: "/automotive" },
  ]);

  return (
    <>
      <Script
        id="automotive-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <Script
        id="automotive-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <IndustryHero
        variant="automotive"
        eyebrow={automotive.hero.eyebrow}
        headline={automotive.hero.headline}
        supportingCopy={automotive.hero.supportingCopy}
        mediaLabel="Close detail of dark leather car interior stitching"
        mediaSrc="/images/automotive/hero.jpg"
        capabilitiesHref="#capabilities"
        enablePointerDrift
      />

      {/* Everything between the (untouched) hero and the final CTA sits on
          one continuous white-to-peach gradient, same treatment as the
          homepage, so the background never hard-cuts between flat sections
          as the page scrolls. */}
      <div style={scrollGradientStyle}>
      <PinnedJourney
        heading={automotive.story.heading}
        intro={automotive.story.intro}
        moments={automotive.story.moments}
      />

      <PointOfView
        heading={automotive.pov.heading}
        body={automotive.pov.body}
        flowSteps={automotive.capabilityGroups.map((g) => g.title)}
      />

      <div id="capabilities">
        <CapabilityJourney
          heading="Full-spectrum capability, applied where it matters"
          groups={automotive.capabilityGroups}
        />
      </div>

      <ImageBreak
        src="/images/automotive/detail.jpg"
        alt="Close detail of an alloy wheel rim"
        credit="Photography by Vlad Grebenyev, via Wikimedia Commons (CC0)."
      />

      <ModernServicesExplorer
        heading={automotive.modernServices.heading}
        intro={automotive.modernServices.intro}
        items={automotive.modernServices.items}
      />

      <CaseStudyFeature
        industryLabel={automotive.industryLabel}
        caseStudies={publishedCaseStudies}
      />

      {automotive.clients && (
        <ClientWordmarks
          heading={automotive.clients.heading}
          disclosure={automotive.clients.disclosure}
          logos={automotive.clients.logos}
        />
      )}

      {automotive.testimonials && (
        <TestimonialSection
          heading="What our automotive partners say"
          testimonials={automotive.testimonials}
        />
      )}

      <EngagementModel steps={automotive.engagementModel} />

      <GovernanceSection
        heading={automotive.governance.heading}
        body={automotive.governance.body}
        note={automotive.governance.note}
      />
      </div>

      <FinalCTA heading={automotive.finalCta.heading} body={automotive.finalCta.body} />
    </>
  );
}
