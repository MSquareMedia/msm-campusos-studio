/**
 * The services breakdown, as structured data.
 *
 * Every description here is a plain definition of a standard industry
 * discipline, what the practice *is*, not what it has done for anyone. There
 * are deliberately no stats, no client names, no pricing and no outcome
 * promises attached to any entry, because none of that is sourced.
 *
 * FOUR LEVELS.
 *   1. solution, the five solution lines the site navigation is built on
 *   2. service, the fourteen disciplines (unchanged, the client's own)
 *   3. capability, the standard sub-practices a discipline is made of
 *   4. deliverable, the concrete artefacts and tactics inside a capability
 *
 * Level 1 is NOT a private grouping any more. It is `solutionsNav` from
 * `@/lib/site-config`, imported rather than retyped, so the mesh, the header
 * mega menu and the five /solutions/[slug] pages can never drift
 * apart: one taxonomy, three renderings. Each of the fourteen services is
 * assigned to exactly one solution in `SOLUTION_SERVICES` below, and that
 * mapping is asserted at module load, no service can be dropped, duplicated
 * or invented without the build failing.
 *
 * Where a line arrived as a bundle of acronyms ("AIO/AEO/GEO/GMB/SEO",
 * "Affiliate Marketing/ASO"), it stays a single entry rather than being
 * silently split into services nobody asked for.
 *
 * Levels 3 and 4 are ordinary industry taxonomy: "technical SEO contains
 * Core Web Vitals work" is a description of the discipline, in the same way
 * that "a kitchen contains a hob" describes a kitchen. Nothing at any level
 * asserts a result, a client, a price or a promise, and nothing here should
 * ever be edited to.
 */

import { solutionsNav, type SolutionSlug } from "@/lib/site-config";

export type Deliverable = {
  id: string;
  name: string;
  /** One short factual clause describing the artefact or tactic. */
  description: string;
};

export type Capability = {
  id: string;
  name: string;
  /** One factual line describing what the sub-practice covers. */
  description: string;
  deliverables: Deliverable[];
};

export type Service = {
  /** Stable id. Doubles as the stored value in the assessment flow. */
  id: string;
  name: string;
  /** One factual line describing what the discipline is. */
  description: string;
  /** The standard sub-practices the discipline breaks into. */
  capabilities?: Capability[];
};

/**
 * A level-1 node: one of the five solution lines, plus the services under it.
 * `id` is the solution slug, so a mesh node id and a route segment are the
 * same string and the two can be reasoned about together.
 */
export type ServiceCluster = {
  id: SolutionSlug;
  /** The label the header mega menu uses, verbatim. */
  label: string;
  /** The solution page this group links through to. */
  href: string;
  /** One factual line describing what the group holds. */
  description?: string;
  services: Service[];
};

/**
 * The fourteen disciplines, in one flat catalogue.
 *
 * They live here rather than inline inside the groups so that regrouping them
 * is a change to `SOLUTION_SERVICES`, a list of ids, and never a copy-paste
 * of several hundred lines of taxonomy.
 */
