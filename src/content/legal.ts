/**
 * Copy for /privacy-policy and /cookie-policy.
 *
 * This is SOTAPO's own policy for this marketing site, not the MSM Unify
 * student-portal privacy policy the footer used to link out to. That policy
 * is written for prospective students handing over admissions documents; this
 * site collects a much narrower, different set of data (enquiry forms, an
 * audit questionnaire, careers applications, and OSiQ chat transcripts), so it
 * needed its own notice rather than borrowing one written for a different
 * audience and a different kind of data.
 *
 * Not a substitute for review by counsel before this goes live: the facts
 * below (what is collected, where it is stored, who it is shared with) are
 * accurate to this codebase as built, but the legal framing should be
 * checked against current DPDPA rules and any other jurisdiction SOTAPO
 * actively markets into before this is treated as final.
 */
export const legal = {
  privacy: {
    metaTitle: "Privacy Policy",
    metaDescription:
      "How SOTAPO collects, uses, and protects the personal data submitted through this site's forms and OSiQ chat.",
    updated: "September 2026",
    intro:
      "This policy covers only this SOTAPO site and the forms, chat, and pages on it. It does not cover the MSM Unify student portal or any other MSM Unify property, each of which runs under its own notice.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Contact form: name, work email, company or institution, and your message.",
          "Free audit questionnaire: your industry, primary goal, the services you are weighing up, a budget band, a description of your bottleneck, your website address, and your name, email, and organisation.",
          "Careers applications: whatever you choose to submit against an open role.",
          "OSiQ, the chat assistant: the conversation itself, and, where you volunteer them in the course of that conversation, your name, email, organisation, industry, goal, and budget, extracted automatically so the team can follow up.",
          "Technical data: standard request metadata (such as IP address) logged briefly for rate-limiting and abuse prevention, not used to build a marketing profile of you.",
        ],
      },
      {
        heading: "Sensitive personal data, especially health information",
        body: [
          "Please do not include health information, patient records, or other special-category personal data in any form field or in a conversation with OSiQ, unless it is genuinely necessary to describe a Healthcare-industry marketing enquiry.",
          "Where such information is shared anyway, we treat it as sensitive personal data: access is restricted to the team members who need it to respond to you, and it is not used for any purpose beyond that enquiry.",
        ],
      },
      {
        heading: "Why we collect it",
        body: [
          "To reply to the enquiry, audit request, or careers application you submitted.",
          "To let OSiQ answer follow-up questions in the same conversation and hand qualified conversations to the team.",
          "To keep a business record of enquiries, and to improve the accuracy of OSiQ's answers over time.",
          "We do not use what you submit for advertising, and we do not sell it.",
        ],
      },
      {
        heading: "Where it is stored, and who can see it",
        body: [
          "Submissions are stored in a Postgres database (hosted on Neon) behind this site, deployed on Vercel. Both are infrastructure providers processing data on our instruction, not independent recipients of it.",
          "Access inside SOTAPO and MSM CampusOS is limited to the people who need it to respond to you or run the site.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Submissions are kept for as long as reasonably needed to respond to your enquiry and to keep a business record of it, and are deleted or anonymised once that purpose has passed.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "If you are in India, the Digital Personal Data Protection Act, 2023 gives you the right to access, correct, and erase your personal data, and to withdraw any consent you gave, as a Data Principal.",
          "If you are elsewhere, we honour the equivalent rights under the law that applies to you, on the same basis, on a best-efforts footing.",
          "To exercise any of these, use the contact form and mark your message 'Privacy request'. We will action it directly rather than routing it through a general enquiry queue.",
        ],
      },
      {
        heading: "Security",
        body: [
          "Data submitted through this site travels encrypted in transit, and access to it is restricted to the people who need it. No system is unbreakable, and we cannot guarantee absolute security, but we do not treat this as a checkbox.",
        ],
      },
      {
        heading: "Children",
        body: [
          "This site is not directed at children, and we do not knowingly collect personal data from anyone under 18 through it.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "See the Cookie Policy for what this site currently sets and why.",
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "If what we collect or how we use it changes materially, this page will be updated and the date above will move.",
        ],
      },
    ],
  },
  cookies: {
    metaTitle: "Cookie Policy",
    metaDescription:
      "What cookies this site sets today, why, and how to manage them.",
    updated: "September 2026",
    intro:
      "This site is built to need as few cookies as possible. Here is the honest current state, not a boilerplate list of categories that may not apply.",
    sections: [
      {
        heading: "What this site sets today",
        body: [
          "This site does not currently run analytics, advertising, or marketing cookies.",
          "Any cookie strictly necessary for a page to function (for example, remembering that a dialog is open during your visit) is session-scoped and is not used to track you across visits or other sites.",
        ],
      },
      {
        heading: "Third-party cookies from embedded content",
        body: [
          "The education page embeds a YouTube video. If you choose to press play, YouTube and Google may set their own cookies as part of running that player, under their own privacy and cookie policies, not ours.",
        ],
      },
      {
        heading: "Managing cookies",
        body: [
          "You can block or delete cookies through your browser's own settings at any time. Because this site does not depend on tracking cookies to function, doing so should not break anything here.",
        ],
      },
      {
        heading: "If this changes",
        body: [
          "If analytics or marketing cookies are added later, this notice will be updated first, and a consent banner will ask for your choice before any non-essential cookie is set, wherever that is legally required.",
        ],
      },
    ],
  },
};
