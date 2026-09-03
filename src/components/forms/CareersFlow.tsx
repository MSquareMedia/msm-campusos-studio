"use client";

import { StepFlow, SuccessPanel } from "./StepFlow";
import type { StepDef } from "./types";
import { careers } from "@/content/careers";
import { choiceRequired, email, fullName, minLength, optionalUrl } from "./validators";

/**
 * SOTAPO does not run a public requisition board, `careers.ts` says so
 * outright. So this is an open application against the five real disciplines
 * the team is built around, taken straight from the content file. No invented
 * job titles, seniority ladders, locations, or salary bands appear anywhere.
 */
// No hint line here on purpose: the accordion directly above already carries
// each discipline's full description, and clipping that description down to a
// one-clause hint produced fragments like "Search." and "Websites."
const disciplineOptions = careers.roles.categories.map((category) => ({
  value: category.title.toLowerCase().replace(/[^a-z]+/g, "-"),
  label: category.title,
}));

const steps: StepDef[] = [
  {
    id: "discipline",
    eyebrow: "Discipline",
    question: "Which lane is yours?",
    help: "These are the disciplines the team is built around, not open postings.",
    fields: [
      {
        kind: "choice",
        name: "discipline",
        label: "Your discipline",
        validate: choiceRequired("Pick the lane closest to your work."),
        options: [
          ...disciplineOptions,
          { value: "other", label: "None of these", hint: "The best additions usually do not fit the org chart yet." },
        ],
      },
    ],
  },
  {
    id: "experience",
    eyebrow: "Experience",
    question: "How long have you been doing this?",
    fields: [
      {
        kind: "choice",
        name: "experience",
        label: "Years in the discipline",
        validate: choiceRequired("Choose the range that fits."),
        options: [
          { value: "0-2", label: "Under 2 years" },
          { value: "2-5", label: "2 – 5 years" },
          { value: "5-10", label: "5 – 10 years" },
          { value: "10+", label: "More than 10 years" },
        ],
      },
    ],
  },
  {
    id: "portfolio",
    eyebrow: "Proof",
    question: "Where can we see the work?",
    help: "Portfolio, LinkedIn, GitHub, a case study, a campaign that ran. Whatever shows the craft.",
    fields: [
      {
        kind: "text",
        name: "portfolio",
        type: "url",
        label: "Link to your work",
        example: "yourname.com",
        autoComplete: "url",
        help: "Optional, but it is the fastest way to be taken seriously.",
        emptyLabel: "No link given",
        validate: optionalUrl,
      },
    ],
  },
  {
    id: "why",
    eyebrow: "Why here",
    question: "Why this team?",
    help: "We would rather read three honest sentences than a cover letter.",
    fields: [
      {
        kind: "textarea",
        name: "why",
        label: "Why SOTAPO",
        rows: 5,
        maxLength: 700,
        validate: minLength(
          25,
          "Tell us why this team, it is the part we actually read.",
          "A few more words. Three honest sentences beat one polished line.",
        ),
      },
    ],
  },
  {
    id: "details",
    eyebrow: "You",
    question: "How do we reach you?",
    fields: [
      { kind: "text", name: "name", label: "Full name", autoComplete: "name", validate: fullName },
      {
        kind: "text",
        name: "email",
        type: "email",
        label: "Email",
        example: "you@example.com",
        autoComplete: "email",
        validate: email,
      },
    ],
  },
];

export function CareersFlow() {
  return (
    <StepFlow
      idPrefix="careers"
      kind="careers"
      steps={steps}
      reviewQuestion="Check it, then send it."
      reviewHelp="This is your whole application. Edit anything you want to sharpen."
      submitLabel="Send my application"
      renderSuccess={(values, restart) => (
        <SuccessPanel
          heading={values.name?.trim() ? `Filed, ${values.name.trim()}.` : "Filed."}
          lead="You answered every question without hiding behind a template. That is most of what we look for."
          honestNote="Your application has been saved to the SOTAPO intake and the team can see it. There is no live requisition board, so we cannot promise a specific role or a reply date."
          restartLabel="Start again"
          onRestart={restart}
        >
          <div
            className="border p-6"
            style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
          >
            <p className="font-display text-sm font-semibold">What we would do with this</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {careers.roles.intro}
            </p>
          </div>
        </SuccessPanel>
      )}
    />
  );
}