const serviceCatalogue: Service[] = [
  {
    id: "seo",
    name: "SEO",
    description:
      "Search engine optimisation: improving a site's technical health, content and authority so it ranks in organic search results.",
    capabilities: [
      {
        id: "seo-technical",
        name: "Technical SEO",
        description:
          "The machine-readable side: whether a search engine can reach, render, understand and index the pages at all.",
        deliverables: [
          {
            id: "seo-technical-crawl",
            name: "Crawl & indexation",
            description:
              "Robots rules, sitemaps, canonicals and status codes that decide which URLs get indexed.",
          },
          {
            id: "seo-technical-cwv",
            name: "Core Web Vitals",
            description:
              "Google's loading, interaction and layout-stability field metrics: LCP, INP and CLS.",
          },
          {
            id: "seo-technical-schema",
            name: "Schema markup",
            description:
              "Structured data that labels page entities in a format search engines parse directly.",
          },
        ],
      },
      {
        id: "seo-onpage",
        name: "On-page SEO",
        description:
          "What each page is about and how clearly it says so, from the query it answers to how it is titled and linked.",
        deliverables: [
          {
            id: "seo-onpage-intent",
            name: "Keyword & intent mapping",
            description:
              "Matching each target query to the one page meant to answer it.",
          },
          {
            id: "seo-onpage-meta",
            name: "Titles, meta & headings",
            description:
              "Title tags, meta descriptions and heading hierarchy for each indexed page.",
          },
          {
            id: "seo-onpage-internal",
            name: "Internal linking",
            description:
              "The link paths between pages that distribute authority and signal topic structure.",
          },
        ],
      },
      {
        id: "seo-offpage",
        name: "Off-page & authority",
        description:
          "Signals that originate outside the site: who links to it, who mentions it, and in what context.",
        deliverables: [
          {
            id: "seo-offpage-audit",
            name: "Backlink profile audit",
            description:
              "Reviewing the existing inbound link set for relevance, quality and risk.",
          },
          {
            id: "seo-offpage-acquisition",
            name: "Link acquisition",
            description:
              "Earning editorial links from relevant third-party sites and publications.",
          },
          {
            id: "seo-offpage-entity",
            name: "Entity & brand signals",
            description:
              "Consistent naming, profiles and citations that define the brand as a known entity.",
          },
        ],
      },
      {
        id: "seo-local",
        name: "Local SEO",
        description:
          "Ranking in the map pack and in place-qualified searches for each physical or served location.",
        deliverables: [
          {
            id: "seo-local-gbp",
            name: "Google Business Profile",
            description:
              "The listing itself: categories, hours, services, photos and Q&A.",
          },
          {
            id: "seo-local-citations",
            name: "NAP citations",
            description:
              "Name, address and phone consistency across directories and aggregators.",
          },
          {
            id: "seo-local-pages",
            name: "Location landing pages",
            description:
              "One indexable page per location or service area, with its own local detail.",
          },
        ],
      },
    ],
  },
  {
    id: "smo",
    name: "SMO",
    description:
      "Social media optimisation: tuning profiles, posting structure and creative so organic social content is found and shared.",
    capabilities: [
      {
        id: "smo-profile",
        name: "Profile optimisation",
        description:
          "The permanent surface of each account, which is what a first-time visitor actually judges.",
        deliverables: [
          {
            id: "smo-profile-identity",
            name: "Handle & bio consistency",
            description:
              "One name, one handle pattern and one description across platforms.",
          },
          {
            id: "smo-profile-link",
            name: "Link routing",
            description:
              "Where the single profile link points, and what it does with the traffic.",
          },
          {
            id: "smo-profile-pinned",
            name: "Pinned & highlight content",
            description:
              "The fixed posts and highlights that sit above the feed.",
          },
        ],
      },
      {
        id: "smo-format",
        name: "Content formatting",
        description:
          "Shaping each post to the format, ratio and reading behaviour of the platform it is posted to.",
        deliverables: [
          {
            id: "smo-format-ratio",
            name: "Native formats & ratios",
            description:
              "Exporting to each platform's own aspect ratios and safe areas.",
          },
          {
            id: "smo-format-caption",
            name: "Captions & hashtags",
            description:
              "Caption structure, first-line hooks and hashtag or topic tagging.",
          },
          {
            id: "smo-format-cadence",
            name: "Posting cadence",
            description:
              "A publishing calendar with a set rhythm per channel.",
          },
        ],
      },
      {
        id: "smo-community",
        name: "Community engagement",
        description:
          "The two-way half of social: replies, conversations and the audience's own content.",
        deliverables: [
          {
            id: "smo-community-reply",
            name: "Comment & DM response",
            description:
              "Responding in-channel within a defined turnaround.",
          },
          {
            id: "smo-community-ugc",
            name: "UGC resharing",
            description:
              "Surfacing audience-made content with permission and credit.",
          },
          {
            id: "smo-community-groups",
            name: "Groups & communities",
            description:
              "Participation in the forums and groups where the audience already gathers.",
          },
        ],
      },
      {
        id: "smo-listening",
        name: "Social listening",
        description:
          "Monitoring what is being said, by whom, and how that compares to competitors.",
        deliverables: [
          {
            id: "smo-listening-mentions",
            name: "Mention tracking",
            description:
              "Alerts on brand, product and executive mentions across platforms.",
          },
          {
            id: "smo-listening-sov",
            name: "Share of voice",
            description:
              "The brand's proportion of conversation within a defined category.",
          },
          {
            id: "smo-listening-competitor",
            name: "Competitor content review",
            description:
              "Recurring teardown of what rival accounts publish and what lands.",
          },
        ],
      },
    ],
  },
  {
    id: "website",
    name: "Website",
    description:
      "The site itself, end to end: structure, copy and journeys through to the interface design and front-end build that ships it.",
    capabilities: [
      {
        id: "website-ia",
        name: "Information architecture",
        description:
          "How the content is divided, named and ordered, before a single page is designed.",
        deliverables: [
          {
            id: "website-ia-sitemap",
            name: "Sitemap & URL structure",
            description:
              "The full page inventory and the URL pattern it lives under.",
          },
          {
            id: "website-ia-nav",
            name: "Navigation & labelling",
            description:
              "Menu structure and the wording of every navigation label.",
          },
          {
            id: "website-ia-taxonomy",
            name: "Taxonomy & filtering",
            description:
              "Categories, tags and filters used to browse larger content sets.",
          },
        ],
      },
      {
        id: "website-templates",
        name: "Page templates",
        description:
          "The reusable page types a site is assembled from, rather than a set of one-off layouts.",
        deliverables: [
          {
            id: "website-templates-landing",
            name: "Landing template",
            description:
              "A single-purpose page type built around one action.",
          },
          {
            id: "website-templates-article",
            name: "Article template",
            description:
              "The long-form reading layout, including its metadata block.",
          },
          {
            id: "website-templates-service",
            name: "Service & product template",
            description:
              "The repeatable page type describing one offer.",
          },
        ],
      },
      {
        id: "website-conversion",
        name: "Conversion paths",
        description:
          "The route from arriving on a page to completing the thing the page exists for.",
        deliverables: [
          {
            id: "website-conversion-forms",
            name: "Form design",
            description:
              "Field set, validation, error text and submission states.",
          },
          {
            id: "website-conversion-cta",
            name: "Call-to-action placement",
            description:
              "Where the primary action appears and how often it repeats.",
          },
          {
            id: "website-conversion-followup",
            name: "Confirmation & follow-up",
            description:
              "The thank-you state and whatever is sent after it.",
          },
        ],
      },
      {
        id: "website-content",
        name: "Site content",
        description:
          "The words, media and required legal pages that fill the structure.",
        deliverables: [
          {
            id: "website-content-copy",
            name: "Page copy",
            description:
              "Headlines, body copy and microcopy for each template instance.",
          },
          {
            id: "website-content-media",
            name: "Imagery & media",
            description:
              "Photography, illustration and video selected and prepared for the web.",
          },
          {
            id: "website-content-legal",
            name: "Policy pages",
            description:
              "Privacy, cookie, terms and accessibility statements.",
          },
        ],
      },
      {
        id: "web-dd-ux",
        name: "UX & prototyping",
        description:
          "Working out how the thing behaves before deciding what it looks like.",
        deliverables: [
          {
            id: "web-dd-ux-flows",
            name: "User flows",
            description:
              "Step-by-step routes through each key task.",
          },
          {
            id: "web-dd-ux-wireframes",
            name: "Wireframes",
            description:
              "Structure and content priority, without visual styling.",
          },
          {
            id: "web-dd-ux-prototype",
            name: "Prototypes",
            description:
              "Clickable models used to test a flow before build.",
          },
        ],
      },
      {
        id: "web-dd-ui",
        name: "Interface design",
        description:
          "The visual system: the tokens, components and layouts every screen is assembled from.",
        deliverables: [
          {
            id: "web-dd-ui-tokens",
            name: "Design tokens",
            description:
              "Named colour, type, spacing and motion values.",
          },
          {
            id: "web-dd-ui-components",
            name: "Component library",
            description:
              "The reusable interface parts and their states.",
          },
          {
            id: "web-dd-ui-responsive",
            name: "Responsive layouts",
            description:
              "How each screen reflows across viewport sizes.",
          },
        ],
      },
      {
        id: "web-dd-build",
        name: "Front-end build",
        description:
          "Turning the design into shipped markup, styles and behaviour that hold up under real conditions.",
        deliverables: [
          {
            id: "web-dd-build-markup",
            name: "Semantic markup",
            description:
              "HTML that describes what each element is, not just how it looks.",
          },
          {
            id: "web-dd-build-perf",
            name: "Performance budgets",
            description:
              "Agreed limits on payload, requests and render timing.",
          },
          {
            id: "web-dd-build-a11y",
            name: "Accessibility conformance",
            description:
              "Keyboard operation, contrast and assistive-technology support against WCAG.",
          },
        ],
      },
      {
        id: "web-dd-launch",
        name: "Launch & maintenance",
        description:
          "Getting it live without losing anything, and keeping it working afterwards.",
        deliverables: [
          {
            id: "web-dd-launch-qa",
            name: "QA & cross-browser testing",
            description:
              "Verification across the supported browser and device set.",
          },
          {
            id: "web-dd-launch-redirects",
            name: "Redirect mapping",
            description:
              "Old URL to new URL rules applied at cutover.",
          },
          {
            id: "web-dd-launch-updates",
            name: "Dependency updates",
            description:
              "Scheduled framework, plugin and security patching.",
          },
        ],
      },
    ],
  },
  {
    id: "ppc",
    name: "PPC",
    description:
      "Pay-per-click advertising: bidding for auction-based placements on search, shopping and display, paying per click rather than per impression.",
    capabilities: [
      {
        id: "ppc-structure",
        name: "Account structure",
        description:
          "How campaigns, ad groups and keywords are divided, which determines what can be controlled separately.",
        deliverables: [
          {
            id: "ppc-structure-campaigns",
            name: "Campaign & ad group split",
            description:
              "Segmentation by intent, geography, product line or budget.",
          },
          {
            id: "ppc-structure-match",
            name: "Keyword match types",
            description:
              "Broad, phrase and exact coverage per term.",
          },
          {
            id: "ppc-structure-negatives",
            name: "Negative keyword lists",
            description:
              "Shared and campaign-level exclusions that block irrelevant queries.",
          },
        ],
      },
      {
        id: "ppc-bidding",
        name: "Bidding & budget",
        description:
          "What is paid per auction and how spend is distributed across time, place and campaign.",
        deliverables: [
          {
            id: "ppc-bidding-strategy",
            name: "Bid strategy",
            description:
              "Manual, target CPA, target ROAS or maximise-conversions settings.",
          },
          {
            id: "ppc-bidding-pacing",
            name: "Budget pacing",
            description:
              "Daily and monthly spend distribution against the plan.",
          },
          {
            id: "ppc-bidding-modifiers",
            name: "Schedule & geo modifiers",
            description:
              "Dayparting, location targeting and device adjustments.",
          },
        ],
      },
      {
        id: "ppc-creative",
        name: "Ad creative",
        description:
          "The assets shown in the auction result and the page they lead to.",
        deliverables: [
          {
            id: "ppc-creative-rsa",
            name: "Responsive search assets",
            description:
              "Headline and description variants the system combines.",
          },
          {
            id: "ppc-creative-extensions",
            name: "Extensions & assets",
            description:
              "Sitelinks, callouts, structured snippets and images.",
          },
          {
            id: "ppc-creative-landing",
            name: "Landing page match",
            description:
              "Keeping the destination page consistent with the ad's promise.",
          },
        ],
      },
      {
        id: "ppc-measurement",
        name: "Measurement",
        description:
          "How a click is connected to an outcome, and what the auction data says about it.",
        deliverables: [
          {
            id: "ppc-measurement-tracking",
            name: "Conversion tracking",
            description:
              "Tags, imported conversions and offline conversion feeds.",
          },
          {
            id: "ppc-measurement-terms",
            name: "Search terms review",
            description:
              "Recurring review of the actual queries triggering ads.",
          },
          {
            id: "ppc-measurement-auction",
            name: "Auction insights",
            description:
              "Impression share and overlap against competing advertisers.",
          },
        ],
      },
    ],
  },
  {
    id: "content-creation",
    name: "Content Creation",
    description:
      "Producing the raw assets a campaign runs on: copy, photography, video, motion and design.",
    capabilities: [
      {
        id: "content-creation-copy",
        name: "Copywriting",
        description:
          "Written assets, from long-form articles down to a single button label.",
        deliverables: [
          {
            id: "content-creation-copy-long",
            name: "Long-form writing",
            description:
              "Articles, guides, whitepapers and case write-ups.",
          },
          {
            id: "content-creation-copy-short",
            name: "Short-form copy",
            description:
              "Ad copy, captions, subject lines and microcopy.",
          },
          {
            id: "content-creation-copy-script",
            name: "Scripts",
            description:
              "Video scripts, voiceover and presenter notes.",
          },
        ],
      },
      {
        id: "content-creation-photo",
        name: "Photography",
        description:
          "Original stills, shot and prepared for the channels they will run on.",
        deliverables: [
          {
            id: "content-creation-photo-product",
            name: "Product & still life",
            description:
              "Controlled studio capture of objects and packaging.",
          },
          {
            id: "content-creation-photo-location",
            name: "On-location shoots",
            description:
              "Environmental, people and premises photography.",
          },
          {
            id: "content-creation-photo-retouch",
            name: "Retouching & prep",
            description:
              "Colour, clean-up, cropping and export to channel specs.",
          },
        ],
      },
      {
        id: "content-creation-video",
        name: "Video & motion",
        description:
          "Moving-image production from the plan through to the finished cut.",
        deliverables: [
          {
            id: "content-creation-video-story",
            name: "Storyboarding",
            description:
              "Shot lists and boards agreed before anything is filmed.",
          },
          {
            id: "content-creation-video-edit",
            name: "Filming & editing",
            description:
              "Capture, assembly, colour and sound.",
          },
          {
            id: "content-creation-video-motion",
            name: "Motion graphics",
            description:
              "Titles, lower thirds, animated type and transitions.",
          },
        ],
      },
      {
        id: "content-creation-design",
        name: "Design",
        description:
          "The visual system the assets are made within, and the files they ship as.",
        deliverables: [
          {
            id: "content-creation-design-layout",
            name: "Layout & composition",
            description:
              "Grid, hierarchy and typography per asset.",
          },
          {
            id: "content-creation-design-system",
            name: "Brand asset system",
            description:
              "Reusable templates, palettes and type styles.",
          },
          {
            id: "content-creation-design-export",
            name: "Format & export specs",
            description:
              "Sizes, file types and compression per placement.",
          },
        ],
      },
    ],
  },
  {
    id: "content-marketing",
    name: "Content Marketing",
    description:
      "Planning, publishing and distributing content against a demand goal, then measuring what it moved.",
    capabilities: [
      {
        id: "content-marketing-strategy",
        name: "Strategy & planning",
        description:
          "Deciding what to publish, for whom, and in what order, before production starts.",
        deliverables: [
          {
            id: "content-marketing-strategy-research",
            name: "Audience & topic research",
            description:
              "Identifying the questions the audience actually asks.",
          },
          {
            id: "content-marketing-strategy-pillars",
            name: "Content pillars",
            description:
              "The small set of themes everything published sits under.",
          },
          {
            id: "content-marketing-strategy-calendar",
            name: "Editorial calendar",
            description:
              "A dated plan of what publishes where.",
          },
        ],
      },
      {
        id: "content-marketing-production",
        name: "Production workflow",
        description:
          "The route a piece takes from brief to live, and who signs off at each stage.",
        deliverables: [
          {
            id: "content-marketing-production-brief",
            name: "Briefing",
            description:
              "A written brief per piece: audience, angle, sources and format.",
          },
          {
            id: "content-marketing-production-edit",
            name: "Editing & review",
            description:
              "Substantive edit, copy edit and factual check.",
          },
          {
            id: "content-marketing-production-publish",
            name: "Publishing & QA",
            description:
              "Upload, metadata, links and pre-live checks.",
          },
        ],
      },
      {
        id: "content-marketing-distribution",
        name: "Distribution",
        description:
          "Getting a published piece in front of people, which is separate work from making it.",
        deliverables: [
          {
            id: "content-marketing-distribution-owned",
            name: "Owned channels",
            description:
              "Site placement, social posting and internal amplification.",
          },
          {
            id: "content-marketing-distribution-email",
            name: "Email & newsletter",
            description:
              "Sending to a subscribed list on a set schedule.",
          },
          {
            id: "content-marketing-distribution-repurpose",
            name: "Repurposing & syndication",
            description:
              "Reformatting one piece for other channels and partners.",
          },
        ],
      },
      {
        id: "content-marketing-performance",
        name: "Performance & upkeep",
        description:
          "What the published library is doing now, and what needs revisiting.",
        deliverables: [
          {
            id: "content-marketing-performance-reporting",
            name: "Traffic & engagement reporting",
            description:
              "Per-piece and per-pillar performance over time.",
          },
          {
            id: "content-marketing-performance-assisted",
            name: "Assisted conversions",
            description:
              "Content's role in journeys that convert somewhere else.",
          },
          {
            id: "content-marketing-performance-refresh",
            name: "Content refresh cycle",
            description:
              "Scheduled updating or retiring of ageing pages.",
          },
        ],
      },
    ],
  },
  {
    id: "podcasts",
    name: "Podcasts",
    description:
      "Owned audio as a channel: producing an episodic show and getting it in front of an audience, not just recording one.",
    capabilities: [
      {
        id: "podcasts-format",
        name: "Format & production",
        description:
          "Deciding what the show actually is before booking a single guest.",
        deliverables: [
          {
            id: "podcasts-format-concept",
            name: "Show concept & format",
            description:
              "Length, cadence, host structure, and the audience it is for.",
          },
          {
            id: "podcasts-format-recording",
            name: "Recording & editing",
            description:
              "Audio and video capture, edit, and mix to a consistent standard.",
          },
          {
            id: "podcasts-format-guests",
            name: "Guest sourcing & prep",
            description:
              "Finding, briefing and scheduling people worth the audience's time.",
          },
        ],
      },
      {
        id: "podcasts-distribution",
        name: "Distribution",
        description:
          "Getting a recorded episode onto the platforms an audience actually listens on.",
        deliverables: [
          {
            id: "podcasts-distribution-platforms",
            name: "Platform syndication",
            description:
              "Spotify, Apple Podcasts, YouTube and the RSS feed underneath them.",
          },
          {
            id: "podcasts-distribution-clips",
            name: "Clip cutting for social",
            description:
              "Short vertical cuts built from the full episode for social feeds.",
          },
          {
            id: "podcasts-distribution-shownotes",
            name: "Show notes & transcripts",
            description:
              "Written companion content for search and accessibility.",
          },
        ],
      },
      {
        id: "podcasts-performance",
        name: "Performance & growth",
        description:
          "Whether the show is actually being heard, and by whom.",
        deliverables: [
          {
            id: "podcasts-performance-analytics",
            name: "Listener analytics",
            description:
              "Downloads, completion rate and platform-level breakdown.",
          },
          {
            id: "podcasts-performance-promo",
            name: "Episode promotion",
            description:
              "Paid and organic push behind each release.",
          },
          {
            id: "podcasts-performance-sponsorship",
            name: "Sponsorship & partnerships",
            description:
              "Structuring a slot for a partner without it reading as an ad.",
          },
        ],
      },
    ],
  },
  {
    id: "orm",
    name: "ORM",
    description:
      "Online reputation management: monitoring what is published, reviewed and said about a brand, and responding to it.",
    capabilities: [
      {
        id: "orm-monitoring",
        name: "Monitoring",
        description:
          "Knowing what has been said, where, and how negative or positive it reads.",
        deliverables: [
          {
            id: "orm-monitoring-alerts",
            name: "Mention alerts",
            description:
              "Standing alerts on brand, product and named-person mentions.",
          },
          {
            id: "orm-monitoring-reviews",
            name: "Review platform tracking",
            description:
              "Watching the specific review sites that matter to the sector.",
          },
          {
            id: "orm-monitoring-sentiment",
            name: "Sentiment classification",
            description:
              "Sorting mentions by tone so volume alone does not mislead.",
          },
        ],
      },
      {
        id: "orm-reviews",
        name: "Review management",
        description:
          "The operational side of reviews: replying to them, asking for them, and staying inside platform rules.",
        deliverables: [
          {
            id: "orm-reviews-response",
            name: "Review response",
            description:
              "Written replies to public reviews within a set turnaround.",
          },
          {
            id: "orm-reviews-generation",
            name: "Review requests",
            description:
              "Prompting genuine customers to leave a review after service.",
          },
          {
            id: "orm-reviews-policy",
            name: "Platform policy compliance",
            description:
              "Keeping requests and responses within each platform's rules.",
          },
        ],
      },
      {
        id: "orm-serp",
        name: "Search result shaping",
        description:
          "What appears on the first page of results for the brand's own name.",
        deliverables: [
          {
            id: "orm-serp-owned",
            name: "Owned property ranking",
            description:
              "Making sure the brand's own pages rank for its own name.",
          },
          {
            id: "orm-serp-profiles",
            name: "Third-party profiles",
            description:
              "Completing and maintaining directory and network profiles.",
          },
          {
            id: "orm-serp-publishing",
            name: "Supporting publication",
            description:
              "Publishing accurate material that legitimately occupies brand-name results.",
          },
        ],
      },
      {
        id: "orm-crisis",
        name: "Crisis response",
        description:
          "The pre-agreed procedure for the day something goes wrong in public.",
        deliverables: [
          {
            id: "orm-crisis-escalation",
            name: "Escalation protocol",
            description:
              "Who is told, in what order, within what window.",
          },
          {
            id: "orm-crisis-statements",
            name: "Holding statements",
            description:
              "Pre-approved wording to publish while facts are confirmed.",
          },
          {
            id: "orm-crisis-review",
            name: "Post-incident review",
            description:
              "A written account of what happened and what changes.",
          },
        ],
      },
    ],
  },
  {
    id: "digital-pr",
    name: "Digital PR",
    description:
      "Earning coverage, mentions and links from publications, journalists and editorial sites online.",
    capabilities: [
      {
        id: "digital-pr-story",
        name: "Story development",
        description:
          "Finding the angle a journalist would actually run, which is rarely the announcement a brand wants to make.",
        deliverables: [
          {
            id: "digital-pr-story-angle",
            name: "News angle definition",
            description:
              "The specific claim or hook a story is built on.",
          },
          {
            id: "digital-pr-story-data",
            name: "Data & survey stories",
            description:
              "Original research designed to be citable.",
          },
          {
            id: "digital-pr-story-comment",
            name: "Expert commentary",
            description:
              "Named spokespeople reacting to live news in their field.",
          },
        ],
      },
      {
        id: "digital-pr-relations",
        name: "Media relations",
        description:
          "The contact side: who is approached, how, and on what terms.",
        deliverables: [
          {
            id: "digital-pr-relations-lists",
            name: "Journalist lists",
            description:
              "Targeted contact lists by beat and publication.",
          },
          {
            id: "digital-pr-relations-pitch",
            name: "Pitching",
            description:
              "Individually written approaches to named journalists.",
          },
          {
            id: "digital-pr-relations-embargo",
            name: "Embargoes & exclusives",
            description:
              "Timed or single-outlet release arrangements.",
          },
        ],
      },
      {
        id: "digital-pr-assets",
        name: "Asset production",
        description:
          "The material handed over so an outlet can publish without chasing.",
        deliverables: [
          {
            id: "digital-pr-assets-release",
            name: "Press release",
            description:
              "The written announcement, with quotes and boilerplate.",
          },
          {
            id: "digital-pr-assets-kit",
            name: "Media kit",
            description:
              "Approved imagery, logos, bios and background facts.",
          },
          {
            id: "digital-pr-assets-briefing",
            name: "Spokesperson briefing",
            description:
              "Preparing the named person for interview.",
          },
        ],
      },
      {
        id: "digital-pr-tracking",
        name: "Coverage tracking",
        description:
          "Recording what ran, where, and what it linked to.",
        deliverables: [
          {
            id: "digital-pr-tracking-log",
            name: "Placement log",
            description:
              "A dated record of every published piece.",
          },
          {
            id: "digital-pr-tracking-links",
            name: "Link & mention capture",
            description:
              "Whether coverage carried a link, a mention, or neither.",
          },
          {
            id: "digital-pr-tracking-sov",
            name: "Share of coverage",
            description:
              "The brand's presence relative to named competitors.",
          },
        ],
      },
    ],
  },
  {
    id: "affiliate-aso",
    name: "Affiliate Marketing / ASO",
    description:
      "Partner-led performance channels that pay on result, plus app store optimisation for app discovery and installs.",
    capabilities: [
      {
        id: "affiliate-programme",
        name: "Affiliate programme setup",
        description:
          "The commercial and technical scaffolding a pay-on-result channel needs before a single partner joins.",
        deliverables: [
          {
            id: "affiliate-programme-platform",
            name: "Network & platform",
            description:
              "The network or in-house platform the programme runs on.",
          },
          {
            id: "affiliate-programme-commission",
            name: "Commission structure",
            description:
              "Rates, tiers and qualifying actions.",
          },
          {
            id: "affiliate-programme-attribution",
            name: "Tracking & attribution rules",
            description:
              "Cookie windows, deduplication and last-click policy.",
          },
        ],
      },
      {
        id: "affiliate-partners",
        name: "Partner management",
        description:
          "Recruiting publishers, equipping them, and policing how they promote.",
        deliverables: [
          {
            id: "affiliate-partners-recruit",
            name: "Publisher recruitment",
            description:
              "Identifying and onboarding relevant partners.",
          },
          {
            id: "affiliate-partners-feeds",
            name: "Creative & offer feeds",
            description:
              "Banners, links and product feeds supplied to partners.",
          },
          {
            id: "affiliate-partners-compliance",
            name: "Compliance & brand bidding",
            description:
              "Rules on trademark bidding, coupon behaviour and disclosure.",
          },
        ],
      },
      {
        id: "aso-listing",
        name: "App store listing",
        description:
          "The store page itself, which is both the ranking surface and the conversion surface.",
        deliverables: [
          {
            id: "aso-listing-metadata",
            name: "Title, subtitle & keywords",
            description:
              "The indexed text fields each store ranks against.",
          },
          {
            id: "aso-listing-creative",
            name: "Screenshots & preview video",
            description:
              "The visual set shown in search results and on the listing.",
          },
          {
            id: "aso-listing-localisation",
            name: "Description & localisation",
            description:
              "Long description, translated per store locale.",
          },
        ],
      },
      {
        id: "aso-growth",
        name: "App store growth",
        description:
          "Improving what the listing converts and what the store ranks it for, over time.",
        deliverables: [
          {
            id: "aso-growth-ratings",
            name: "Ratings & reviews",
            description:
              "In-app prompting and public review responses.",
          },
          {
            id: "aso-growth-testing",
            name: "Conversion testing",
            description:
              "Store-native experiments on icon, screenshots and copy.",
          },
          {
            id: "aso-growth-keywords",
            name: "Keyword rank tracking",
            description:
              "Monitoring store search positions per term and locale.",
          },
        ],
      },
    ],
  },
  {
    id: "influencer",
    name: "Influencer Marketing",
    description:
      "Working with creators to reach their audiences on their own channels, under their own voice.",
    capabilities: [
      {
        id: "influencer-sourcing",
        name: "Creator sourcing",
        description:
          "Deciding who to work with, on evidence rather than follower count.",
        deliverables: [
          {
            id: "influencer-sourcing-fit",
            name: "Audience fit screening",
            description:
              "Checking the creator's audience against the target audience.",
          },
          {
            id: "influencer-sourcing-quality",
            name: "Audience quality checks",
            description:
              "Engagement patterns and inauthentic-follower screening.",
          },
          {
            id: "influencer-sourcing-rates",
            name: "Rate benchmarking",
            description:
              "Comparing quoted fees against tier and format norms.",
          },
        ],
      },
      {
        id: "influencer-campaign",
        name: "Campaign design",
        description:
          "The brief, the schedule and how far the brand's control extends into someone else's channel.",
        deliverables: [
          {
            id: "influencer-campaign-brief",
            name: "Brief & creative guardrails",
            description:
              "Required messages, prohibited claims, and creative freedom.",
          },
          {
            id: "influencer-campaign-schedule",
            name: "Deliverables & schedule",
            description:
              "Post count, formats and posting dates.",
          },
          {
            id: "influencer-campaign-amplify",
            name: "Paid amplification",
            description:
              "Running creator content as ads from a whitelisted handle.",
          },
        ],
      },
      {
        id: "influencer-rights",
        name: "Rights & disclosure",
        description:
          "The legal half: what the brand may reuse, for how long, and how the partnership is declared.",
        deliverables: [
          {
            id: "influencer-rights-licence",
            name: "Usage licence terms",
            description:
              "Where and how long brand-side reuse is permitted.",
          },
          {
            id: "influencer-rights-exclusivity",
            name: "Exclusivity windows",
            description:
              "Periods a creator may not work with named competitors.",
          },
          {
            id: "influencer-rights-disclosure",
            name: "Advertising disclosure",
            description:
              "Paid-partnership labelling required by advertising standards.",
          },
        ],
      },
      {
        id: "influencer-measurement",
        name: "Measurement",
        description:
          "Capturing what happened on a channel the brand does not own.",
        deliverables: [
          {
            id: "influencer-measurement-reach",
            name: "Reach & engagement capture",
            description:
              "Creator-supplied and platform-reported delivery figures.",
          },
          {
            id: "influencer-measurement-links",
            name: "Tracked links & codes",
            description:
              "Unique URLs or discount codes per creator.",
          },
          {
            id: "influencer-measurement-report",
            name: "Post-campaign reporting",
            description:
              "A consolidated record of activity and delivery.",
          },
        ],
      },
    ],
  },
  {
    id: "programmatic-ott",
    name: "Programmatic / OTT",
    description:
      "Automated, auction-based media buying across display, online video and streaming TV inventory.",
    capabilities: [
      {
        id: "programmatic-supply",
        name: "Inventory & supply",
        description:
          "Which exchanges, publishers and deals the buying actually runs through.",
        deliverables: [
          {
            id: "programmatic-supply-dsp",
            name: "DSP & exchange selection",
            description:
              "The demand-side platform and the supply it can reach.",
          },
          {
            id: "programmatic-supply-pmp",
            name: "Private marketplace deals",
            description:
              "Negotiated deal IDs with named publishers.",
          },
          {
            id: "programmatic-supply-allowlist",
            name: "Publisher allowlists",
            description:
              "Explicit inclusion and exclusion lists of sites and apps.",
          },
        ],
      },
      {
        id: "programmatic-audience",
        name: "Audience targeting",
        description:
          "Who the impression is bought for, and how often they see it.",
        deliverables: [
          {
            id: "programmatic-audience-first",
            name: "First-party segments",
            description:
              "Audiences built from the advertiser's own data.",
          },
          {
            id: "programmatic-audience-context",
            name: "Contextual targeting",
            description:
              "Buying against page or content subject rather than identity.",
          },
          {
            id: "programmatic-audience-frequency",
            name: "Frequency capping",
            description:
              "Limits on impressions per person per period.",
          },
        ],
      },
      {
        id: "programmatic-creative",
        name: "Creative formats",
        description:
          "The asset set each placement type requires, from a static banner to a CTV spot.",
        deliverables: [
          {
            id: "programmatic-creative-display",
            name: "Display banner sets",
            description:
              "The standard IAB size range per campaign.",
          },
          {
            id: "programmatic-creative-video",
            name: "Online video & CTV",
            description:
              "Pre-roll, mid-roll and connected-TV spot durations.",
          },
          {
            id: "programmatic-creative-dynamic",
            name: "Dynamic creative",
            description:
              "Templated variants assembled per audience or product.",
          },
        ],
      },
      {
        id: "programmatic-verification",
        name: "Brand safety & measurement",
        description:
          "Confirming the impression was real, seen, and next to acceptable content.",
        deliverables: [
          {
            id: "programmatic-verification-fraud",
            name: "Verification & fraud filtering",
            description:
              "Third-party checks on invalid traffic and placement.",
          },
          {
            id: "programmatic-verification-viewability",
            name: "Viewability standards",
            description:
              "Agreed in-view thresholds an impression must meet.",
          },
          {
            id: "programmatic-verification-incrementality",
            name: "Incrementality testing",
            description:
              "Holdout designs that isolate the media's own effect.",
          },
        ],
      },
    ],
  },
  {
    id: "aio-aeo-geo-gmb",
    name: "AIO / AEO / GEO / GMB",
    description:
      "Being findable across every answer surface at once: AI overviews and assistants (AIO, AEO, GEO), and the local Google Business Profile listing (GMB).",
    capabilities: [
      {
        id: "aeo-readiness",
        name: "Answer engine readiness",
        description:
          "Structuring content so a machine can lift a direct answer out of it.",
        deliverables: [
          {
            id: "aeo-readiness-questions",
            name: "Question-led structure",
            description:
              "Headings written as the question a reader asked.",
          },
          {
            id: "aeo-readiness-entities",
            name: "Entity definition",
            description:
              "Naming and marking up the people, places and products involved.",
          },
          {
            id: "aeo-readiness-extractable",
            name: "Extractable answers",
            description:
              "Short, self-contained passages that stand on their own.",
          },
        ],
      },
      {
        id: "geo-visibility",
        name: "Generative engine visibility",
        description:
          "Being the source a generative system cites when it composes an answer.",
        deliverables: [
          {
            id: "geo-visibility-source",
            name: "Citable source content",
            description:
              "Original, attributable material worth referencing.",
          },
          {
            id: "geo-visibility-corroboration",
            name: "Third-party corroboration",
            description:
              "The same facts stated on independent sites.",
          },
          {
            id: "geo-visibility-access",
            name: "AI crawler access rules",
            description:
              "Robots and agent directives that permit or block AI crawlers.",
          },
        ],
      },
      {
        id: "gmb-profile",
        name: "Google Business Profile",
        description:
          "The local listing, which for many searches is the whole result.",
        deliverables: [
          {
            id: "gmb-profile-complete",
            name: "Profile completeness",
            description:
              "Every available field filled and kept current.",
          },
          {
            id: "gmb-profile-categories",
            name: "Categories & service areas",
            description:
              "Primary and secondary categories, plus the area served.",
          },
          {
            id: "gmb-profile-content",
            name: "Posts, photos & Q&A",
            description:
              "The ongoing content the listing supports.",
          },
        ],
      },
      {
        id: "organic-foundations",
        name: "Organic search foundations",
        description:
          "The classic requirements that every newer answer surface still inherits.",
        deliverables: [
          {
            id: "organic-foundations-crawl",
            name: "Crawlability",
            description:
              "Pages reachable and renderable by a crawler.",
          },
          {
            id: "organic-foundations-coverage",
            name: "Topical coverage",
            description:
              "Depth across a subject rather than one page per keyword.",
          },
          {
            id: "organic-foundations-authority",
            name: "Authority signals",
            description:
              "Links, citations and named expertise behind the content.",
          },
        ],
      },
    ],
  },
  {
    id: "agentic-marketing",
    name: "Agentic Marketing",
    description:
      "Marketing work in which autonomous AI agents carry out steps of the workflow, research, drafting, monitoring, reporting, with a human reviewing what they produce.",
    capabilities: [
      {
        id: "agentic-workflow",
        name: "Workflow design",
        description:
          "Deciding which steps an agent may run, and where it must stop and hand back.",
        deliverables: [
          {
            id: "agentic-workflow-decompose",
            name: "Task decomposition",
            description:
              "Breaking a process into steps small enough to delegate.",
          },
          {
            id: "agentic-workflow-handoff",
            name: "Handoff points",
            description:
              "The defined moments work passes to or from a person.",
          },
          {
            id: "agentic-workflow-escalation",
            name: "Escalation rules",
            description:
              "Conditions under which the agent must stop and ask.",
          },
        ],
      },
      {
        id: "agentic-tooling",
        name: "Agent tooling",
        description:
          "What the agent is connected to, what it is told, and what shape its output must take.",
        deliverables: [
          {
            id: "agentic-tooling-sources",
            name: "Data & source connections",
            description:
              "The systems and documents an agent may read.",
          },
          {
            id: "agentic-tooling-instructions",
            name: "Instruction sets",
            description:
              "Written, versioned prompts and operating rules.",
          },
          {
            id: "agentic-tooling-contracts",
            name: "Output contracts",
            description:
              "The required format and fields of what it returns.",
          },
        ],
      },
      {
        id: "agentic-review",
        name: "Human review",
        description:
          "The gates a machine-produced draft passes before anyone outside sees it.",
        deliverables: [
          {
            id: "agentic-review-facts",
            name: "Fact-checking gate",
            description:
              "Verification of every claim against a named source.",
          },
          {
            id: "agentic-review-voice",
            name: "Brand voice approval",
            description:
              "A human check that the wording is the brand's own.",
          },
          {
            id: "agentic-review-authorisation",
            name: "Publish authorisation",
            description:
              "A named person signing off before anything goes live.",
          },
        ],
      },
      {
        id: "agentic-governance",
        name: "Governance",
        description:
          "The record of what the agents did, what they could reach, and what the audience was told.",
        deliverables: [
          {
            id: "agentic-governance-logging",
            name: "Audit logging",
            description:
              "A retained trace of agent actions and inputs.",
          },
          {
            id: "agentic-governance-scope",
            name: "Access scope",
            description:
              "Least-privilege permissions on every connected system.",
          },
          {
            id: "agentic-governance-disclosure",
            name: "AI disclosure",
            description:
              "Stating where AI was involved in producing published work.",
          },
        ],
      },
    ],
  },
  {
    id: "market-research",
    name: "Market & Audience Research",
    description:
      "Finding out who the audience actually is and what the competitive field looks like, before a strategy is written.",
    capabilities: [
      {
        id: "market-research-audience",
        name: "Audience research",
        description:
          "Who the buyer is, what they need, and the language they use to describe the problem.",
        deliverables: [
          {
            id: "market-research-audience-personas",
            name: "Audience personas",
            description:
              "Named buyer profiles built from research rather than assumption.",
          },
          {
            id: "market-research-audience-interviews",
            name: "Qualitative interviews",
            description:
              "Structured one-to-one conversations with real prospects or customers.",
          },
          {
            id: "market-research-audience-surveys",
            name: "Quantitative surveys",
            description:
              "Fielded surveys sized to give a statistically usable read.",
          },
        ],
      },
      {
        id: "market-research-competitive",
        name: "Competitive analysis",
        description:
          "Where the field stands today, and where the gaps in it are.",
        deliverables: [
          {
            id: "market-research-competitive-landscape",
            name: "Competitive landscape map",
            description:
              "Every credible competitor, plotted against the dimensions that matter to the buyer.",
          },
          {
            id: "market-research-competitive-pricing",
            name: "Pricing & offer comparison",
            description:
              "What competitors charge for, and what they bundle in.",
          },
          {
            id: "market-research-competitive-messaging",
            name: "Messaging audit",
            description:
              "What every credible competitor is actually claiming, in their own words.",
          },
        ],
      },
      {
        id: "market-research-category",
        name: "Category & cultural intelligence",
        description:
          "The wider conversation the brand is entering, not just its named competitors.",
        deliverables: [
          {
            id: "market-research-category-trends",
            name: "Category trend tracking",
            description:
              "What is rising, falling and staying flat in the category's own conversation.",
          },
          {
            id: "market-research-category-social-listening",
            name: "Social listening",
            description:
              "Unprompted conversation about the category, tracked and coded by theme.",
          },
          {
            id: "market-research-category-whitespace",
            name: "Whitespace identification",
            description:
              "Territory nobody credible currently owns.",
          },
        ],
      },
      {
        id: "market-research-validation",
        name: "Concept validation",
        description:
          "Testing a direction against real people before committing budget to it.",
        deliverables: [
          {
            id: "market-research-validation-concept-test",
            name: "Concept testing",
            description:
              "Reactions to a proposition or creative territory, gathered before production.",
          },
          {
            id: "market-research-validation-pricing-test",
            name: "Pricing sensitivity testing",
            description:
              "What the market will actually bear, tested rather than guessed.",
          },
          {
            id: "market-research-validation-readout",
            name: "Findings readout",
            description:
              "A decision-ready summary of what the research supports and what it rules out.",
          },
        ],
      },
    ],
  },
  {
    id: "brand-strategy",
    name: "Brand Strategy & Positioning",
    description:
      "The decisions that sit above any single campaign: what the brand stands for, who it is for, and how it plans to grow.",
    capabilities: [
      {
        id: "brand-strategy-positioning",
        name: "Positioning",
        description:
          "The specific space the brand claims in the buyer's mind, relative to the alternatives.",
        deliverables: [
          {
            id: "brand-strategy-positioning-statement",
            name: "Positioning statement",
            description:
              "The one-paragraph claim every other message has to agree with.",
          },
          {
            id: "brand-strategy-positioning-pillars",
            name: "Value proposition pillars",
            description:
              "The three or four reasons to believe that support the positioning.",
          },
          {
            id: "brand-strategy-positioning-architecture",
            name: "Brand & portfolio architecture",
            description:
              "How a master brand, sub-brands and product names relate to each other.",
          },
        ],
      },
      {
        id: "brand-strategy-journey",
        name: "Customer journey design",
        description:
          "The path a buyer actually takes, mapped stage by stage against what the brand does at each one.",
        deliverables: [
          {
            id: "brand-strategy-journey-mapping",
            name: "Journey mapping",
            description:
              "Every stage from first awareness to renewal, with the buyer's questions at each one.",
          },
          {
            id: "brand-strategy-journey-touchpoints",
            name: "Touchpoint audit",
            description:
              "Every channel and asset a buyer encounters, checked against the journey it is meant to serve.",
          },
          {
            id: "brand-strategy-journey-gaps",
            name: "Gap identification",
            description:
              "The stages where the journey currently breaks down or falls silent.",
          },
        ],
      },
      {
        id: "brand-strategy-gtm",
        name: "Go-to-market planning",
        description:
          "The sequenced plan for taking a brand, product or market entry live.",
        deliverables: [
          {
            id: "brand-strategy-gtm-plan",
            name: "Go-to-market plan",
            description:
              "Sequencing, channel mix and milestones for a launch or market entry.",
          },
          {
            id: "brand-strategy-gtm-segmentation",
            name: "Market segmentation",
            description:
              "Which segments are worth pursuing first, and why.",
          },
          {
            id: "brand-strategy-gtm-budget",
            name: "Budget allocation planning",
            description:
              "How planned spend divides across channels against the plan's own priorities.",
          },
        ],
      },
      {
        id: "brand-strategy-voice",
        name: "Brand voice & guidelines",
        description:
          "How the brand sounds, so it is recognisable regardless of who is writing.",
        deliverables: [
          {
            id: "brand-strategy-voice-tone",
            name: "Tone of voice guide",
            description:
              "Vocabulary, rhythm and register, with examples of what to avoid.",
          },
          {
            id: "brand-strategy-voice-messaging-house",
            name: "Messaging house",
            description:
              "The master set of approved claims every channel draws from.",
          },
          {
            id: "brand-strategy-voice-visual-brief",
            name: "Visual identity brief",
            description:
              "The written brief a design team works from to build or refresh the identity system.",
          },
        ],
      },
    ],
  },
  {
    id: "cro",
    name: "Conversion Rate Optimization",
    description:
      "Improving what already gets traffic: testing, measuring and fixing the points where visitors leave without converting.",
    capabilities: [
      {
        id: "cro-research",
        name: "Conversion research",
        description:
          "Finding out where and why visitors are dropping off, before changing anything.",
        deliverables: [
          {
            id: "cro-research-funnel",
            name: "Funnel analysis",
            description:
              "Step-by-step drop-off rates through the actual conversion path.",
          },
          {
            id: "cro-research-heatmaps",
            name: "Heatmaps & session recordings",
            description:
              "Where visitors click, scroll and hesitate, watched rather than assumed.",
          },
          {
            id: "cro-research-usability",
            name: "Usability testing",
            description:
              "Real people attempting the task, observed and debriefed.",
          },
        ],
      },
      {
        id: "cro-hypotheses",
        name: "Test design",
        description:
          "Turning a research finding into a specific, measurable change worth testing.",
        deliverables: [
          {
            id: "cro-hypotheses-prioritization",
            name: "Hypothesis prioritization",
            description:
              "Ranking candidate tests by expected impact against effort to build.",
          },
          {
            id: "cro-hypotheses-ab",
            name: "A/B & multivariate test design",
            description:
              "Variant structure and sample-size planning for a statistically valid result.",
          },
          {
            id: "cro-hypotheses-personalization",
            name: "Personalization rules",
            description:
              "Which segment sees which variant, and on what signal.",
          },
        ],
      },
      {
        id: "cro-execution",
        name: "Test execution",
        description:
          "Running the test cleanly enough that the result can be trusted.",
        deliverables: [
          {
            id: "cro-execution-qa",
            name: "Test QA",
            description:
              "Confirming every variant renders and tracks correctly before traffic hits it.",
          },
          {
            id: "cro-execution-monitoring",
            name: "Live monitoring",
            description:
              "Watching a running test for tracking errors or an early, misleading swing.",
          },
          {
            id: "cro-execution-significance",
            name: "Statistical significance checks",
            description:
              "Confirming a result before it is called, not the first time it looks good.",
          },
        ],
      },
      {
        id: "cro-rollout",
        name: "Rollout & iteration",
        description:
          "What happens to a winning test, and what gets tried next.",
        deliverables: [
          {
            id: "cro-rollout-implementation",
            name: "Winner implementation",
            description:
              "Shipping the winning variant as the new default.",
          },
          {
            id: "cro-rollout-documentation",
            name: "Test log & documentation",
            description:
              "A running record of every test, its result and what it implies.",
          },
          {
            id: "cro-rollout-roadmap",
            name: "Next-test roadmap",
            description:
              "What the next test is, based on what the last one showed.",
          },
        ],
      },
    ],
  },
  {
    id: "marketing-automation-crm",
    name: "Marketing Automation & CRM",
    description:
      "The systems that keep a lead or customer moving without someone manually pushing them at every step.",
    capabilities: [
      {
        id: "automation-journeys",
        name: "Lifecycle journeys",
        description:
          "Trigger-based sequences that respond to what a lead or customer actually does.",
        deliverables: [
          {
            id: "automation-journeys-nurture",
            name: "Nurture sequences",
            description:
              "Staged email or message flows that move a lead from interest toward a decision.",
          },
          {
            id: "automation-journeys-onboarding",
            name: "Onboarding flows",
            description:
              "The automated sequence a new customer moves through after signing up.",
          },
          {
            id: "automation-journeys-reengagement",
            name: "Re-engagement flows",
            description:
              "Automated sequences aimed at contacts who have gone quiet.",
          },
        ],
      },
      {
        id: "automation-lead-management",
        name: "Lead management",
        description:
          "Getting the right lead to the right owner at the right moment.",
        deliverables: [
          {
            id: "automation-lead-scoring",
            name: "Lead scoring",
            description:
              "A weighted model ranking leads by fit and intent.",
          },
          {
            id: "automation-lead-routing",
            name: "Lead routing rules",
            description:
              "Automated assignment of a qualified lead to the correct owner or queue.",
          },
          {
            id: "automation-lead-sla",
            name: "Response-time SLAs",
            description:
              "Agreed and monitored response windows for a new qualified lead.",
          },
        ],
      },
      {
        id: "automation-crm-hygiene",
        name: "CRM architecture & hygiene",
        description:
          "The underlying record system every automation and report depends on being accurate.",
        deliverables: [
          {
            id: "automation-crm-fields",
            name: "Field & pipeline design",
            description:
              "The custom fields and pipeline stages a sales or admissions process actually needs.",
          },
          {
            id: "automation-crm-dedupe",
            name: "Deduplication & data hygiene",
            description:
              "Merge rules and scheduled cleanup that keep one record per real contact.",
          },
          {
            id: "automation-crm-integrations",
            name: "Integrations",
            description:
              "Connections between the CRM and the forms, ad platforms and site that feed it.",
          },
        ],
      },
      {
        id: "automation-conversational",
        name: "Conversational qualification",
        description:
          "AI-assisted chat and messaging that qualifies a lead before a human joins the conversation.",
        deliverables: [
          {
            id: "automation-conversational-chat",
            name: "Chat qualification flows",
            description:
              "Scripted or AI-assisted chat that captures intent and qualifying detail.",
          },
          {
            id: "automation-conversational-handoff",
            name: "Human handoff rules",
            description:
              "The point at which a conversation escalates from automated to human.",
          },
          {
            id: "automation-conversational-consent",
            name: "Consented personalization",
            description:
              "Personalization rules that only activate on data the visitor has actually consented to.",
          },
        ],
      },
    ],
  },
  {
    id: "analytics-measurement",
    name: "Analytics & Measurement",
    description:
      "Turning activity across every channel into one trustworthy, decision-ready view of what is actually working.",
    capabilities: [
      {
        id: "analytics-planning",
        name: "Measurement planning",
        description:
          "Deciding what to measure and why, before a single dashboard is built.",
        deliverables: [
          {
            id: "analytics-planning-kpi",
            name: "KPI framework",
            description:
              "The specific metrics that count as success, agreed before the campaign runs.",
          },
          {
            id: "analytics-planning-tracking-plan",
            name: "Tracking plan",
            description:
              "The full inventory of events and properties a site or app needs to capture.",
          },
          {
            id: "analytics-planning-taxonomy",
            name: "Naming taxonomy",
            description:
              "Consistent campaign and channel naming so data rolls up cleanly.",
          },
        ],
      },
      {
        id: "analytics-implementation",
        name: "Implementation & dashboards",
        description:
          "Getting the tracking actually installed correctly, and the data somewhere readable.",
        deliverables: [
          {
            id: "analytics-implementation-ga4",
            name: "Analytics implementation",
            description:
              "GA4 or equivalent platform setup, events and conversions configured against the tracking plan.",
          },
          {
            id: "analytics-implementation-tag-management",
            name: "Tag management",
            description:
              "Server- or client-side tag deployment through a tag manager, audited for accuracy.",
          },
          {
            id: "analytics-implementation-dashboards",
            name: "Reporting dashboards",
            description:
              "Board- and channel-level dashboards built against the agreed KPI framework.",
          },
        ],
      },
      {
        id: "analytics-attribution",
        name: "Attribution & incrementality",
        description:
          "Working out which channels actually drove a result, not just which one was last touched.",
        deliverables: [
          {
            id: "analytics-attribution-modeling",
            name: "Attribution modelling",
            description:
              "Multi-touch attribution set up to reflect the real path to conversion.",
          },
          {
            id: "analytics-attribution-first-party",
            name: "First-party data strategy",
            description:
              "Collecting and activating data the business owns as third-party signal degrades.",
          },
          {
            id: "analytics-attribution-incrementality",
            name: "Incrementality testing",
            description:
              "Holdout or geo-based tests isolating the actual lift a channel produces.",
          },
        ],
      },
      {
        id: "analytics-creative-testing",
        name: "Creative testing & optimization",
        description:
          "Using performance data to decide which creative keeps running and which gets replaced.",
        deliverables: [
          {
            id: "analytics-creative-testing-dco",
            name: "Dynamic creative optimization",
            description:
              "Automated creative variant selection driven by live performance signal.",
          },
          {
            id: "analytics-creative-testing-fatigue",
            name: "Creative fatigue monitoring",
            description:
              "Tracking frequency and performance decay so creative is refreshed before it drags results down.",
          },
          {
            id: "analytics-creative-testing-genai-ops",
            name: "Generative AI content operations",
            description:
              "AI-assisted content variation at scale, with a human review step before anything publishes.",
          },
        ],
      },
    ],
  },
];

