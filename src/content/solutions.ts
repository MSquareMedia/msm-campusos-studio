import { homepage } from "./homepage";
import type { SolutionSlug } from "@/lib/site-config";

export type SolutionImage = {
  src: string;
  alt: string;
  /** Only set for externally sourced photography that requires attribution. */
  credit?: string;
};

export type SolutionContent = {
  slug: SolutionSlug;
  /** Must exactly match a `title` in homepage.serviceUniverse.groups, the
   * single factual source for what each solution covers. Items are pulled
   * from there at render time via getSolutionItems, never duplicated here. */
  groupTitle: string;
  metaDescription: string;
  /** One short, bold line. Not a paragraph. */
  heroLine: string;
  /** One supporting sentence under the hero line. */
  heroSupport: string;
  /** A short connective paragraph, in the same voice as homepage.statement
   * and education.pov, ties the capability list together without
   * describing each item individually. */
  intro: string;
  /** Real, already-hosted supporting image breaking up the page. */
  image: SolutionImage;
  /**
   * Real portfolio work (src/content/portfolio.ts) that thematically fits
   * this solution, shown as visual proof with links to /work/{slug}.
   * Left empty on pages where nothing in the existing library is a genuine
   * fit, rather than forcing a mismatch.
   */
  workSlugs: string[];
};

export const solutions: SolutionContent[] = [
  {
    slug: "strategy-intelligence",
    groupTitle: "Strategy & Intelligence",
    metaDescription:
      "Market and audience research, brand strategy and positioning, customer journey design, and go-to-market planning: the evidence layer under every SOTAPO engagement.",
    heroLine: "Know before you build.",
    heroSupport:
      "The layer under everything else we make: who you're talking to, where they stand today, and what has to be true for them to move.",
    intro:
      "We don't start with a creative brief. We start with what's actually true about the market, the audience, and the competitive field, then build the plan a campaign can stand on.",
    image: {
      src: "/images/automotive/journey/discovery.jpg",
      alt: "A researcher checking notes on a phone beside an open laptop at a café table.",
    },
    workSlugs: ["maison-dauraine", "omniyat"],
  },
  {
    slug: "brand-creative",
    groupTitle: "Brand & Creative",
    metaDescription:
      "Brand identity systems, integrated campaigns, copywriting, design, motion, 3D and CGI, social content, and localization: SOTAPO's creative bench, built to one standard.",
    heroLine: "Make it unmistakable.",
    heroSupport:
      "Identity systems, campaigns, film, and content built to carry a brand's point of view across every format it needs to live in.",
    intro:
      "The work below isn't a mood board. It's identity systems, campaign platforms, and film that actually shipped, built by the same team behind SOTAPO.",
    image: {
      src: "/images/portfolio/tigc.jpg",
      alt: "TIGC's SKY UP NOW campaign key visual with Suryakumar Yadav, for the brand's Korean Wear and DC x Marvel collection.",
    },
    workSlugs: ["uncharted", "tigc", "crafted-for-impact"],
  },
  {
    slug: "demand-media",
    groupTitle: "Demand & Media",
    metaDescription:
      "Search, paid social, programmatic and display, connected TV, SEO and AI-search visibility, public relations, experiential, and account-based marketing: the channels that turn attention into pipeline.",
    heroLine: "Earn the attention. Then convert it.",
    heroSupport:
      "Every channel that puts a brand in front of the right audience at the right moment, bought and measured as one system instead of a stack of separate line items.",
    intro:
      "Reach without a plan is just spend. We choose the channel mix deliberately, run it as one connected system, and hold every line of it to the same bar.",
    image: {
      src: "/images/portfolio/gallery/crafted-for-impact/1.jpg",
      alt: "Cornitos #AbTakKahanThe outdoor and packaging campaign",
    },
    workSlugs: ["crafted-for-impact", "tigc", "omniyat"],
  },
  {
    slug: "digital-experience",
    groupTitle: "Digital Experience & Conversion",
    metaDescription:
      "Websites, landing pages, conversion rate optimization, booking and inquiry flows, marketing automation, CRM journeys, and AI-assisted lead qualification: built to convert interest into action.",
    heroLine: "Where interest becomes action.",
    heroSupport:
      "The sites, flows, and journeys that turn a visit into an inquiry, and an inquiry into a conversation with your team.",
    intro:
      "A beautiful site that doesn't convert is a brochure. We build the experience and the mechanics behind it, the forms, the automation, the CRM handoff, as one connected system.",
    image: {
      src: "/images/portfolio/gallery/uncharted/2.jpg",
      alt: "Uncharted website, Exquisite Materials and About Us sections",
    },
    workSlugs: ["uncharted", "omniyat"],
  },
  {
    slug: "data-ai-measurement",
    groupTitle: "Data, AI & Measurement",
    metaDescription:
      "Measurement planning, analytics implementation, first-party data strategy, attribution and incrementality testing, and generative AI content operations with human review.",
    heroLine: "Prove what's working. Fix what isn't.",
    heroSupport:
      "The measurement layer that tells you which campaigns earned the result, and the AI-assisted operations that help the rest of the team move faster, with a human still reviewing every output.",
    intro:
      "None of the work above means anything if we can't tell you what it did. This is the layer that makes every other engagement accountable.",
    image: {
      src: "/images/portfolio/crafted-for-impact.jpg",
      alt: "Case study cover from the Crafted for Impact showcase, part of the campaign performance work behind SOTAPO.",
    },
    workSlugs: [],
  },
];

export function getSolutionItems(groupTitle: string): string[] {
  const group = homepage.serviceUniverse.groups.find((g) => g.title === groupTitle);
  return group ? group.items : [];
}
