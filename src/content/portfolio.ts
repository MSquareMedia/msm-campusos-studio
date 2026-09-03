export type PortfolioPiece = {
  title: string;
  category: string;
  image: string;
  /** Slug for the in-site detail route: /work/{slug} */
  slug: string;
  /** Real, sourced short description. Ignored when caseStudyId is set. */
  summary: string;
  /** Real, sourced longer-form paragraphs, if available. */
  body?: string[];
  services?: string[];
  /** Real result/stat lines sourced from the original project, if any were disclosed. */
  results?: string[];
  /**
   * Only set if a real video exists for this piece, the ONLY external link
   * allowed anywhere in this detail flow.
   */
  videoUrl?: string;
  /**
   * For OMNIYAT, set to "real-estate-omniyat" to pull full detail (challenge,
   * idea, scope, execution, results, testimonial) from case-studies.ts
   * instead of this file's own summary/body.
   */
  caseStudyId?: string;
  /**
   * Real, sourced additional imagery from the original case-study page at
   * nikhilsharda.in, downloaded and hosted locally. Rendered as a gallery
   * on the work detail page below the main summary/body.
   */
  gallery?: Array<{ src: string; alt: string }>;
};

/**
 * Selected work from MSM CampusOS's own brand and marketing leadership,
 * approved for reuse here. Source: nikhilsharda.in/#works-section.
 * Each piece links to an in-site detail page at /work/{slug}, * the only external link permitted anywhere in this flow is a genuine
 * video reel (see videoUrl on the TIGC entry).
 */