const serviceById = new Map(serviceCatalogue.map((service) => [service.id, service]));

/**
 * Which solution owns which service.
 *
 * Judgement calls, recorded so they can be argued with rather than guessed at:
 *
 *  - Digital PR sits in Demand & Media and ORM sits in Strategy & Intelligence,
 *    splitting the mega menu's "Public relations & reputation management" along
 *    its natural seam. Digital PR is outbound: story development, journalist
 *    lists, pitching, coverage tracking, it buys attention, like every other
 *    line in Demand & Media. ORM is inbound: monitoring, sentiment
 *    classification, review platforms and a crisis protocol written before the
 *    crisis. That is listening and planning, which is what Strategy &
 *    Intelligence is.
 *  - AIO / AEO / GEO / GMB / SEO sits in Demand & Media because the mega menu
 *    already names it there almost word for word, "SEO, local search &
 *    AI-search visibility". Three of its four capabilities (Google Business
 *    Profile, organic search foundations, answer engine readiness) are search
 *    disciplines; only its AI surface is new, and being found by an assistant
 *    is still being found.
 *  - Agentic Marketing sits in Data, AI & Measurement, matching that group's
 *    "Generative AI content operations, with human review", its capabilities
 *    are workflow design, agent tooling, a human review gate and governance,
 *    which is an operating model, not a media channel.
 *  - SMO sits in Brand & Creative next to Influencer Marketing, under the mega
 *    menu's "Social content & creator partnerships". Its social-listening
 *    capability leans towards intelligence, but three of its four capabilities
 *    are content and community work.
 *
 * The result is deliberately uneven. Six services under Demand & Media and one
 * each under Strategy & Intelligence and Data, AI & Measurement is what an
 * honest reading of these fourteen disciplines produces; padding the thin
 * groups would mean inventing services, which is not on the table.
 */
