import type { Metadata } from "next";
import Script from "next/script";
import { buildMetadata, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";
import { scrollGradientStyle } from "@/lib/theme";
import { homepage } from "@/content/homepage";
import { education } from "@/content/education";
import { automotive } from "@/content/automotive";
import { healthcare } from "@/content/healthcare";
import { realEstate } from "@/content/real-estate";
import { homepageTestimonials } from "@/content/homepage-testimonials";
import { KineticStatement } from "@/components/homepage/KineticStatement";
import { RingHero } from "@/components/homepage/RingHero";
import { CaseStudyIndex } from "@/components/homepage/CaseStudyIndex";
import { getAllCaseStudies } from "@/lib/case-studies-content";
import { StickyChapters } from "@/components/motion/StickyChapters";
import { homepageChapters } from "@/content/homepage-chapters";
import { ImpactNumbers } from "@/components/homepage/ImpactNumbers";
import { ToolStack } from "@/components/homepage/ToolStack";
import { IndustryLogoLanes } from "@/components/industry/IndustryLogoLanes";
import { clientLanes } from "@/content/client-lanes";
import { ServiceMesh } from "@/components/homepage/ServiceMesh";
import { TestimonialSection } from "@/components/industry/TestimonialSection";
import { TeamSection } from "@/components/industry/TeamSection";
import { LeadershipVision } from "@/components/industry/LeadershipVision";
import { FinalCTA } from "@/components/industry/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: homepage.metaTitle,
  description: homepage.metaDescription,
  path: "/",
});

/**
 * Hero marquee order: the first three logos of each industry, education
 * leading, then everything that remains in the same industry order. Education
 * is the flagship vertical and has by far the deepest roster, so a plain
 * concatenation would open the marquee with nineteen education logos before
 * reaching another sector; interleaving the first three of each shows the
 * spread immediately and still puts education first.
 */
function buildHeroLogos() {
  const industries = [education, automotive, healthcare, realEstate];
  // No exclusion list needed here any more: the marquee used to force every
  // logo to a white silhouette (brightness-0 + invert), which rendered as a
  // blank rectangle for any logo built from a filled shape rather than a
  // thin outline. RingHero now shows every logo in its real colour on a
  // fixed-size white card instead, so nothing in the roster needs to be
  // hidden from this marquee any more.
  const lists = industries.map((i) => i.clients?.logos ?? []);
  const seen = new Set<string>();
  const ordered = [
    ...lists.flatMap((list) => list.slice(0, 3)),
    ...lists.flatMap((list) => list.slice(3)),
  ];
  return ordered.filter((logo) => (seen.has(logo.name) ? false : (seen.add(logo.name), true)));
}

export const revalidate = 60;

export default async function SotapoHome() {
  const breadcrumb = breadcrumbJsonLd([{ name: "SOTAPO", path: "/" }]);
  const org = organizationJsonLd();
  const heroLogos = buildHeroLogos();
  const caseStudies = await getAllCaseStudies();

  return (
    <>
      <Script
        id="sotapo-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="sotapo-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />

      {/* Hero carries the proposition, the CTA and the client marquee inside
          the first viewport. The brand film that used to sit here pushed all
          three below the fold and cost megabytes before a word was read; it
          is still available on the education page, where it is the subject
          rather than the wrapper. Education logos lead the marquee. */}
      <RingHero
        headline={homepage.hero.headline}
        supportingCopy={homepage.hero.supportingCopy}
        logos={heroLogos}
      />

      {/* Everything between the hero and the final CTA sits on a gradient
          that starts white right under the (untouched) black hero and
          settles into warm peach by the time the page reaches the case
          studies further down, rather than a flat peach fill, a scroll
          feel instead of a hard cut. A CSS gradient sized to this div's own
          height does this with no JS: the stops are percentages of *this*
          element, so they land at the same relative scroll depth regardless
          of how tall the page's content ends up being. Any section with its
          own explicit surface (muted grey, inverse dark) still shows its own
          color on top of this. */}
      <div style={scrollGradientStyle}>
      <KineticStatement line={homepage.statement.line} body={homepage.statement.body} />

      {/* The narrative spine: four industries as chapters the visitor scrolls
          through, replacing the old eyebrow + heading + paragraph + card-rail
          stack. Same four destinations, a fraction of the reading. This used
          to be immediately followed by a second "Four industries. One
          standard." grid (IndustryRail) repeating the exact same four
          destinations a second time in a row, removed as a straight
          duplicate. Each chapter now carries its own CTA into that
          industry's page instead. */}
      <StickyChapters chapters={homepageChapters} />

      <ImpactNumbers />

      {/* Case studies as the typographic hover-reveal index (client name at
          headline scale, image held back until the cursor asks for it),           the format this section used before the challenge/solution/results
          card grid replaced it, restored at the client's direction. Every
          published case study across all four industries, education first.
          The full portfolio index (older work, pre-dating these case
          studies) is still at /work; the full case-study set with
          challenge/solution/results detail is at /case-studies. */}
      <CaseStudyIndex caseStudies={caseStudies.filter((cs) => cs.status === "published")} />

      {/* Four lanes, one per sector, education first. Replaces the single
          deduped marquee: that flattened 33 clients into one strip with no
          indication of which sector any of them belonged to, and quietly
          dropped each industry's own accuracy disclosure. Each lane now
          carries its own count, its own link, and its own disclosure. */}
      <IndustryLogoLanes lanes={clientLanes} />

      <ServiceMesh />

      <ToolStack />

      <TestimonialSection
        heading="What clients across industries say"
        intro="A selection of quotes from the brands this team has worked with. See each industry page for the full roster."
        testimonials={homepageTestimonials}
      />

      {/* Same three-block team structure as the education page: the two
          founders and their own words, then the delivery bench, then the
          service seats. One flat list put a founder's quote and a delivery
          lead's bio at identical weight. */}
      {education.team?.leadership && (
        <LeadershipVision
          heading={education.team.leadership.heading}
          intro={education.team.leadership.intro}
          quotes={education.team.quotes}
        />
      )}

      {education.team && (
        <TeamSection
          heading={education.team.heading}
          intro={education.team.intro}
          members={education.team.members}
        />
      )}

      {/* "Heads of service" (ServiceLeadership) moved to About Us only, at
          the client's direction, it no longer renders on the homepage. */}
      </div>

      <FinalCTA heading={homepage.finalCta.heading} body={homepage.finalCta.body} />
    </>
  );
}
