import type { IndustryContent } from "./types";

// PLACEHOLDER TESTIMONIAL CONTENT, replace with real, approved client quotes
// before public launch. Attribution intentionally uses a role only, never a
// fabricated person's name.

export const automotive: IndustryContent = {
  slug: "automotive",
  industryLabel: "Automotive",
  metaTitle: "SOTAPO for Automotive: connected brand, retail, and ownership marketing",
  metaDescription:
    "SOTAPO connects brand desire, live inventory, retail action, and owner loyalty across the complete automotive journey, for OEMs, EV brands, and dealer networks worldwide.",
  hero: {
    eyebrow: "SOTAPO for Automotive",
    headline: "We move buyers closer, long before the showroom.",
    supportingCopy:
      "Brand desire moves up. Time-to-decision moves down. Owners move closer, from first search to renewal, one connected path, not four disconnected teams working the same buyer.",
  },
  story: {
    heading: "One decision. Many signals.",
    intro:
      "A vehicle decision is built long before anyone walks into a showroom. Most of these moments sit with different teams, different vendors, and different data sets. SOTAPO connects them into one path the buyer feels as continuous.",
    moments: [
      {
        label: "01",
        title: "Discovery",
        description:
          "A film, a review, or a social moment plants the first signal of interest, long before intent shows up in any dashboard.",
        image: "/images/automotive/journey/discovery.jpg",
      },
      {
        label: "02",
        title: "Comparison",
        description:
          "Shoppers weigh models, trims, and brands across owned content, review sites, and forums, often on a different device than they started on.",
        image: "/images/automotive/journey/comparison.jpg",
      },
      {
        label: "03",
        title: "Inventory",
        description:
          "Interest becomes specific: a real vehicle, a real market, a real price, checked against what is actually on a lot or in a feed.",
        image: "/images/automotive/journey/inventory.jpg",
      },
      {
        label: "04",
        title: "Finance",
        description:
          "Ownership questions surface: monthly payment, trade-in value, lease terms. This is where hesitation is won or lost.",
        image: "/images/automotive/journey/finance.jpg",
      },
      {
        label: "05",
        title: "Dealer response",
        description:
          "A lead reaches a dealer or distributor. Response time and message quality now matter more than the ad that generated it.",
        image: "/images/automotive/journey/dealer-response.jpg",
      },
      {
        label: "06",
        title: "Test drive",
        description:
          "The vehicle meets the person. What happens in that hour should be informed by everything the buyer already showed interest in.",
        image: "/images/automotive/journey/test-drive.jpg",
      },
      {
        label: "07",
        title: "Delivery",
        description:
          "The handover moment sets the tone for the ownership relationship that follows, and for whether the buyer becomes an advocate.",
        image: "/images/automotive/journey/delivery.jpg",
      },
      {
        label: "08",
        title: "Ownership and renewal",
        description:
          "Service reminders, satisfaction, and the next purchase cycle depend on data collected months or years earlier.",
        image: "/images/automotive/journey/ownership-and-renewal.jpg",
      },
    ],
  },
  pov: {
    heading: "The journey should feel connected.",
    body: [
      "Automotive marketing is organized by department. Brand campaigns in one place, retail media in another, dealer operations somewhere else, CRM and service data locked in a fourth system. The buyer experiences none of those boundaries. They experience one decision.",
      "SOTAPO runs creative, media, inventory feeds, dealer and distributor enablement, CRM, and measurement as a single operating system. Not every brand needs every capability. The mix is chosen for the market, the sales model, and the data actually available, then measured as one connected path.",
    ],
  },
  capabilityGroups: [
    {
      title: "Create demand",
      summary: "Build the brand desire that starts the journey before a search ever happens.",
      items: [
        {
          title: "Brand strategy and positioning",
          description:
            "Category, competitive, and cultural intelligence that defines where a brand or model line should stand.",
        },
        {
          title: "Campaign creative and film",
          description:
            "Integrated creative platforms carried across film, motion, photography, and social content.",
        },
        {
          title: "EV and category education",
          description:
            "Content and campaigns that build understanding for new categories, drivetrains, or ownership models.",
        },
        {
          title: "Media planning and buying",
          description:
            "Connected TV, streaming, digital out-of-home, and programmatic media planned against real audience behavior.",
        },
      ],
    },
    {
      title: "Convert active shoppers",
      summary: "Turn comparison and inventory research into qualified, dealer-ready leads.",
      items: [
        {
          title: "Inventory-aware creative",
          description:
            "Vehicle-feed campaigns and dynamic creative versioned by model, trim, and market where platforms support them.",
        },
        {
          title: "Search and comparison content",
          description:
            "Content and SEO built for the moment a shopper is actively comparing models and trims.",
        },
        {
          title: "Conversational lead qualification",
          description:
            "AI-assisted booking and qualification for test drives and inquiries, with human handoff at the right moment.",
        },
        {
          title: "Landing and configurator experiences",
          description:
            "Digital experiences built around real inventory, financing tools, and booking flows.",
        },
      ],
    },
    {
      title: "Equip markets and dealers",
      summary: "Give distributors, dealers, and sales teams the tools to close well.",
      items: [
        {
          title: "Dealer and distributor enablement",
          description:
            "Sales materials, local campaign kits, and creative versioning built for market and dealer-level execution.",
        },
        {
          title: "Localization and transcreation",
          description:
            "Campaign adaptation for language, market norms, and regional media habits, not literal translation.",
        },
        {
          title: "CRM journey and lead routing",
          description:
            "Nurture journeys and lead routing logic that keep response times fast and messages relevant.",
        },
        {
          title: "Retail and launch events",
          description:
            "Launch moments, showroom activations, and experiential programs planned as part of the same story.",
        },
      ],
    },
    {
      title: "Grow owner value",
      summary: "Extend the relationship past delivery into service, advocacy, and renewal.",
      items: [
        {
          title: "Owner communications",
          description:
            "Service reminders, satisfaction programs, and lifecycle communications built on consented ownership data.",
        },
        {
          title: "Creator and owner advocacy",
          description:
            "Programs that turn genuine owners into a credible voice for the brand, where consent and disclosure are handled properly.",
        },
        {
          title: "Renewal and trade-in journeys",
          description:
            "CRM journeys timed to real ownership cycles, financing terms, and service history.",
        },
        {
          title: "Closed-loop measurement",
          description:
            "Reporting that connects media exposure to lead, test drive, sale, and service where lawful data access allows.",
        },
      ],
    },
  ],
  modernServices: {
    heading: "Built for how vehicles are actually bought now",
    intro:
      "Not every tactic belongs in every plan. SOTAPO selects the right mix based on the brand, the market, the sales model, and the data available.",
    items: [
      {
        title: "Inventory-aware and vehicle-feed campaigns",
        description:
          "Dynamic creative tied to live inventory, in markets and platforms where feed-based vehicle ads are supported.",
      },
      {
        title: "EV and category education",
        description: "Content programs that build category understanding ahead of purchase intent.",
      },
      {
        title: "First-party audience strategy",
        description:
          "Consented data strategy that reduces reliance on third-party signals as they continue to erode.",
      },
      {
        title: "Connected TV, streaming, and retail media",
        description:
          "Video and retail media planned alongside performance channels, not as a separate budget line.",
      },
      {
        title: "Creator and owner advocacy programs",
        description: "Structured partnerships with creators and real owners, with clear disclosure.",
      },
      {
        title: "Dynamic creative versioning",
        description: "Creative variants by model, market, inventory position, and audience segment.",
      },
      {
        title: "Conversational booking and qualification",
        description: "AI-assisted lead qualification with a clear, fast path to a human when it matters.",
      },
      {
        title: "Closed-loop reporting",
        description:
          "Media exposure connected to lead, test drive, sale, service, or renewal where lawful data access allows.",
      },
    ],
  },
  clients: {
    heading: "Brands the team has worked with",
    disclosure:
      "These reflect the body of work SOTAPO's leadership has led over a fourteen-year marketing and communications career, not all exclusively SOTAPO engagements.",
    logos: [
      { name: "BMW", src: "/images/automotive/clients/bmw.png" },
      { name: "NEXA", src: "/images/automotive/clients/nexa.png" },
      { name: "Maruti Suzuki", src: "/images/automotive/clients/maruti.png" },
      { name: "Hero Electric", src: "/images/automotive/clients/hero-electric.png" },
      { name: "Royal Enfield", src: "/images/automotive/clients/royal-enfield.png" },
      { name: "T&T Motors", src: "/images/automotive/clients/t-and-t-motors.png" },
    ],
  },
  // PLACEHOLDER TESTIMONIAL CONTENT, replace with real, approved client
  // quotes before public launch. Attribution intentionally uses a role only,
  // never a fabricated person's name.
  testimonials: [
    {
      quote:
        "Working with this team has always felt like an extension of our own marketing function. They understand the nuance our brand demands and never lose sight of it, even when the pace picks up.",
      rolePlaceholder: "Marketing Director, India",
      clientName: "BMW",
      clientLogo: "/images/automotive/clients/bmw.png",
    },
    {
      quote:
        "What stood out was how quickly the team grasped what NEXA stands for beyond just being a retail format. They brought genuine care to every campaign, and it showed in how our showrooms and our stories came together.",
      rolePlaceholder: "Retail Marketing Head",
      clientName: "NEXA",
      clientLogo: "/images/automotive/clients/nexa.png",
    },
    {
      quote:
        "There's a rare combination of speed and thoughtfulness in how this team operates. They ask the right questions early, which means we spend less time course-correcting later.",
      rolePlaceholder: "Senior Marketing Manager",
      clientName: "Maruti Suzuki",
      clientLogo: "/images/automotive/clients/maruti.png",
    },
    {
      quote:
        "Building an EV brand means constantly explaining something new to people. The team never treated that as a burden. They leaned into it with us and made the category feel approachable rather than intimidating.",
      rolePlaceholder: "Chief Marketing Officer",
      clientName: "Hero Electric",
      clientLogo: "/images/automotive/clients/hero-electric.png",
    },
    {
      quote:
        "Our brand has a strong point of view, and not every partner respects that. This team did, consistently, while still pushing us toward ideas we wouldn't have landed on alone.",
      rolePlaceholder: "Global Brand Director",
      clientName: "Royal Enfield",
      clientLogo: "/images/automotive/clients/royal-enfield.png",
    },
    {
      quote:
        "As a dealer network, we live and die by responsiveness. This team matched our urgency every time, and never made us feel like a smaller priority than the bigger brand campaigns.",
      rolePlaceholder: "Managing Director",
      clientName: "T&T Motors",
      clientLogo: "/images/automotive/clients/t-and-t-motors.png",
    },
  ],
  engagementModel: [
    {
      step: "01",
      title: "Strategy sprint",
      description:
        "A focused engagement to map the buyer journey, audit current marketing and data, and agree the priority opportunity.",
    },
    {
      step: "02",
      title: "Pilot market or model",
      description:
        "Prove the approach in one market, region, or model line before committing to a wider rollout.",
    },
    {
      step: "03",
      title: "Measurement review",
      description:
        "Assess what the pilot actually produced, against agreed KPIs and available data, before scaling spend.",
    },
    {
      step: "04",
      title: "Scale",
      description:
        "Extend what worked across markets and models, with local adaptation built in from the start.",
    },
  ],
  governance: {
    heading: "Central brand control, local market fit",
    body: [
      "One brand platform, built to perform across very different markets, media systems, and dealer structures. Brand and measurement standards stay consistent centrally; creative versioning, media selection, and localization are built for each market's actual conditions.",
      "Emissions claims, safety claims, financing disclosures, and platform policy for inventory-feed ad formats are treated as local legal and platform review requirements, not a single global checklist.",
    ],
    note: "The right channel mix and campaign structure depend on your markets, your data access, and your dealer or distribution model. We build the plan around those specifics.",
  },
  finalCta: {
    heading: "Ready to connect the automotive journey?",
    body: "Tell us about your markets, your models, and where the journey currently breaks apart.",
  },
  assetManifest: [
    {
      fileName: "automotive-hero-loop.mp4",
      page: "Automotive",
      section: "Hero",
      purpose: "Establish the desire-to-decision visual language before any copy is read.",
      aspectDesktop: "16:9 (cropped to 21:9 on ultra-wide)",
      aspectMobile: "4:5",
      minDimensions: "2400x1350",
      shotDescription:
        "Slow-moving close detail of vehicle surface, reflected light, and human hands at a control or door handle.",
      subjects: "Vehicle detail, driver or passenger hands, ambient reflection",
      artDirection: "Graphite, chrome, glass, asphalt tones within the shared MSM palette. No neon or cyberpunk treatment.",
      motionOrCrop: "Slow film loop or 6 to 8 frame image sequence, restrained parallax on scroll.",
      altText: "Close detail of a vehicle surface with reflected light, representing the start of the buying journey.",
      licensingStatus: "Production placeholder pending licensed or client-supplied asset.",
    },
    {
      fileName: "automotive-journey-{01-08}.jpg",
      page: "Automotive",
      section: "Scroll-pinned journey",
      purpose: "Represent each of the eight buyer-journey moments without simulated app UI.",
      aspectDesktop: "4:3",
      aspectMobile: "1:1",
      minDimensions: "1600x1200",
      shotDescription: "Real environments and moments: search at night, dealer lot, finance conversation, test drive, delivery, service bay.",
      subjects: "Buyers, dealer staff, vehicles, real retail and service environments",
      artDirection: "Documentary realism, consistent grade with hero asset.",
      motionOrCrop: "Masked reveal synced to scroll position within the pinned sequence.",
      altText: "Documentary photograph representing one stage of the automotive buying journey.",
      licensingStatus: "Production placeholder pending licensed or client-supplied asset.",
    },
    {
      fileName: "automotive-case-study-hero.jpg",
      page: "Automotive",
      section: "Case studies",
      purpose: "Feature image for the primary case study once approved.",
      aspectDesktop: "3:2",
      aspectMobile: "4:5",
      minDimensions: "1800x1200",
      shotDescription: "To be defined per approved client asset.",
      subjects: "Client-specific",
      artDirection: "Match shared MSM palette and grade.",
      motionOrCrop: "Static, subtle scale on hover.",
      altText: "To be written once the case study is approved.",
      licensingStatus: "Not yet available. Holding state renders until a case study is published.",
    },
  ],
};