const SOLUTION_SERVICES: Record<SolutionSlug, string[]> = {
  "strategy-intelligence": ["market-research", "brand-strategy", "orm"],
  "brand-creative": ["content-creation", "content-marketing", "podcasts", "smo", "influencer"],
  "demand-media": ["seo", "ppc", "programmatic-ott", "affiliate-aso", "digital-pr", "aio-aeo-geo-gmb"],
  "digital-experience": ["website", "cro", "marketing-automation-crm"],
  "data-ai-measurement": ["analytics-measurement", "agentic-marketing"],
};

/** Descriptive one-liners for each group. Descriptive only: they say what the
 *  group holds, and claim nothing about outcomes. */
const SOLUTION_BLURB: Record<SolutionSlug, string> = {
  "strategy-intelligence":
    "The listening and planning layer: knowing what is being said about a brand before deciding what to say back.",
  "brand-creative":
    "What the brand actually publishes, words, pictures, film, social and the creators who carry it.",
  "demand-media":
    "The channels that go and find an audience: organic search, paid search, programmatic, partners and the press.",
  "digital-experience":
    "The destination the rest of it points at, and the paths through it that end in an enquiry.",
  "data-ai-measurement":
    "The measurement and applied-AI layer, including workflows in which software carries out part of the work.",
};