export const portfolio: PortfolioPiece[] = [
  {
    title: "IDP",
    category: "Education, Performance Media",
    image: "/images/education/case-studies/idp-hero.jpg",
    slug: "idp",
    summary: "More applications on less spend, without losing lead volume.",
    caseStudyId: "education-online-offline-institute",
  },
  {
    title: "JD Institute",
    category: "Education, Performance Media",
    image: "/images/education/case-studies/jd-institute-hero.jpg",
    slug: "jd-institute",
    summary: "Cutting cost per lead while applications kept rising.",
    caseStudyId: "education-jd-institute",
  },
  {
    title: "RICE Education",
    category: "Education, Performance Media",
    image: "/images/education/case-studies/rice-education-hero.jpg",
    slug: "rice-education",
    summary: "Lowering acquisition cost while lead quality climbed.",
    caseStudyId: "education-rice-education",
  },
  {
    title: "Adamas University",
    category: "Education, Performance Media",
    image: "/images/education/case-studies/adamas-university-hero-2.jpg",
    slug: "adamas-university",
    summary: "Applications up, cost per acquisition down, two years running.",
    caseStudyId: "education-adamas-university",
  },
  {
    title: "DSU International",
    category: "Education, Performance Media",
    image: "/images/education/case-studies/dsu-international-hero.jpg",
    slug: "dsu-international",
    summary: "More international applications, at half the acquisition cost.",
    caseStudyId: "education-dsu-international",
  },
  {
    title: "NEXA",
    category: "Automotive, Brand Campaign, Film",
    image: "/images/automotive/hero-india.jpg",
    slug: "nexa",
    summary: "Turning a paint colour into a campaign: The Sound of NEXA Blue.",
    caseStudyId: "automotive-nexa-sound-of-blue",
  },
  {
    title: "OMNIYAT",
    category: "Branding, Luxury, UI/UX",
    image: "/images/portfolio/omniyat.jpg",
    slug: "omniyat",
    summary:
      "Rebuilding the digital showroom for Dubai's most artistic developer.",
    caseStudyId: "real-estate-omniyat",
    videoUrl: "https://www.youtube.com/watch?v=6nkSOQZ06yw",
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
  },
  {
    title: "Uncharted",
    category: "Branding, Luxury, UI/UX",
    image: "/images/portfolio/uncharted.jpg",
    slug: "uncharted",
    summary:
      "A travel brand website built around navigation and trailblazing, balancing Uncharted's exceptional project work with its core values and principles.",
    body: [
      "The design draws from the brand's essence of navigation and trailblazing. The guiding philosophy: creativity is an unscripted voyage, devoid of preconceived notions of a predetermined destination. The site itself employs a minimalist, contemporary aesthetic aligned with that brand identity.",
      "The primary challenge was to strike a delicate balance between showcasing the brand's exceptional projects and upholding its core values and principles. The team integrated four luxury pillars, Harmony, Mastery, Legacy, and Craftsmanship, to create resonant brand experiences.",
      "Execution included visually captivating GIFs to reflect the brand's commitment to exploration, a considered balance of simplicity and luxury in curated content to convey a premium tone, carefully selected and positioned images to complement the aesthetic and narrative, bespoke cursor designs, subtle but visually captivating animations, and cutting-edge platforms and tools to keep the user journey seamless.",
    ],
    services: ["Website design", "Branding", "UI/UX", "Content curation", "Custom animation", "Cursor design"],
    gallery: [
      {
        src: "/images/portfolio/gallery/uncharted/1.jpg",
        alt: "Uncharted, mapping the design challenge across hospitality, marine, and residential projects",
      },
      {
        src: "/images/portfolio/gallery/uncharted/2.jpg",
        alt: "Uncharted website, Exquisite Materials and About Us sections",
      },
      {
        src: "/images/portfolio/gallery/uncharted/3.jpg",
        alt: "Uncharted website, footer with global embassies listing and newsletter signup",
      },
      {
        src: "/images/portfolio/gallery/uncharted/4.jpg",
        alt: "Uncharted brand palette and the Our Story page, featuring an FG Stijl-designed interior",
      },
      {
        src: "/images/portfolio/gallery/uncharted/5.jpg",
        alt: "Uncharted website, materials library detail",
      },
      {
        src: "/images/portfolio/gallery/uncharted/6.jpg",
        alt: "The Uncharted mark repeated as a postage-stamp brand pattern",
      },
    ],
  },
  {
    title: "Maison D'Auraine",
    category: "Branding, Luxury, Video Production",
    image: "/images/portfolio/maison-dauraine.jpg",
    slug: "maison-dauraine",
    summary:
      "Repositioning a beauty conglomerate from distributor to values-led authority with a single master narrative: Beauty Is Genderless.",
    body: [
      "Maison D'Auraine is a house of beauty brands born at the intersection of elegance and intelligence. The conglomerate curates beauty and hair care brands, including GKHair and pH, that merge aesthetics with scientific formulation, positioning beauty as intentional, precise, and transformative.",
      "Despite owning strong international brands, the company lacked a unified and clearly articulated brand narrative. It was perceived as a distributor rather than a house of brands with a distinct point of view, which limited brand equity and emotional connection in a competitive market, and communication remained fragmented across the portfolio.",
      "The strategic repositioning centered on Beauty Is Genderless as a master narrative challenging gendered stereotypes, built on three pillars: lead with cultural truth rather than a product message, maintain inclusivity through everyday realism rather than performative gestures, and design the narrative to scale across portfolio brands, categories, geographies, and future launches.",
      "The work established Beauty Is Genderless as a distinctive and progressive master narrative, strengthened emotional connection and cultural relevance, elevated the brand from portfolio holder to values-led beauty authority, and created a future-ready platform for international expansion.",
    ],
    services: ["Brand strategy", "Luxury communications", "Narrative development"],
    gallery: [
      {
        src: "/images/portfolio/gallery/maison-dauraine/1.jpg",
        alt: "\"Because Beauty Is Genderless\", the campaign's master narrative key visual",
      },
      {
        src: "/images/portfolio/gallery/maison-dauraine/2.jpg",
        alt: "\"Generosity is Genderless\", campaign visual",
      },
      {
        src: "/images/portfolio/gallery/maison-dauraine/3.jpg",
        alt: "\"Faith is genderless\", campaign visual",
      },
      {
        src: "/images/portfolio/gallery/maison-dauraine/4.jpg",
        alt: "\"Love is genderless\", campaign visual",
      },
      {
        src: "/images/portfolio/gallery/maison-dauraine/5.jpg",
        alt: "\"Hope is genderless\", campaign visual",
      },
      {
        src: "/images/portfolio/gallery/maison-dauraine/6.jpg",
        alt: "\"Joy is Genderless\", campaign visual",
      },
    ],
  },
  {
    title: "TIGC",
    category: "Branding, Video Production",
    image: "/images/portfolio/tigc.jpg",
    slug: "tigc",
    summary:
      "\"SKY UP NOW\" with Surya Kumar Yadav: a CGI-driven brand film for TIGC's Korean Wear and DC x Marvel Collection that hit 15 million+ views.",
    body: [
      "The SKY UP NOW campaign promoted TIGC's Korean Wear and DC x Marvel Collection through a brand film built on CGI technology, replacing what would otherwise have required extensive outdoor location logistics. The production, two one-minute films, four 30-second reels, and 40+ fashion shots, was completed in eight hours through meticulous coordination across departments, paired with an original rap track composed to carry the visual storytelling.",
      "The result was a seamless fusion of technology, style, and spontaneity that turned a tight brief into a viral success story, reaching viral status within 20 minutes of release.",
    ],
    services: ["Branding", "Video production", "CGI production", "Original music composition"],
    results: ["15 Million+ views", "300k+ shares", "1,900+ comments", "Viral within 20 minutes of release"],
    videoUrl: "https://www.youtube.com/watch?v=Kkg5U0DmRvs",
    gallery: [
      {
        src: "/images/portfolio/gallery/tigc/1.jpg",
        alt: "Suryakumar Yadav's Instagram post promoting TIGC's #BeYourOwnSky campaign",
      },
      {
        src: "/images/portfolio/gallery/tigc/2.jpg",
        alt: "Fan comments on the SKY UP NOW campaign reel",
      },
    ],
  },
  {
    title: "TATA Consumer Goods",
    category: "Branding, Packaging",
    image: "/images/portfolio/tata-consumer-goods.jpg",
    slug: "tata-consumer-goods",
    summary:
      "Packaging design for two plant-based protein lines, LivMo and One True, balancing Tata's heritage of trust with modern nutritional science.",
    body: [
      "LivMo Plant Protein uses a functional yet premium aesthetic that balances Tata's heritage of trust with modern nutritional science. An earthy brown palette paired with muted greens conveys natural origin and wellness while preserving shelf visibility. The design pairs a minimalist layout and high-contrast typography with circular iconography that highlights product benefits, vegan, gluten-free, high-protein, plus lifestyle messaging around active living, sports performance, and strength training, and a structured nutritional table carrying a \"Tata Way\" seal for credibility.",
      "One True Plant Protein features sage green as its dominant hue, evoking calm, trust, and nature. The design emphasizes clean minimalism to signal purity and plant-based authenticity, using rounded edges, curved graphic pathways, and a symmetrical layout. Bold, sans-serif typography carries brand recognition, while icons provide visual breathing space and a more approachable tone.",
    ],
    services: ["Packaging design"],
    gallery: [
      {
        src: "/images/portfolio/gallery/tata-consumer-goods/1.jpg",
        alt: "LivMo Plant Protein chocolate flavor packaging design",
      },
      {
        src: "/images/portfolio/gallery/tata-consumer-goods/2.jpg",
        alt: "One True Plant Protein chocolate flavor packaging design",
      },
    ],
  },
  {
    title: "Crafted for Impact",
    category: "Branding, Social Media",
    image: "/images/portfolio/crafted-for-impact.jpg",
    slug: "crafted-for-impact",
    summary:
      "A showcase of social media campaigns spanning quick viral moments and long-form narratives that shaped perception over months.",
    body: [
      "Every scroll tells a story, of a brand, a culture, a moment in time. This showcase compiles social media campaigns that ranged from ideas that went viral in minutes to long-form narratives that shaped perception over months. Each piece represents a question asked differently, a brand reimagined, a voice amplified.",
      "Social media today is less about visibility and more about velocity, of thought, culture, and connection.",
    ],
    services: ["Social media campaign strategy", "Creative design and storytelling", "Campaign performance optimization"],
    gallery: [
      {
        src: "/images/portfolio/gallery/crafted-for-impact/1.jpg",
        alt: "Cornitos #AbTakKahanThe outdoor and packaging campaign",
      },
      {
        src: "/images/portfolio/gallery/crafted-for-impact/2.jpg",
        alt: "UNICEF India 75th-anniversary key visual, \"Stepping Ahead Together With Every Indian Child\"",
      },
      {
        src: "/images/portfolio/gallery/crafted-for-impact/3.jpg",
        alt: "\"TEAgether We Stand\" pre-launch teaser post",
      },
      {
        src: "/images/portfolio/gallery/crafted-for-impact/4.jpg",
        alt: "Dorset smart lock campaign, \"#SabSetHai with Dorset\"",
      },
      {
        src: "/images/portfolio/gallery/crafted-for-impact/5.jpg",
        alt: "Rang-e-Roz Kanak collection festive grid campaign",
      },
      {
        src: "/images/portfolio/gallery/crafted-for-impact/6.jpg",
        alt: "Rang-e-Roz Kanak collection Haldi ceremony grid campaign",
      },
      {
        src: "/images/portfolio/gallery/crafted-for-impact/7.jpg",
        alt: "Madhusudan Milk, \"The Milk of India\" campaign",
      },
      {
        src: "/images/portfolio/gallery/crafted-for-impact/8.jpg",
        alt: "Madhusudan Frozen Green Peas, \"Fresh Is Frozen\" campaign",
      },
      {
        src: "/images/portfolio/gallery/crafted-for-impact/9.jpg",
        alt: "Wai Wai City social media page design",
      },
    ],
  },
  {
    title: "House of Torani",
    category: "Branding, Luxury, Packaging",
    image: "/images/portfolio/torani.jpg",
    slug: "torani",
    summary:
      "Vintage-currency-inspired brand collateral and packaging for House of Torani, a luxury leather goods label.",
    body: [
      "House of Torani's identity is built around an antique-banknote aesthetic: ornate borders, wax-seal stamps, and an engraved elephant crest that reads more like a century-old certificate of authenticity than a modern business card.",
      "The system carries across a two-sided visiting card printed like a bank note, a set of postage-stamp-style seals, a kraft gift box embossed with the wax-seal crest, and an invoice/certificate design that turns a simple receipt into a collectible piece of ephemera.",
    ],
    services: ["Packaging design", "Brand collaterals"],
    gallery: [
      {
        src: "/images/portfolio/gallery/torani/1.jpg",
        alt: "House of Torani brand collateral: currency-style visiting card, postage-stamp seals, embossed gift box, and invoice ephemera",
      },
    ],
  },
  {
    title: "Unison Centrio",
    category: "Branding, Luxury, Signage",
    image: "/images/portfolio/unison-centrio.jpg",
    slug: "unison-centrio",
    summary:
      "Full brand identity, stationery, and wayfinding signage for Unison Centrio, a luxury shopping mall, built around a sunburst mark and a warm maroon-and-gold palette.",
    body: [
      "The Centrio mark, a radiating sunburst paired with a confident wordmark, extends into column banners, \"WE ARE CENTRIO\" campaign posters, and a canvas tote, all carrying the brand's maroon, gold, and cream palette.",
      "On the operational side, the identity was built out into business cards, letterhead, and envelopes for leadership, plus in-mall digital directory signage with wayfinding icons for escalators, parking, entry, and exit.",
    ],
    services: ["Brand identity", "Brand collaterals", "Signage design"],
    gallery: [
      {
        src: "/images/portfolio/gallery/unison-centrio/1.jpg",
        alt: "Unison Centrio column banners, \"WE ARE CENTRIO\" posters, and branded tote bag",
      },
      {
        src: "/images/portfolio/gallery/unison-centrio/2.jpg",
        alt: "Unison Centrio business cards, envelope, and letterhead stationery",
      },
      {
        src: "/images/portfolio/gallery/unison-centrio/3.jpg",
        alt: "Unison Centrio in-mall digital directory signage with wayfinding icons",
      },
    ],
  },
  {
    title: "Wellbeing Nutrition",
    category: "Branding, Packaging",
    image: "/images/portfolio/wellbeing-nutrition.jpg",
    slug: "wellbeing-nutrition",
    summary:
      "Botanical packaging design for RemeTea, Wellbeing Nutrition's herbal tea line, pairing hand-illustrated florals with a soft, apothecary-inspired palette.",
    body: [
      "The RemeTea Relaxation blend, chamomile, lavender, and rose, is packaged in a cylindrical pyramid-tea-sachet box, with botanical illustration and a dusty-blue band grounding the design in an organic, wellness-led shelf presence.",
    ],
    services: ["Packaging design"],
    gallery: [
      {
        src: "/images/portfolio/gallery/wellbeing-nutrition/1.jpg",
        alt: "RemeTea Relaxation herbal tea packaging, angled view",
      },
      {
        src: "/images/portfolio/gallery/wellbeing-nutrition/2.jpg",
        alt: "RemeTea Relaxation herbal tea packaging, front view",
      },
    ],
  },
  {
    title: "Haldiram's",
    category: "Branding, Packaging, F&B",
    image: "/images/portfolio/haldirams.jpg",
    slug: "haldirams",
    summary:
      "Packaging design across Haldiram's snacking and gifting range, from Kruncher chips and Assorted Toffee Bytes to the Harmony festive gift box and a mineral water line.",
    body: [
      "Kruncher's Savory Tomato chips use a bold maroon-and-yellow pack with a swirl-cut illustration, while the Assorted Toffee Bytes pouch takes the opposite approach, a bright color-block pattern with flavor icons for pista, coconut, chocolate, kesar khoya, kaju gulab, and anjeer.",
      "For gifting, the Harmony box pairs a mandala-patterned lid with a compartmented chocolate hamper, and the range extends to a Himalayan mineral water bottle with a mountain-line label.",
    ],
    services: ["Packaging design"],
    gallery: [
      {
        src: "/images/portfolio/gallery/haldirams/1.jpg",
        alt: "Haldiram's Kruncher Savory Tomato chips packaging",
      },
      {
        src: "/images/portfolio/gallery/haldirams/2.jpg",
        alt: "Haldiram's Assorted Toffee Bytes packaging",
      },
      {
        src: "/images/portfolio/gallery/haldirams/3.jpg",
        alt: "Haldiram's Harmony festive chocolate gift box",
      },
      {
        src: "/images/portfolio/gallery/haldirams/4.jpg",
        alt: "Haldiram's Himalayan mineral water bottle",
      },
    ],
  },
  {
    title: "Dromen & Co",
    category: "Branding, Packaging, Beauty",
    image: "/images/portfolio/dromen-co.jpg",
    slug: "dromen-co",
    summary:
      "Apothecary-style packaging for Dromen & Co's Hair Brew Oil, pairing botanical line art with a clean, ingredient-led label system.",
    body: [
      "The Hair Brew Oil label leads with ingredient transparency, a formulation of fifteen dry herbs including lavender, vetiver, reetha, shikakai, neem, brahmi, and wild rose, laid out on a clean apothecary-style carton alongside a rosemary and lavender variant bottled with visible botanicals and finished in delicate line-art illustration.",
    ],
    services: ["Packaging design"],
    gallery: [
      {
        src: "/images/portfolio/gallery/dromen-co/1.jpg",
        alt: "Dromen & Co Rosemary & Lavender Brew Oil bottle with botanical line art",
      },
    ],
  },
  {
    title: "Burgrill",
    category: "Branding, Packaging, F&B",
    image: "/images/portfolio/burgrill.jpg",
    slug: "burgrill",
    summary:
      "Brand identity, menu design, and packaging for Burgrill, a burger-focused F&B chain, spanning in-store menu boards to staff uniforms.",
    body: [
      "Burgrill's identity centers on a bold, primary-color palette carried from its burger-and-bun logo mark through to in-store menu boards organized by Burgers, Subs & Wraps, and Healthy Bowls, and onto branded staff aprons.",
    ],
    services: ["Brand identity", "Packaging design", "Menu design"],
    gallery: [
      {
        src: "/images/portfolio/gallery/burgrill/1.jpg",
        alt: "Burgrill burger photography and branded staff apron",
      },
    ],
  },
  {
    title: "One8Select",
    category: "Branding, Luxury, Fashion",
    image: "/images/portfolio/one8select.jpg",
    slug: "one8select",
    summary:
      "Website UI, social campaigns, and catalogue photography for One8Select, Virat Kohli's premium formal footwear label.",
    body: [
      "The \"Your Best Foot Forward\" campaign positions One8Select's formal footwear as being \"as versatile as Virat himself,\" carried across the brand's e-commerce site, Instagram promotion visuals, and an Autumn/Winter catalogue shot with Virat Kohli.",
    ],
    services: ["UI design", "Marketing collaterals", "Social media design"],
    gallery: [
      {
        src: "/images/portfolio/gallery/one8select/1.jpg",
        alt: "One8Select lifestyle and product photography featuring Virat Kohli",
      },
      {
        src: "/images/portfolio/gallery/one8select/2.jpg",
        alt: "One8Select \"Your Best Foot Forward\" campaign poster",
      },
      {
        src: "/images/portfolio/gallery/one8select/3.jpg",
        alt: "One8Select Autumn/Winter catalogue and product SKU sheet",
      },
      {
        src: "/images/portfolio/gallery/one8select/4.jpg",
        alt: "One8Select Instagram promotion mockup",
      },
    ],
  },
];
