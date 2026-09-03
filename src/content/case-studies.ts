import type { IndustryCaseStudy } from "./types";

/**
 * Case studies render only when status is "published". Until approved client
 * work exists, every record here stays in "draft" and the case-study section
 * falls back to its holding state. Add real records (with source notes for
 * every result) and flip status once a client has approved publication.
 *
 * The automotive and healthcare placeholder entries that used to live here
 * (fabricated content, withheld client names) were removed at the client's
 * direction: every case study on this site now carries a real, named client
 * and real, sourced figures, nothing withheld, nothing invented. Automotive
 * and healthcare will show CaseStudyFeature's empty state until a real,
 * approved engagement from those industries is added here.
 */
export const caseStudies: IndustryCaseStudy[] = [
  /* ---------------------------------------------------------------------
   * Client-supplied education engagements. These lead the array so they are
   * the first case studies shown anywhere the list is rendered in order.
   *
   * Both institutions are unnamed at the client's own framing ("a leading
   * institute", "a prestigious university"), so `approvedClientLabel` carries
   * the description rather than inventing a name to put on it. Figures and
   * narrative are exactly as supplied by the client, nothing rounded,
   * re-based, or embellished.
   * ------------------------------------------------------------------- */
  {
    id: "education-online-offline-institute",
    industry: "education",
    status: "published",
    // Named at the client's direction. Challenge, solution and results below
    // are unchanged from the original engagement write-up.
    approvedClientLabel: "IDP",
    clientType: "Higher education institute, online and on-campus",
    title: "More applications on less spend, without losing lead volume",
    challenge:
      "The client asked us to increase application numbers while reducing spend, holding the existing lead volume steady.",
    idea:
      "Refine audience targeting and optimise creative around high-intent leads, then improve the landing pages and let the data drive the adjustments, so applications rise while spend comes down.",
    scope: [
      "Audience targeting refinement",
      "Creative optimisation toward high-intent segments",
      "Landing page improvement",
      "Data-driven bid and budget adjustment",
    ],
    execution: [
      "Rebuilt audience targeting around intent signals rather than reach",
      "Reworked creative to speak to prospects closer to an application decision",
      "Improved the landing pages the campaigns were sending traffic to",
      "Adjusted continuously against application data rather than lead counts alone",
    ],
    results: [
      {
        value: "28%",
        label: "Drop in cost per application, year on year",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
      {
        value: "32%",
        label: "Drop in spend",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
    ],
    // IDP's own official campaign photography, from idp.com, not a generic
    // campus stock photo.
    heroAsset: {
      src: "/images/education/case-studies/idp-hero.jpg",
      alt: "A student checking her phone, from IDP's own campaign imagery",
      type: "image",
    },
    services: ["Performance media", "Creative optimisation", "Landing page CRO"],
  },
  {
    id: "education-jd-institute",
    industry: "education",
    status: "published",
    approvedClientLabel: "JD Institute",
    clientType: "Fashion and interior design institute, pan-India",
    title: "Cutting cost per lead while applications kept rising",
    challenge:
      "JD Institute needed acquisition costs under control across a pan-India campus network without applications or lead quality slipping as spend tightened.",
    idea:
      "Rebuilt targeting and creative around the applicants most likely to actually enrol, then let two years of application and conversion data continuously refine where budget went.",
    scope: [
      "Audience targeting refinement",
      "Creative optimisation toward high-intent segments",
      "Landing page and funnel improvement",
      "Continuous, data-driven budget reallocation",
    ],
    execution: [
      "Rebuilt targeting around enrolment-intent signals rather than broad reach",
      "Refreshed creative toward the programmes and campuses converting best",
      "Tightened the lead-to-application funnel to cut drop-off",
      "Reallocated spend continuously against two years of running performance data",
    ],
    results: [
      {
        value: "30%",
        label: "Drop in cost per lead (2024–26)",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
      {
        value: "8%",
        label: "Increase in applications (2024–26)",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
      {
        value: "40%",
        label: "Drop in customer acquisition cost (2024–26)",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
    ],
    // JD Institute's own site imagery, not a generic design-studio stock
    // photo.
    heroAsset: {
      src: "/images/education/case-studies/jd-institute-hero.jpg",
      alt: "A fashion design student at work, from JD Institute's own site",
      type: "image",
    },
    services: ["Performance media", "Creative optimisation", "Funnel optimisation"],
  },
  {
    id: "education-rice-education",
    industry: "education",
    status: "published",
    approvedClientLabel: "RICE Education",
    clientType: "Competitive exam coaching, West Bengal",
    title: "Lowering acquisition cost while lead quality climbed",
    challenge:
      "RICE Education needed to bring down what it cost to acquire a new student year over year, without trading away the quality of the leads coming in.",
    idea:
      "Shift spend and creative toward the channels and audiences producing genuinely qualified leads, so cost per acquisition falls because targeting improved, not because volume did.",
    scope: [
      "Audience targeting refinement",
      "Lead qualification criteria alignment",
      "Creative optimisation",
      "Year-over-year budget reallocation",
    ],
    execution: [
      "Realigned targeting around the profiles most likely to qualify, not just enquire",
      "Tightened lead qualification criteria in partnership with the admissions team",
      "Refreshed creative toward higher-intent search and social audiences",
      "Reallocated budget year over year toward what was actually converting",
    ],
    results: [
      {
        value: "25%",
        label: "Drop in customer acquisition cost, year on year (2025–26)",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
      {
        value: "15%",
        label: "Increase in qualified leads, year on year (2025–26)",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
    ],
    // RICE Education's own site imagery, not a generic classroom stock photo.
    heroAsset: {
      src: "/images/education/case-studies/rice-education-hero.jpg",
      alt: "RICE Education's own \"From Aspiration to Achievement\" campaign creative",
      type: "image",
    },
    services: ["Performance media", "Lead qualification", "Creative optimisation"],
  },
  {
    id: "education-adamas-university",
    industry: "education",
    status: "published",
    approvedClientLabel: "Adamas University",
    clientType: "University, undergraduate and postgraduate",
    title: "Applications up, cost per acquisition down, two years running",
    // Supersedes an earlier engagement write-up for the same client (an
    // older reporting period covering an application-to-admission metric).
    // Only the latest figures are published, so Adamas appears once rather
    // than as two separate case studies.
    challenge:
      "Following an earlier engagement, the brief for FY25–26 was to keep lifting application volume while continuing to bring down cost per acquisition year over year.",
    idea:
      "Carry forward the high-intent targeting and funnel work from the previous year, then tune it against a fresh year of admissions data rather than starting the optimisation over.",
    scope: [
      "High-intent audience targeting",
      "Creative refresh",
      "Application funnel optimisation",
      "Cost-per-acquisition optimisation",
    ],
    execution: [
      "Extended the prior year's high-intent targeting model against fresh FY25–26 data",
      "Refreshed creative for the new admissions cycle",
      "Continued funnel tightening from enquiry through to application",
      "Reallocated spend continuously against cost-per-acquisition performance",
    ],
    results: [
      {
        value: "11%",
        label: "Increase in applications, year on year (2025–26)",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
      {
        value: "27%",
        label: "Drop in customer acquisition cost, year on year (2025–26)",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
    ],
    // A second, different real photograph from Adamas University's own site.
    heroAsset: {
      src: "/images/education/case-studies/adamas-university-hero-2.jpg",
      alt: "Adamas University campus building at night",
      type: "image",
    },
    services: ["Performance media", "Creative optimisation", "Funnel optimisation"],
  },
  {
    id: "education-dsu-international",
    industry: "education",
    status: "published",
    approvedClientLabel: "DSU International",
    clientType: "University international admissions",
    title: "More international applications, at half the acquisition cost",
    challenge:
      "DSU International needed to grow its international-student application volume while cutting the cost of acquiring each one, year over year.",
    idea:
      "Refocus targeting on the specific overseas markets and audiences most likely to actually apply, then let a full year of application data keep sharpening where budget went.",
    scope: [
      "International audience targeting",
      "Market-specific creative optimisation",
      "Application funnel improvement",
      "Year-over-year cost-per-acquisition optimisation",
    ],
    execution: [
      "Focused targeting on the overseas markets converting best rather than spreading spend broadly",
      "Localised creative for the highest-intent international audiences",
      "Improved the international application funnel to cut drop-off",
      "Reallocated spend year over year against cost-per-acquisition data",
    ],
    results: [
      {
        value: "7%",
        label: "Increase in applications, year on year (2025–26)",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
      {
        value: "50%",
        label: "Drop in customer acquisition cost, year on year (2025–26)",
        sourceNote: "Figures as supplied by the client for this engagement.",
      },
    ],
    // Dayananda Sagar University's own site imagery, not a generic campus
    // stock photo.
    heroAsset: {
      src: "/images/education/case-studies/dsu-international-hero.jpg",
      alt: "Dayananda Sagar University campus building at night",
      type: "image",
    },
    services: ["Performance media", "International audience targeting", "Funnel optimisation"],
  },
  {
    id: "automotive-nexa-sound-of-blue",
    industry: "automotive",
    status: "published",
    // Delivered by the team's leadership prior to joining MSM CampusOS, at
    // Hakuhodo.Sync, same "before MSM CampusOS" framing as the OMNIYAT
    // entry below. Figures and awards are exactly as published by Hakuhodo
    // at hakuhodo-global.com; copy here is written fresh rather than lifted
    // from that page, since the photography and copy on it are Hakuhodo's.
    clientName: "NEXA",
    approvedClientLabel: "NEXA",
    geography: "India",
    clientType: "Premium automotive retail (Maruti Suzuki)",
    title: "Turning a paint colour into a campaign: The Sound of NEXA Blue",
    challenge:
      "NEXA had created an exclusive colour, NEXA Blue, for its cars but needed it to read as more than a paint option, a symbol of the brand's own claim to innovation, in a market where white still sells the most cars.",
    insight:
      "The brief was to make a colour felt, not just seen, which pointed toward synesthesia, the phenomenon where one sense (hearing a sound) triggers another (seeing a colour).",
    idea:
      "Built the campaign around the question \"Can you hear colour?\", bringing synesthetic musicians together to compose and perform music derived from NEXA Blue itself, an audio-visual experience rather than a conventional colour launch film.",
    scope: [
      "Campaign concept and creative direction",
      "Original music composition with synesthetic musicians",
      "Film production",
      "Digital and social distribution",
    ],
    execution: [
      "Identified and worked with musicians who experience synesthesia to compose music derived from the colour itself",
      "Produced the resulting audio-visual piece as the campaign's centrepiece",
      "Built a dedicated NEXA Blue digital destination around the film",
      "Distributed the campaign to drive both awareness and time spent with the brand",
    ],
    results: [
      {
        value: "33.83%",
        label: "Increase in NEXA Blue car sales",
        sourceNote: "As reported by Hakuhodo.Sync at hakuhodo-global.com/work/sound-of-nexa-blue-case-study.html.",
      },
      {
        value: "40M+",
        label: "Campaign impressions",
        sourceNote: "As reported by Hakuhodo.Sync at hakuhodo-global.com/work/sound-of-nexa-blue-case-study.html.",
      },
      {
        value: "2.26 min",
        label: "Average time on the NEXA Blue site, vs. a 1.15 min baseline",
        sourceNote: "As reported by Hakuhodo.Sync at hakuhodo-global.com/work/sound-of-nexa-blue-case-study.html.",
      },
    ],
    heroAsset: {
      src: "/images/automotive/hero-india.jpg",
      alt: "An SUV on an Indian highway at dusk",
      type: "image",
    },
    services: ["Brand campaign strategy", "Original music & film production", "Digital distribution"],
    disclosure:
      "Delivered by MSM CampusOS's brand and marketing leadership prior to joining MSM CampusOS, at Hakuhodo.Sync. Figures and the 2019 Creative Abby silver award (Branded Content & Entertainment) are as published by Hakuhodo at hakuhodo-global.com/work/sound-of-nexa-blue-case-study.html.",
  },
  {
    id: "real-estate-omniyat",
    industry: "real-estate",
    status: "published",
    clientName: "OMNIYAT",
    approvedClientLabel: "OMNIYAT",
    geography: "Dubai, UAE",
    clientType: "Luxury real estate developer",
    title: "Rebuilding the digital showroom for Dubai's most artistic developer",
    challenge:
      "OMNIYAT has spent twenty years shaping Dubai's skyline with landmarks by Zaha Hadid and Dorchester Collection. Its digital presence had not caught up: the brand needed a website that felt like the buildings it built, not a standard property listing site.",
    insight:
      "OMNIYAT's name translates to 'wishes'. The brand's real differentiator was never the towers themselves, but the philosophy of geometry as the language of the divine behind them.",
    idea:
      "Reimagine the website as an immersive digital showroom: platonic geometric shapes aligned against real architectural photography, short punchy copy in place of standard property prose, and Mozart's 6th Symphony scoring the experience.",
    scope: [
      "Brand positioning and narrative",
      "Logo refinement",
      "Website UX and art direction",
      "Photography and image system",
    ],
    execution: [
      "Rebuilt the site as a storytelling experience rather than a listings directory",
      "Aligned platonic geometric forms against real photography of completed projects",
      "Scored the browsing experience with Mozart's 6th Symphony",
      "Rewrote copy into short, aspirational lines matched to a high-net-worth audience",
    ],
    results: [
      {
        value: "+35%",
        label: "Increase in media mentions",
        sourceNote: "Reported by client across top-tier real estate and design publications. Source: nikhilsharda.in/portfolio/item/omniyat.",
      },
      {
        value: "+40%",
        label: "Uptick in social conversation and sentiment",
        sourceNote: "Social listening data reported by client. Source: nikhilsharda.in/portfolio/item/omniyat.",
      },
      {
        value: "+30%",
        label: "Increase in trust and preference scores",
        sourceNote: "External stakeholder survey data reported by client. Source: nikhilsharda.in/portfolio/item/omniyat.",
      },
      {
        value: "+15%",
        label: "Rise in inquiries from HNW individuals and institutional investors",
        sourceNote: "Reported by client. Source: nikhilsharda.in/portfolio/item/omniyat.",
      },
    ],
    heroAsset: {
      src: "/images/portfolio/omniyat.jpg",
      alt: "OMNIYAT brand and website project, geometric forms against real Dubai architecture",
      type: "image",
    },
    gallery: [
      {
        src: "/images/portfolio/gallery/omniyat/1.jpg",
        alt: "OMNIYAT's leadership ringing the Nasdaq Dubai bell to mark the brand's 20th anniversary",
      },
      {
        src: "/images/portfolio/gallery/omniyat/2.jpg",
        alt: "AVA by Omniyat, platonic geometric forms translated into a residential concept",
      },
      {
        src: "/images/portfolio/gallery/omniyat/3.jpg",
        alt: "Arabian Business press coverage of OMNIYAT's Lumena Alta launch, part of the reported uptick in media mentions",
      },
    ],
    services: ["Brand strategy", "Website design", "Art direction", "Copywriting"],
    disclosure:
      "Delivered by MSM CampusOS's brand and marketing leadership prior to joining MSM CampusOS, published with approval at nikhilsharda.in/portfolio/item/omniyat.",
  },
];

export function getPublishedCaseStudies(industry: IndustryCaseStudy["industry"]) {
  return caseStudies.filter((cs) => cs.industry === industry && cs.status === "published");
}