/**
 * The five groups, derived from the header navigation.
 *
 * Order follows `solutionsNav`, so the mesh reads left-to-right in the same
 * order the mega menu does.
 */
export const serviceClusters: ServiceCluster[] = solutionsNav.map((solution) => ({
  id: solution.slug,
  label: solution.label,
  href: solution.href,
  description: SOLUTION_BLURB[solution.slug],
  services: SOLUTION_SERVICES[solution.slug].map((id) => {
    const service = serviceById.get(id);
    if (!service) {
      throw new Error(`services.ts: SOLUTION_SERVICES names "${id}", which is not in serviceCatalogue.`);
    }
    return service;
  }),
}));

/* Every discipline is placed exactly once. This runs at module load, so a
   service that is dropped or double-assigned fails the build rather than
   quietly disappearing from the mesh. */
{
  const assigned = Object.values(SOLUTION_SERVICES).flat();
  if (assigned.length !== serviceCatalogue.length || new Set(assigned).size !== assigned.length) {
    throw new Error(
      `services.ts: expected each of the ${serviceCatalogue.length} services to be assigned to exactly one solution, got ${assigned.length} assignments.`,
    );
  }
}

/** Flat list, group order preserved. Used by the assessment flow. */
export const allServices: Service[] = serviceClusters.flatMap((cluster) => cluster.services);

