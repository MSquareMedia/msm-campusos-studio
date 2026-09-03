import { homepage } from "@/content/homepage";

/**
 * SOTAPO is the masterbrand: a growth agency, marketing partner to every
 * industry. Education is the one vertical where it goes further, an
 * operating partner, not just a marketing one, and that deeper offer is
 * endorsed rather than renamed: "Sotapo Education, powered by MSM CampusOS."
 * MSM CampusOS is never the masterbrand and never appears outside the
 * education page (/campusos). See education.ts for that page's own content.
 */
export const siteConfig = {
  name: "SOTAPO",
  tagline: "We move what matters.",
  parentBrand: "MSM Unify",
  url: "https://www.msmunify.com",
  description:
    "SOTAPO is a growth agency for automotive, healthcare, real estate, and beyond, and, as Sotapo Education, powered by MSM CampusOS, the operating system behind education: admissions, academics, and institutional operations, not just marketing.",
};

export type IndustrySlug = "education" | "automotive" | "healthcare" | "real-estate";

export const industryNav: { slug: IndustrySlug; label: string; href: string; blurb: string }[] = [
  {
    slug: "education",
    label: "Education",
    // The one industry with its own path: this is where SOTAPO becomes an
    // operating partner, not just a marketing one, see education.ts.
    href: "/campusos",
    blurb: "Where we move more than perception. 14+ years, education-only.",
  },
  {
    slug: "automotive",
    label: "Automotive",
    href: "/automotive",
    blurb: "Brand desire to ownership loyalty.",
  },
  {
    slug: "healthcare",
    label: "Healthcare",
    href: "/healthcare",
    blurb: "Clear, trustworthy patient marketing.",
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    href: "/real-estate",
    blurb: "Place marketing that converts.",
  },
];

export type SolutionSlug =
  | "strategy-intelligence"
  | "brand-creative"
  | "demand-media"
  | "digital-experience"
  | "data-ai-measurement";

export const solutionsNav: { slug: SolutionSlug; label: string; href: string; blurb: string }[] = [
  {
    slug: "strategy-intelligence",
    label: "Strategy & Intelligence",
    href: "/solutions/strategy-intelligence",
    blurb: "Research, positioning, and go-to-market planning.",
  },
  {
    slug: "brand-creative",
    label: "Brand & Creative",
    href: "/solutions/brand-creative",
    blurb: "Identity systems, campaigns, film, and content.",
  },
  {
    slug: "demand-media",
    label: "Demand & Media",
    href: "/solutions/demand-media",
    blurb: "Paid, search, PR, and experiential that converts.",
  },
  {
    slug: "digital-experience",
    label: "Digital Experience & Conversion",
    href: "/solutions/digital-experience",
    blurb: "Sites, journeys, CRM, and conversion design.",
  },
  {
    slug: "data-ai-measurement",
    label: "Data, AI & Measurement",
    href: "/solutions/data-ai-measurement",
    blurb: "Measurement, attribution, and applied AI.",
  },
];

/**
 * The macro service lines behind each solution, joined to the nav entries by
 * title. The mega menu shows these so a visitor can see what "Demand & Media"
 * actually contains without committing to a page load. Single source: the
 * same groups the homepage service section renders, so the two can never drift.
 */
export const solutionsMega = solutionsNav.map((solution) => ({
  ...solution,
  services:
    homepage.serviceUniverse.groups.find((group) => group.title === solution.label)?.items ?? [],
}));

/** The full, filterable case-study index. */
export const caseStudiesLink = { label: "Case Studies", href: "/case-studies" };

export const primaryCta = { label: "Start a conversation", href: "/contact" };
export const auditCta = { label: "Get a free audit", href: "/audit" };
export const secondaryCta = { label: "Explore our capabilities" };

export const footerLinks = {
  industries: industryNav,
  company: [
    { label: "About SOTAPO", href: "/about" },
    { label: "Sotapo Education, powered by MSM CampusOS", href: "/campusos" },
    { label: "About MSM Unify", href: "https://www.msmunify.com/about-us/" },
    { label: "Free marketing audit", href: "/audit" },
    { label: "Careers", href: "/careers" },
  ],
  legal: [
    { label: "Privacy policy", href: "https://www.msmunify.com/privacy-policy/" },
    { label: "Terms of use", href: "https://www.msmunify.com/terms-of-use/" },
  ],
};
