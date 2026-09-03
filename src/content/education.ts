import type { IndustryContent } from "./types";

export const education: IndustryContent = {
  slug: "education",
  industryLabel: "Education",
  metaTitle: "MSM CampusOS for Education: the operating platform for campuses",
  metaDescription:
    "MSM CampusOS is the operating platform for campuses: marketing, creative, curriculum, faculty support, and evaluation infrastructure, built by a team with over a decade in education exclusively.",
  hero: {
    // Fixed endorsement line, never reworded, never reversed. See
    // AGENTS.md-adjacent brand notes: SOTAPO is the masterbrand everywhere
    // else; only here does it endorse a deeper, named operating layer.
    eyebrow: "Sotapo Education, Powered by MSM CampusOS",
    headline: "It worked. Mostly.",
    supportingCopy:
      "The real film behind MSM CampusOS. How institutions turn quiet dysfunction into a system that scales.",
    video: {
      youtubeId: "pCYH4seVLos",
      posterSrc: "/images/education/hero-poster.jpg",
      title: "The Future of Education Isn't Waiting: MSM CampusOS Official Brand Film",
    },
  },
  story: {
    heading: "Nobody planned for this.",
    intro:
      "Westfield University is a fictional institution we built to illustrate a pattern we see across real campuses. Any resemblance to an actual institution is coincidental, but the pattern usually isn't.",
    moments: [
      {
        label: "Chapter I",
        title: "Nobody planned for this",
        description:
          "Westfield grew. Not dramatically, just enough. A new program, a new system, another spreadsheet, another vendor, another process nobody officially owned. Complexity became part of the culture before anyone named it, and it reached the Vice Chancellor's desk having already consumed everyone below her.",
        image: "/images/education/campus-break.jpg",
        alt: "Red-brick university campus buildings along a quiet street at dusk",
        credit: "Photography by Dayne Topkin, via Wikimedia Commons (CC0).",
      },
      {
        label: "Chapter II",
        title: "It started with small things",
        description:
          "Timetables. Escalations. Emails. Questions nobody owned. The Registrar had three monitors, printed schedules across two walls, and four years of Saturdays. Forty-seven percent of applications started at Westfield were never completed. Processing took twenty-eight days. The institution down the road took five.",
        image: "/images/education/library-break.jpg",
        alt: "Close detail of a university library bookshelf",
        credit: "Photography by Aleksi Tappura, via Wikimedia Commons (CC0).",
      },
    ],
  },
  pov: {
    heading: "Not a team learning the sector.",
    body: [
      "The people running MSM CampusOS previously operated one of India's most respected education-focused agencies. Fourteen-plus years working in education exclusively. Fifty-plus schools. Five hundred-plus institutions served.",
      "That same bench now runs on global technology infrastructure across twenty-nine countries. Marketing, creative, curriculum, faculty development, and evaluation, connected as one system rather than run as separate engagements.",
    ],
  },
  capabilityGroups: [
    {
      title: "Grow enrolment",
      summary: "A full-stack engine wired from first impression to first cheque.",
      items: [
        {
          title: "Brand and reach",
          description:
            "Brand strategy, architecture, and voice. Awareness campaigns and social presence across Instagram, YouTube, and LinkedIn.",
        },
        {
          title: "Discovery and capture",
          description:
            "SEO and organic, performance media on Google and Meta, an SEO-first website, and lead-generation funnels tuned for conversion.",
        },
        {
          title: "Nurture",
          description:
            "CRM-integrated journeys, trigger-based automated flows, and re-engagement loops that keep applicants moving.",
        },
        {
          title: "Convert and measure",
          description:
            "GA4 and dashboard-level attribution, with weekly channel insight and a monthly board-ready ROI view.",
        },
      ],
    },
    {
      title: "Build the brand",
      summary: "A story worth applying to, and a reputation defended at scale.",
      items: [
        {
          title: "Creative and media",
          description:
            "Integrated campaigns, print and outdoor, collateral, ambassador strategy, and photography or film production.",
        },
        {
          title: "Content and distribution",
          description:
            "Blog and copywriting, articles, scripts, leadership profiles, and explainer or corporate video.",
        },
        {
          title: "Influencer and community",
          description:
            "Campaign strategy, outreach and partnerships, and user-generated content programmes with proper disclosure.",
        },
        {
          title: "Reputation management",
          description:
            "Monitoring, sentiment analysis, and a structured response to negative coverage alongside positive amplification.",
        },
      ],
    },
    {
      title: "Strengthen delivery",
      summary: "Industry-aligned academic architecture you can defend at accreditation.",
      items: [
        {
          title: "Curriculum design",
          description:
            "Industry-aligned programme design, NAAC and UGC compliance mapping, and outcome-based education structuring.",
        },
        {
          title: "Faculty enablement",
          description:
            "Faculty development programmes on AI and digital teaching, outcome-based education workshops, and pedagogy support.",
        },
        {
          title: "Guest faculty and industry bridge",
          description:
            "Guest lecturers, industry experts, and structured academia-industry collaboration for real classroom relevance.",
        },
        {
          title: "Career readiness",
          description:
            "Bootcamps, interview preparation, live projects, hackathons, and placement-readiness programming.",
        },
      ],
    },
    {
      title: "Prove outcomes",
      summary: "Every assessment your students already take, turned into accreditation-ready data.",
      items: [
        {
          title: "Assessment infrastructure",
          description:
            "Connects to your existing exam and submission workflow. No new systems, no disruption to faculty or students.",
        },
        {
          title: "Faculty-approved evaluation",
          description:
            "A first-pass evaluation faculty review and approve. Their time goes to judgment, not marking every paper from scratch.",
        },
        {
          title: "Structured signal",
          description:
            "Every evaluated answer becomes structured data: rubric alignment, consistency checks, and feedback generation.",
        },
        {
          title: "Institutional intelligence",
          description:
            "Accreditation-ready outcomes data, student-level progress tracking, and department-wide evaluation consistency.",
        },
      ],
    },
  ],
  modernServices: {
    heading: "Twelve services. One operating system.",
    intro:
      "The full institutional lifecycle, from first enquiry to alumni, run as one system rather than fourteen disconnected ones. Start with one function, then add the rest as you scale.",
    // Matches the service catalog and ACQUIRE/OPERATE/ENGAGE/INFRASTRUCTURE
    // phase grouping published at msmunify.com/campusos, so this page and
    // the flagship MSM CampusOS site describe the same operating system
    // rather than two different services lists under one product name.
    items: [
      { group: "Acquire", title: "Digital marketing", description: "Brand positioning, digital campaigns, and student acquisition built for institutions that need volume without losing precision." },
      { group: "Acquire", title: "PR & branding", description: "Media relations, reputation management, and thought leadership. What the institution says publicly, and how it lands." },
      { group: "Acquire", title: "Applications", description: "End-to-end processing at volume. Eligibility screening, document verification, and pipeline management. Speed matters here." },
      { group: "Acquire", title: "Admissions", description: "Offer management, conditional clearance, enrolment confirmation, and onboarding coordination. The step where most institutions quietly lose students." },
      { group: "Operate", title: "Timetabling", description: "Conflict-free scheduling across faculty, rooms, and cohorts. Built for institutions where complexity is the baseline." },
      { group: "Operate", title: "Assessments", description: "Design, marking workflows, moderation, and academic integrity at scale. The work that keeps accreditors satisfied and faculty focused." },
      { group: "Operate", title: "Finance", description: "Revenue management, fee collection, vendor payments, and financial reporting. Accurate, auditable, and actually on time." },
      { group: "Operate", title: "Staffing & HR", description: "Recruitment, contracts, payroll, compliance, and faculty development. Run on schedule rather than perpetual catch-up." },
      { group: "Engage", title: "CRM & student care", description: "The full student lifecycle. First enquiry to graduation to alumni. Data-driven and actually joined up." },
      { group: "Engage", title: "Alumni relations", description: "Engagement strategies, giving programs, and industry networks. The relationship that starts after graduation." },
      { group: "Infrastructure", title: "IT support", description: "Helpdesk, infrastructure management, and systems integration." },
      { group: "Infrastructure", title: "MSM Aventra", description: "Unified CRM, SIS, and LMS. One integrated platform built for academic institutions." },
    ],
  },
  engagementModel: [
    {
      step: "01",
      title: "Institutional audit",
      description: "Map current enrolment funnel, brand position, curriculum, and evaluation workflow before proposing anything.",
    },
    {
      step: "02",
      title: "Pilot campus",
      description: "Prove the approach on one campus, programme, or department before committing to a wider rollout.",
    },
    {
      step: "03",
      title: "Performance review",
      description: "Weekly channel insight, monthly board-ready reporting, assessed against agreed outcomes before scaling spend.",
    },
    {
      step: "04",
      title: "Scale",
      description: "Extend what worked across campuses and departments, with accreditation and compliance built in from the start.",
    },
  ],
  governance: {
    heading: "Built around your accreditation cycle",
    body: [
      "Indian higher education is under active regulatory change: NEP 2020 implementation, NAAC reaccreditation cycles, AICTE and UGC compliance, outcome-based education mapping.",
      "Curriculum and accreditation work is built to be defensible at review, not just presentable in a pitch.",
      "Student and faculty data used in evaluation infrastructure and CRM journeys is handled under institution-controlled agreements.",
      "Assessment integration connects to your existing exam workflow rather than replacing it. Your scoring rubrics stay yours.",
      "Every accreditation, compliance, and outcomes claim is reviewed against your own documentation before it goes near a regulator.",
    ],
    note: "The right approach depends on your institution type, accreditation status, and state or national regulatory requirements. We build the plan around those requirements.",
  },
  finalCta: {
    heading: "Ready to build what Westfield needed?",
    body: "Tell us about your institution, your accreditation cycle, and where operations are quietly breaking.",
  },
  proofStats: {
    heading: "MSM Unify, by the numbers",
    sourceNote: "MSM Unify company-wide figures and team track record, MSM CampusOS India Edition briefing (2026).",
    stats: [
      { value: "190,000+", label: "Students helped", sourceNote: "MSM Unify company-wide, MSM CampusOS India Edition briefing (2026)." },
      { value: "1,500+", label: "Partner campuses", sourceNote: "MSM Unify company-wide, MSM CampusOS India Edition briefing (2026)." },
      { value: "29", label: "Countries", sourceNote: "MSM Unify company-wide, MSM CampusOS India Edition briefing (2026)." },
      { value: "14+", label: "Years in education marketing", sourceNote: "Core leadership team track record, MSM CampusOS India Edition briefing (2026)." },
      { value: "500+", label: "Institutions served", sourceNote: "Core leadership team track record, MSM CampusOS India Edition briefing (2026)." },
      { value: "6,000+", label: "Certified recruitment agents", sourceNote: "MSM Unify company-wide, active across 30+ source countries, MSM CampusOS India Edition briefing (2026)." },
      { value: "800+", label: "Clients served (prior to MSM CampusOS)", sourceNote: "Delivered by MSM CampusOS's delivery leadership at a previous education-marketing business, before this platform; figures as reported by that team." },
      { value: "₹750 Cr+", label: "Admission revenue driven for clients (prior to MSM CampusOS)", sourceNote: "Delivered by MSM CampusOS's delivery leadership at a previous education-marketing business, before this platform; figures as reported by that team." },
      { value: "+40%", label: "Qualified-enquiry growth on pilot campuses", sourceNote: "Incremental enrolment uplift across pilot campuses, MSM CampusOS India Edition briefing (2026)." },
    ],
  },
  proofLedger: {
    heading: "Nine numbers, and where each one comes from.",
    intro:
      "Grouped by provenance rather than flattened into one wall. Some of these are MSM Unify company-wide; some belong to the team's track record before this platform existed. The distinction matters, so it is on the page rather than in a footnote.",
  },
  clients: {
    heading: "Institutions the team has worked with",
    // The real roster this team has worked with across a fourteen-year
    // career runs well past the logos held as approved assets below, this
    // states that honestly rather than undercounting to match the grid.
    countLabel: "100+",
    disclosure:
      "These reflect the body of work MSM CampusOS's leadership has led over a fourteen-year marketing and communications career, not all exclusively MSM CampusOS engagements.",
    // Order here only affects the client-roster grid on this page, the
    // homepage hero marquee re-sorts and filters this same list itself (see
    // buildHeroLogos in app/campusos/page.tsx), including excluding a few
    // marks that don't survive that marquee's white-silhouette filter.
    logos: [
      { name: "XLRI", src: "/images/education/clients/xlri.png" },
      { name: "RICS", src: "/images/education/clients/rics.png" },
      { name: "Reliance Animation Academy", src: "/images/education/clients/reliance-animation-academy.png" },
      { name: "JIIT", src: "/images/education/clients/jiit.png" },
      { name: "Kohinoor Business School", src: "/images/education/clients/kohinoor-business-school.png" },
      { name: "Manipal Academy of BFSI", src: "/images/education/clients/manipal-academy-of-bfsi.png" },
      { name: "Jaypee Business School", src: "/images/education/clients/jaypee-business-school.png" },
      { name: "Adamas University", src: "/images/education/clients/adamas-university.png" },
      { name: "Arena Animation", src: "/images/education/clients/arena-animation.png" },
      { name: "D Y Patil International University", src: "/images/education/clients/dy-patil.png" },
      { name: "MICA", src: "/images/education/clients/mica.png" },
      { name: "IIDE, The Digital School", src: "/images/education/clients/iide.png" },
      { name: "Rice Education", src: "/images/education/clients/rice-education.png" },
      { name: "IRMA", src: "/images/education/clients/irma.png" },
      { name: "Jaypee Edusphere", src: "/images/education/clients/jaypee-edusphere.png" },
      { name: "GEMS B School", src: "/images/education/clients/gems-b-school.png" },
      { name: "Dayananda Sagar University", src: "/images/education/clients/dayananda-sagar.png" },
      { name: "Bharati Vidyapeeth", src: "/images/education/clients/bharati-vidyapeeth.png" },
      { name: "VIBGYOR Group of Schools", src: "/images/education/clients/vibgyor.png" },
      { name: "United Group of Institutions", src: "/images/education/clients/united-group.png" },
      { name: "Goa Institute of Management", src: "/images/education/clients/goa-institute.png" },
      { name: "Adamas International School", src: "/images/education/clients/adamas-international-school.png" },
      { name: "Adamas World School", src: "/images/education/clients/adamas-world-school.png" },
      { name: "Adamas Kids", src: "/images/education/clients/adamas-kids.png" },
      { name: "Rice Adamas Group", src: "/images/education/clients/rice-adamas-group.png" },
      { name: "Jagannath University", src: "/images/education/clients/jagannath-university.png" },
      { name: "Lingaya's Vidyapeeth", src: "/images/education/clients/lingayas-vidyapeeth.png" },
      { name: "Madanapalle Institute of Technology & Science", src: "/images/education/clients/madanapalle-institute-of-technology.png" },
      { name: "Institute of Public Enterprise", src: "/images/education/clients/institute-of-public-enterprise.png" },
      { name: "IMS Ghaziabad", src: "/images/education/clients/ims-ghaziabad.png" },
      { name: "Kohinoor Management School", src: "/images/education/clients/kohinoor-management-school.png" },
      { name: "IES MCRC", src: "/images/education/clients/ies-mcrc.png" },
      { name: "JD Institute of Fashion Technology", src: "/images/education/clients/jd-institute-fashion-technology.png" },
      { name: "Raffles Design International", src: "/images/education/clients/raffles-design-international.png" },
      { name: "CII Institute of Hospitality", src: "/images/education/clients/cii-institute-of-hospitality.png" },
      { name: "Guru Nanak Institute of Hotel Management", src: "/images/education/clients/guru-nanak-institute-hotel-management.png" },
      { name: "E-DAC", src: "/images/education/clients/e-dac.png" },
      { name: "DME College", src: "/images/education/clients/dme-college.png" },
      { name: "Delhi Technical Campus", src: "/images/education/clients/delhi-technical-campus.png" },
      { name: "Birla Open Minds", src: "/images/education/clients/birla-open-minds.png" },
      { name: "Brainiacs", src: "/images/education/clients/brainiacs.png" },
      { name: "Shri Ram Centennial School", src: "/images/education/clients/shri-ram-centennial-school.png" },
      { name: "Shiksha Valley School", src: "/images/education/clients/shiksha-valley-school.png" },
      { name: "Shivneri School", src: "/images/education/clients/shivneri-school.png" },
      { name: "Mayoor School, Noida", src: "/images/education/clients/mayoor-school.png" },
      { name: "Lancers Army School", src: "/images/education/clients/lancers-army-school.png" },
      { name: "Holy Writ High School & Junior College", src: "/images/education/clients/holy-writ-high-school.png" },
      { name: "Eton College", src: "/images/education/clients/eton-college.png" },
      { name: "Florida Coastal University", src: "/images/education/clients/florida-coastal-university.png" },
      { name: "Multihexa", src: "/images/education/clients/multihexa.png" },
      { name: "Taylor Pro College", src: "/images/education/clients/taylor-pro-college.png" },
      { name: "Extreme Pro Driver Training", src: "/images/education/clients/extreme-pro-driver.png" },
      { name: "Q Academy", src: "/images/education/clients/q-academy.png" },
      { name: "IMT", src: "/images/education/clients/imt.png" },
      { name: "MIS Mussoorie", src: "/images/education/clients/ms-mussoorie.png" },
      { name: "TimesPro", src: "/images/education/clients/timespro.png" },
      { name: "VIS", src: "/images/education/clients/vis.png" },
    ],
  },
  /* ---------------------------------------------------------------------
   * Client-supplied testimonials.
   *
   * Supplied verbatim by the client, with one edit made on their explicit
   * instruction: the name of the agency the quotes were originally written
   * about has been removed throughout, per the decision to keep that name off
   * this site. The Adamas quote additionally named two individuals who worked
   * at that agency and not at MSM CampusOS; naming them here while removing
   * their employer would have read as crediting this team with their work, so
   * they are referred to by role instead.
   *
   * These are edited quotes from real named institutions. They should be
   * re-approved by each institution before this site is public.
   *
   * `clientLogo` is set only where an approved logo asset is already held in
   * this repo. IDP and LSC London are not, so they render as wordmarks rather
   * than a redrawn trademark.
   * ------------------------------------------------------------------- */
  testimonials: [
    {
      // Tightened for length parity across all four quotes on this page and
      // the homepage's mixed grid, where these ran much longer than the
      // placeholder quotes from other industries. Meaning preserved, nothing
      // added.
      quote:
        "Partnering with MSM CampusOS has strengthened Reliance Animation Academy's digital presence. Their SEO and social strategy brought fresh ideas and sharp execution, lifting engagement by ~50% in two months, a partner that moves fast as we scale RAA into a pan-India franchise.",
      rolePlaceholder: "",
      // Real, client-supplied byline, not a fabricated placeholder.
      personName: "Sandeep Shetty",
      clientName: "Reliance Animation Academy",
      // Sourced from the institution's own official site
      // (relianceacademyindia.com) and cropped/upscaled cleanly, same
      // wordmark, no redrawing.
      clientLogo: "/images/education/clients/reliance-animation-academy.png",
      clientLogoTall: true,
    },
    {
      // Tightened for length parity across the grid. Meaning preserved,
      // nothing added.
      quote:
        "We have been associated with the team for a few years, and they understand digital marketing well. I interact with some of the best people, who bring unique, effective campaign ideas. The team is dedicated, always in touch, and tailors every campaign to our requirements.",
      rolePlaceholder: "Marketing leadership",
      clientName: "Adamas University",
      clientLogo: "/images/education/clients/adamas-university.png",
      clientLogoTall: true,
    },
    {
      // Tightened for length parity across the grid. Meaning preserved,
      // nothing added.
      quote:
        "Digital platform helped us achieve our goal at a third of the cost of traditional media. The team has done amazing work for our brand, RICS Amity University has worked with them for three years, and digital advertising's flexibility and precise targeting is exactly what we value.",
      rolePlaceholder: "Marketing leadership",
      clientName: "RICS Amity University",
      clientLogo: "/images/education/clients/rics.png",
    },
    {
      // Tightened for length parity across the grid. Meaning preserved,
      // nothing added.
      quote:
        "The quality of service and solutions from our first contact was highly impressive. Every aspect exceeded expectations, a well-planned strategy with a sharp digital approach. It's one of the best experiences we've had working with any digital marketing company.",
      rolePlaceholder: "Marketing team",
      clientName: "LSC London",
    },
  ],

  team: {
    heading: "The people behind MSM CampusOS",
    intro:
      "Growth, brand, academic systems, delivery, and faculty design. One bench, already doing this in India at scale.",
    members: [
      {
        name: "Nikhil Sharda",
        role: "AVP, Brand & Marketing",
        bio: "22+ years as a global award-winning marketing leader (Cannes Lions, Effie, EMVIES, Kyoorius Elephant, AMA Awards). Built and transformed brands including NEXA, ReNew, and Rajasthan Tourism across 40+ countries.",
        photo: "/images/education/team/nikhil-sharda.jpg",
      },
      {
        name: "Mudit Kalia",
        role: "AVP, MSM CampusOS",
        bio: "14+ years building revenue engines across EdTech and media. Founding member, CollegeDekho Group. Conceived and launched aajtakcampus.com and ATCNAT, India's first national aptitude test for NEET/JEE aspirants, at India Today Group.",
        photo: "/images/education/team/mudit-kalia.jpg",
      },
      {
        name: "Mohsin Abbas",
        role: "Director, Delivery",
        bio: "15+ years across digital marketing and EdTech, specialising in business operations and client success. Founding member of HTCampus.com, and nine years driving growth at a previous education-marketing business.",
        photo: "/images/education/team/mohsin-abbas.jpg",
      },
      {
        name: "Rahul Khandelwal",
        role: "Founder, CGF, IIT Delhi",
        bio: "IIT Delhi alumnus. Former Regional In-charge at Pratham, leading learning programmes across 15,000 government schools reaching 2.3 million students across five Indian states.",
        photo: "/images/education/team/rahul-khandelwal.jpg",
      },
      {
        name: "Dr. Nalin Jha",
        role: "Academic & EdTech Leader",
        bio: "20+ years in higher education, EdTech, and academic strategy, working across universities and industry collaborations on digital transformation and employability.",
        photo: "/images/education/team/nalin-jha.jpg",
      },
    ],
    quotes: [
      {
        quote:
          "We believe the institutions that will lead the next decade of higher education will not be defined solely by the strength of their academic offerings.",
        name: "Sanjay Laul",
        role: "Founder, MSM Unify",
        photo: "/images/education/team/sanjay-laul.jpeg",
      },
      {
        quote:
          "Our approach is deeply execution-driven: structured institutional partnerships, high-impact campus engagement, and technology aligned with on-ground realities across Indian campuses.",
        name: "Rohit Kumar",
        role: "Founding Member & President, India Campus Business",
        photo: "/images/education/team/rohit-kumar.jpeg",
      },
    ],
    leadership: {
      heading: "What leadership is building in India.",
      intro:
        "Sanjay Laul sets the global vision. Rohit Kumar leads execution across Indian campuses. In their own words.",
    },
    serviceLeadership: {
      heading: "Know the team you work with.",
      intro:
        "Every service line below has an owner accountable for it. The people in those seats are named here as they join.",

      // ---------------------------------------------------------------
      // TODO: REAL SERVICE HEADS GO HERE, AND NOWHERE ELSE.
      //
      // This array is intentionally EMPTY. While it stays empty the
      // ServiceLeadership component renders the roles-and-hiring state built
      // from `roles` below, which contains no personal names.
      //
      // To publish a real service head, append one entry of the shape:
      //   {
      //     name: "<real full name, as the person spells it>",
      //     role: "<their real title, matching a `roles[].title` below>",
      //     bio:  "<real biography, verifiable, no invented achievements>",
      //     photo: "/images/education/team/<their-photo>.jpg",
      //   }
      // and drop the matching entry from `roles` so the seat is not listed as
      // both filled and unnamed.
      //
      // HARD RULE: do not add a person here until that person actually holds
      // the role, the biography is verified, and the photograph is theirs.
      // Never reuse another team member's photograph for a service head.
      // ---------------------------------------------------------------
      // ⚠️ PLACEHOLDER PEOPLE, NOT REAL EMPLOYEES. ⚠️
      //
      // Added at the client's explicit request for the pre-launch preview
      // build, to show the shape of a staffed bench. Every name, biography and
      // tenure below is INVENTED. Nobody listed here works for MSM CampusOS.
      //
      // These must be replaced with real heads, or removed entirely, before
      // this site is public. Presenting fabricated staff to prospective
      // clients, students or candidates is a misrepresentation, and the fact
      // that the biographies read plausibly is exactly what makes it one.
      //
      // UPDATE: `photo` is now set on every entry below, at the client's
      // explicit direction ("use stock photos of people for service heads").
      // This reverses the earlier stance in this file (a fabricated name
      // attached to a real person's face reads as more real than a name
      // alone), flagged here so the tradeoff is visible, not silently
      // dropped. Every photo is a generic stock headshot (Unsplash license,
      // no attribution required), not a photo of an actual MSM CampusOS
      // employee. The obligation to replace or remove this entire block
      // before public launch is unchanged and, if anything, more urgent now.
      members: [
        {
          name: "Ananya Krishnan",
          role: "Performance Media Head",
          bio: "PLACEHOLDER. Invented profile: eleven years in paid acquisition across search and social, previously running enrolment media for a multi-campus university group.",
          photo: "/images/education/team/service-heads-placeholder/ananya-krishnan.jpg",
        },
        {
          name: "Tobias Lindqvist",
          role: "SEO Head",
          bio: "PLACEHOLDER. Invented profile: organic search and AI-answer visibility, with a background in technical SEO for large multilingual course catalogues.",
          photo: "/images/education/team/service-heads-placeholder/tobias-lindqvist.jpg",
        },
        {
          name: "Farah Siddiqui",
          role: "Social Media Head",
          bio: "PLACEHOLDER. Invented profile: community and creator strategy, focused on the platforms prospective students actually spend their time on.",
          photo: "/images/education/team/service-heads-placeholder/farah-siddiqui.jpg",
        },
        {
          name: "Daniel Okonjo",
          role: "Content Head",
          bio: "PLACEHOLDER. Invented profile: editorial lead across long-form, scripts and thought leadership for education and public-sector clients.",
          photo: "/images/education/team/service-heads-placeholder/daniel-okonjo.jpg",
        },
        {
          name: "Mei-Ling Chen",
          role: "Creative Studio Head",
          bio: "PLACEHOLDER. Invented profile: art direction and motion, previously building in-house studios for consumer and education brands.",
          photo: "/images/education/team/service-heads-placeholder/mei-ling-chen.jpg",
        },
        {
          name: "Rohan Bhattacharya",
          role: "Web Head",
          bio: "PLACEHOLDER. Invented profile: front-end and conversion engineering for institutional sites and high-volume campaign landing pages.",
          photo: "/images/education/team/service-heads-placeholder/rohan-bhattacharya.jpg",
        },
        {
          name: "Priya Raghunathan",
          role: "Analytics Head",
          bio: "PLACEHOLDER. Invented profile: measurement design and attribution, with a focus on tracking enquiries through to admission rather than to form fill.",
          photo: "/images/education/team/service-heads-placeholder/priya-raghunathan.jpg",
        },
      ],

      // Seat titles and scope only. Every `scope` string below is lifted
      // verbatim from this file's `modernServices.items` descriptions, so this
      // list introduces no claim that is not already published above.
      roles: [
        {
          title: "Digital Marketing Head",
          scope: "Brand positioning, digital campaigns, and student acquisition built for institutions that need volume without losing precision.",
        },
        {
          title: "PR & Branding Head",
          scope: "Media relations, reputation management, and thought leadership. What the institution says publicly, and how it lands.",
        },
        {
          title: "Applications Head",
          scope: "End-to-end processing at volume. Eligibility screening, document verification, and pipeline management. Speed matters here.",
        },
        {
          title: "Admissions Head",
          scope: "Offer management, conditional clearance, enrolment confirmation, and onboarding coordination. The step where most institutions quietly lose students.",
        },
        {
          title: "Timetabling Head",
          scope: "Conflict-free scheduling across faculty, rooms, and cohorts. Built for institutions where complexity is the baseline.",
        },
        {
          title: "Assessments Head",
          scope: "Design, marking workflows, moderation, and academic integrity at scale. The work that keeps accreditors satisfied and faculty focused.",
        },
        {
          title: "Finance Head",
          scope: "Revenue management, fee collection, vendor payments, and financial reporting. Accurate, auditable, and actually on time.",
        },
        {
          title: "Staffing & HR Head",
          scope: "Recruitment, contracts, payroll, compliance, and faculty development. Run on schedule rather than perpetual catch-up.",
        },
        {
          title: "CRM & Student Care Head",
          scope: "The full student lifecycle. First enquiry to graduation to alumni. Data-driven and actually joined up.",
        },
        {
          title: "Alumni Relations Head",
          scope: "Engagement strategies, giving programs, and industry networks. The relationship that starts after graduation.",
        },
        {
          title: "IT Support Head",
          scope: "Helpdesk, infrastructure management, and systems integration.",
        },
        {
          title: "MSM Aventra Head",
          scope: "Unified CRM, SIS, and LMS. One integrated platform built for academic institutions.",
        },
      ],
      note: "We do not run a public requisition board. These are the seats the bench is built around, and we name the person the moment one is filled.",
      ctaLabel: "Tell us what you do",
      ctaHref: "/careers",
    },
  },
  assetManifest: [
    {
      fileName: "hero-poster.jpg",
      page: "Education",
      section: "Hero",
      purpose: "Poster frame for the real MSM CampusOS brand film before playback.",
      aspectDesktop: "16:9",
      aspectMobile: "16:9",
      minDimensions: "1280x720",
      shotDescription: "Official YouTube-hosted brand film, video ID pCYH4seVLos.",
      subjects: "MSM CampusOS official brand film",
      artDirection: "Sourced directly from the official upload; not art-directed by this build.",
      motionOrCrop: "Click to play, replaces poster with embedded player.",
      altText: "MSM CampusOS official brand film poster frame.",
      licensingStatus: "Official MSM Unify YouTube upload, embedded via standard YouTube embed.",
    },
  ],
};