/** Lookup for turning a stored id back into its display name. */
export const serviceNameById: Record<string, string> = Object.fromEntries(
  allServices.map((service) => [service.id, service.name]),
);

/* -------------------------------------------------------------------------
 * Uniform tree view of the same data.
 *
 * The mesh visualisation needs one node shape it can recurse over, rather
 * than four differently-named types. This is a projection of the arrays
 * above, not a second copy of the content: change the taxonomy in one place
 * and this follows.
 * ---------------------------------------------------------------------- */

export type ServiceTreeNode = {
  id: string;
  name: string;
  description: string;
  /** 1 solution, 2 service, 3 capability, 4 deliverable. */
  depth: 1 | 2 | 3 | 4;
  /** Level 1 only: the solution page this node links through to. */
  href?: string;
  children: ServiceTreeNode[];
};

/** Human-readable name for each depth, used as the panel's eyebrow. */
export const serviceDepthLabel: Record<1 | 2 | 3 | 4, string> = {
  1: "Solution",
  2: "Service",
  3: "Capability",
  4: "Deliverable",
};

export const serviceTree: ServiceTreeNode[] = serviceClusters.map((cluster) => ({
  id: cluster.id,
  name: cluster.label,
  description: cluster.description ?? "",
  href: cluster.href,
  depth: 1,
  children: cluster.services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    depth: 2 as const,
    children: (service.capabilities ?? []).map((capability) => ({
      id: capability.id,
      name: capability.name,
      description: capability.description,
      depth: 3 as const,
      children: capability.deliverables.map((deliverable) => ({
        id: deliverable.id,
        name: deliverable.name,
        description: deliverable.description,
        depth: 4 as const,
        children: [],
      })),
    })),
  })),
}));
