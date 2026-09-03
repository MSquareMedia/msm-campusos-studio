import type { Metadata } from "next";
import Script from "next/script";
import { buildMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { scrollGradientStyle } from "@/lib/theme";
import { healthcare } from "@/content/healthcare";
import { getPublishedCaseStudies } from "@/lib/case-studies-content";

export const revalidate = 60;
import { IndustryHero } from "@/components/industry/IndustryHero";
import { CalmReveal } from "@/components/industry/healthcare/CalmReveal";
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
  title: healthcare.metaTitle,
  description: healthcare.metaDescription,
  path: "/healthcare",
});

export default async function HealthcarePage() {
  const publishedCaseStudies = await getPublishedCaseStudies("healthcare");
  const service = serviceJsonLd({
    name: healthcare.metaTitle,
    description: healthcare.metaDescription,
    path: "/healthcare",
    industry: "Healthcare",
  });
  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: "Healthcare", path: "/healthcare" },
  ]);

  return (
    <>
      <Script
        id="healthcare-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <Script
        id="healthcare-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <IndustryHero
        variant="healthcare"
        eyebrow={healthcare.hero.eyebrow}
        headline={healthcare.hero.headline}
        supportingCopy={healthcare.hero.supportingCopy}
        mediaLabel="Clean, modern clinical reception desk in natural light"
        mediaSrc="/images/healthcare/hero.jpg"
        capabilitiesHref="#capabilities"
      />

      {/* Everything between the (untouched) hero and the final CTA sits on
          one continuous white-to-peach gradient, same treatment as the
          homepage, so the background never hard-cuts between flat sections
          as the page scrolls. */}
      <div style={scrollGradientStyle}>
      <CalmReveal
        heading={healthcare.story.heading}
        intro={healthcare.story.intro}
        moments={healthcare.story.moments}
      />

      <PointOfView
        heading={healthcare.pov.heading}
        body={healthcare.pov.body}
        flowSteps={healthcare.capabilityGroups.map((g) => g.title)}
      />

      <div id="capabilities">
        <CapabilityJourney
          heading="Full-spectrum capability, applied where it matters"
          groups={healthcare.capabilityGroups}
        />
      </div>

      <ImageBreak
        src="/images/healthcare/detail.jpg"
        alt="Calm, modern hospital hallway with natural light"
        credit="Photography by Beendy234, via Wikimedia Commons (CC0)."
      />

      <ModernServicesExplorer
        heading={healthcare.modernServices.heading}
        intro={healthcare.modernServices.intro}
        items={healthcare.modernServices.items}
      />

      <CaseStudyFeature
        industryLabel={healthcare.industryLabel}
        caseStudies={publishedCaseStudies}
      />

      {healthcare.clients && (
        <ClientWordmarks
          heading={healthcare.clients.heading}
          disclosure={healthcare.clients.disclosure}
          logos={healthcare.clients.logos}
          size="lg"
        />
      )}

      {healthcare.testimonials && (
        <TestimonialSection
          heading="What our healthcare partners say"
          testimonials={healthcare.testimonials}
        />
      )}

      <EngagementModel steps={healthcare.engagementModel} />

      <GovernanceSection
        heading={healthcare.governance.heading}
        body={healthcare.governance.body}
        note={healthcare.governance.note}
      />
      </div>

      <FinalCTA heading={healthcare.finalCta.heading} body={healthcare.finalCta.body} />
    </>
  );
}
