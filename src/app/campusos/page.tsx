import type { Metadata } from "next";
import Script from "next/script";
import { buildMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { scrollGradientStyle } from "@/lib/theme";
import { education } from "@/content/education";
import { getPublishedCaseStudies } from "@/lib/case-studies-content";

export const revalidate = 60;
import { IndustryHero } from "@/components/industry/IndustryHero";
import { ChapterStory } from "@/components/industry/education/ChapterStory";
import { PointOfView } from "@/components/industry/PointOfView";
import { CapabilityJourney } from "@/components/industry/CapabilityJourney";
import { ModernServicesExplorer } from "@/components/industry/ModernServicesExplorer";
import { ProofLedger } from "@/components/industry/ProofLedger";
import { ClientRollCall } from "@/components/industry/ClientRollCall";
import { CaseStudyFeature } from "@/components/industry/CaseStudyFeature";
import { TestimonialSection } from "@/components/industry/TestimonialSection";
import { EngagementModel } from "@/components/industry/EngagementModel";
import { GovernanceSection } from "@/components/industry/GovernanceSection";
import { FinalCTA } from "@/components/industry/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: education.metaTitle,
  description: education.metaDescription,
  path: "/campusos",
});

export default async function EducationPage() {
  const publishedCaseStudies = await getPublishedCaseStudies("education");
  const service = serviceJsonLd({
    name: education.metaTitle,
    description: education.metaDescription,
    path: "/campusos",
    industry: "Education",
  });
  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: "Sotapo Education", path: "/campusos" },
  ]);

  return (
    <>
      <Script
        id="education-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <Script
        id="education-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <IndustryHero
        variant="education"
        eyebrow={education.hero.eyebrow}
        headline={education.hero.headline}
        supportingCopy={education.hero.supportingCopy}
        mediaLabel="MSM CampusOS official brand film poster"
        mediaSrc={education.hero.video?.posterSrc}
        video={education.hero.video}
        capabilitiesHref="#capabilities"
      />

      {/* Everything between the (untouched) hero and the final CTA sits on
          one continuous white-to-peach gradient rather than a stack of flat
          white/muted-grey sections, same treatment as the homepage, so the
          background never hard-cuts from one flat colour to another as the
          page scrolls. */}
      <div style={scrollGradientStyle}>
      <ChapterStory
        heading={education.story.heading}
        intro={education.story.intro}
        moments={education.story.moments}
      />

      <PointOfView
        heading={education.pov.heading}
        body={education.pov.body}
        flowSteps={education.capabilityGroups.map((g) => g.title)}
      />

      {education.proofStats && education.proofLedger && (
        <ProofLedger
          heading={education.proofLedger.heading}
          intro={education.proofLedger.intro}
          stats={education.proofStats.stats}
        />
      )}

      <div id="capabilities">
        <CapabilityJourney
          heading="The four jobs a campus needs done."
          groups={education.capabilityGroups}
        />
      </div>


      <ModernServicesExplorer
        heading={education.modernServices.heading}
        intro={education.modernServices.intro}
        items={education.modernServices.items}
      />

      {education.clients && (
        <ClientRollCall
          heading={education.clients.heading}
          disclosure={education.clients.disclosure}
          logos={education.clients.logos}
          countLabel={education.clients.countLabel}
        />
      )}

      {/* Leadership, the wider team and service-head sections were removed
          from this page at the client's direction, they now live on the
          homepage (leadership + team) and About Us (service heads) only,
          rather than being repeated on every industry page. */}

      <CaseStudyFeature
        industryLabel={education.industryLabel}
        caseStudies={publishedCaseStudies}
      />

      {/* The only testimonials on the site from named institutions rather than
          role-only placeholders, so they belong on the flagship vertical's own
          page and not just in the homepage's curated subset. */}
      {education.testimonials && (
        <TestimonialSection
          heading="What institutions say"
          testimonials={education.testimonials}
        />
      )}

      <EngagementModel steps={education.engagementModel} />

      <GovernanceSection
        heading={education.governance.heading}
        body={education.governance.body}
        note={education.governance.note}
      />
      </div>

      <FinalCTA heading={education.finalCta.heading} body={education.finalCta.body} />
    </>
  );
}
