export type IndustryCaseStudy = {
  id: string;
  industry: "automotive" | "healthcare" | "real-estate" | "education";
  status: "draft" | "published";
  clientName?: string;
  approvedClientLabel: string;
  geography?: string;
  clientType?: string;
  title: string;
  challenge: string;
  insight?: string;
  idea: string;
  scope: string[];
  execution: string[];
  results: Array<{
    value: string;
    label: string;
    sourceNote: string;
  }>;
  testimonial?: {
    quote: string;
    name: string;
    role: string;
    approvalConfirmed: boolean;
  };
  heroAsset: {
    src: string;
    alt: string;
    type: "image" | "video";
  };
  gallery?: Array<{
    src: string;
    alt: string;
  }>;
  services: string[];
  disclosure?: string;
};

export type CapabilityItem = {
  title: string;
  description: string;
};

export type CapabilityGroup = {
  title: string;
  summary: string;
  items: CapabilityItem[];
};

export type ModernServiceItem = {
  title: string;
  description: string;
  /** Groups items into phases (e.g. "Acquire", "Operate") when the list spans
   *  the full operating system rather than one discipline. Optional, omit
   *  for a flat, ungrouped index. */
  group?: string;
};

export type StoryMoment = {
  label: string;
  title: string;
  description: string;
  image: string;
  /** Overrides the generic "<industry> journey moment: <title>" alt text when
   *  the picture is a specific photograph rather than a stand-in for the step. */
  alt?: string;
  /** Required attribution for CC0 / Wikimedia sourced photography. Carried
   *  with the image wherever it is rendered; it is a licence condition, not a
   *  caption we can drop for layout reasons. */
  credit?: string;
};

export type EngagementStep = {
  step: string;
  title: string;
  description: string;
};

export type AssetManifestItem = {
  fileName: string;
  page: string;
  section: string;
  purpose: string;
  aspectDesktop: string;
  aspectMobile: string;
  minDimensions: string;
  shotDescription: string;
  subjects: string;
  artDirection: string;
  motionOrCrop: string;
  altText: string;
  licensingStatus: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
};

export type ProofStat = {
  value: string;
  label: string;
  sourceNote: string;
};

export type LeaderQuote = {
  quote: string;
  name: string;
  role: string;
  photo?: string;
};

/**
 * A service-leadership SEAT, not a person. Title plus the scope that seat
 * owns, both drawn from service lines that already exist in this content
 * file. It carries no name, photo, or biography by design: the roles are
 * real, the individuals holding them are named only once they actually join.
 * Never populate this type with an invented person.
 */
export type ServiceLeadershipRole = {
  /** e.g. "SEO Head". A role title only. Never a personal name. */
  title: string;
  /** What the seat owns. Lifted verbatim from modernServices/capabilityGroups. */
  scope: string;
};

// PLACEHOLDER TESTIMONIAL CONTENT, replace with real, approved client quotes
// before public launch. Attribution intentionally uses a role only, never a
// fabricated person's name.
export type ClientTestimonial = {
  quote: string;
  /** Role/title only, e.g. "Marketing Director", never a real or invented
   *  personal name. Used unless `personName` is set below. */
  rolePlaceholder: string;
  /**
   * A real, client-supplied byline (e.g. "Sandeep Shetty"), for testimonials
   * that arrived already attributed to a named individual rather than as a
   * role-only placeholder. When set, this renders instead of
   * `rolePlaceholder`. Only set this from an attribution the client actually
   * gave, never invent a name to fill it.
   */
  personName?: string;
  clientName: string; // must match a name already in that industry's clients.logos
  clientLogo?: string; // same src path as in clients.logos; omitted when no approved logo asset is held
  /** Some client marks (a crest plus a multi-line wordmark, e.g. Adamas)
   *  need more vertical room than a flat wordmark to stay legible at the
   *  same rendered scale. Set true to give this logo a taller box. */
  clientLogoTall?: boolean;
};

export type IndustryContent = {
  slug: "automotive" | "healthcare" | "real-estate" | "education";
  industryLabel: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    headline: string;
    supportingCopy: string;
    video?: {
      youtubeId: string;
      posterSrc: string;
      title: string;
    };
  };
  story: {
    heading: string;
    intro: string;
    moments: StoryMoment[];
  };
  pov: {
    heading: string;
    body: string[];
  };
  capabilityGroups: CapabilityGroup[];
  modernServices: {
    heading: string;
    intro: string;
    items: ModernServiceItem[];
  };
  engagementModel: EngagementStep[];
  governance: {
    heading: string;
    body: string[];
    note: string;
  };
  finalCta: {
    heading: string;
    body: string;
  };
  assetManifest: AssetManifestItem[];
  proofStats?: {
    heading: string;
    sourceNote: string;
    stats: ProofStat[];
  };
  /**
   * Optional framing for rendering `proofStats.stats` as a provenance ledger
   * rather than a flat band. Carries headings only: the numbers, labels, and
   * source notes all still come from `proofStats.stats`, and the grouping is
   * derived at render time from stats that share an identical `sourceNote`.
   * No stat can appear here without the source note it was published with.
   */
  proofLedger?: {
    heading: string;
    intro: string;
  };
  clients?: {
    heading: string;
    disclosure: string;
    logos: Array<{ name: string; src: string }>;
    /**
     * Overrides the big number shown next to the heading, when the real
     * roster this team has worked with is larger than the set of logos held
     * as approved assets for this grid. Falls back to `logos.length` when
     * unset, so the count still tells the truth by default.
     */
    countLabel?: string;
  };
  team?: {
    heading: string;
    intro: string;
    members: TeamMember[];
    quotes: LeaderQuote[];
    /**
     * Framing for the founder/president block that renders `quotes`. Headings
     * only: the quotes themselves are the real, attributed content.
     */
    leadership?: {
      heading: string;
      intro: string;
    };
    /**
     * Heads of service (Content Head, SEO Head, and so on).
     *
     * `members` is the ONLY place a real, named service head may appear, and
     * it is intentionally empty until such a person exists. `roles` carries
     * seat titles and scope with no names attached, so the block can state
     * which service lines have a head without inventing anybody to fill them.
     * When `members` is empty the section renders the roles-and-hiring state
     * instead. See education.ts for the TODO marking exactly where real
     * names, photos, and bios go.
     */
    serviceLeadership?: {
      heading: string;
      intro: string;
      members: TeamMember[];
      roles: ServiceLeadershipRole[];
      note: string;
      ctaLabel: string;
      ctaHref: string;
    };
  };
  testimonials?: ClientTestimonial[];
  /**
   * Interactive asset-type selector: reveals which items from
   * `capabilityGroups[].items` and `modernServices.items` apply to a given
   * asset type, by matching `capabilityRefs` strings against those items'
   * `title` fields exactly. No new claims or descriptions are introduced, * this only curates which already-approved capabilities apply to which
   * asset type, so it carries no `sourceNote` requirement (it isn't a stat).
   */
  capabilityExplorer?: {
    heading: string;
    intro: string;
    assetTypes: Array<{
      id: string;
      label: string;
      description: string;
      /** Must exactly match a `title` in capabilityGroups[].items[] or modernServices.items[]. */
      capabilityRefs: string[];
    }>;
  };
};
