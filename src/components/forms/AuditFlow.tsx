"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { StepFlow, SuccessPanel } from "./StepFlow";
import type { ChoiceOption, StepDef } from "./types";
import { choiceRequired, email, fullName, minLength, websiteUrl } from "./validators";
import { allServices, serviceClusters } from "@/content/services";

/**
 * The assessment asks about the same service taxonomy the site publishes, read
 * straight off `src/content/services.ts` rather than retyped here. Add a
 * service there and it appears in this step; there is no second list to keep
 * in sync.
 *
 * Option labels only, no hints: fourteen two-line explanations would turn one
 * question into a page of reading. The group headings carry the orientation,
 * and the definitions live on the services section of the site.
 */
const serviceOptions: ChoiceOption[] = allServices.map((service) => ({
  value: service.id,
  label: service.name,
}));

const serviceGroups = serviceClusters.map((cluster) => ({
  label: cluster.label,
  values: cluster.services.map((service) => service.id),
}));

const steps: StepDef[] = [
  {
    id: "industry",
    eyebrow: "Industry",
    question: "Which world are you marketing in?",
    fields: [
      {
        kind: "choice",
        name: "industry",
        label: "Your industry",
        validate: choiceRequired("Pick the closest fit, you can add nuance in a moment."),
        options: [
          { value: "education", label: "Education", hint: "Institutions, recruitment, enrolment." },
          { value: "automotive", label: "Automotive", hint: "Brands, dealer networks, aftersales." },
          { value: "healthcare", label: "Healthcare", hint: "Providers, clinics, patient acquisition." },
          { value: "real-estate", label: "Real estate", hint: "Developments, agencies, place marketing." },
          { value: "other", label: "Something else", hint: "Tell us more on the next screens." },
        ],
      },
    ],
  },
  {
    id: "goal",
    eyebrow: "Objective",
    question: "What has to move in the next two quarters?",
    help: "One answer. The one your board would name first.",
    fields: [
      {
        kind: "choice",
        name: "goal",
        label: "Primary goal",
        validate: choiceRequired("Choose the goal that matters most right now."),
        options: [
          { value: "enquiries", label: "More qualified enquiries" },
          { value: "brand", label: "Launch or reposition the brand" },
          { value: "efficiency", label: "Bring acquisition cost down" },
          { value: "conversion", label: "Fix a site that gets traffic but not enquiries" },
          { value: "measurement", label: "Get measurement we can actually trust" },
        ],
      },
    ],
  },
  {
    id: "services",
    eyebrow: "Scope",
    question: "Which of these are you weighing up?",
    help: "Pick as many as apply, or as few. It tells us what to look at first; it is not a brief and it does not commit you to anything.",
    fields: [
      {
        kind: "multichoice",
        name: "services",
        label: "Services you want assessed",
        options: serviceOptions,
        groups: serviceGroups,
        validate: choiceRequired("Pick at least one, even if you are not sure yet."),
      },
    ],
  },
  {
    id: "spend",
    eyebrow: "Investment",
    question: "Roughly what goes into marketing each month?",
    help: "A band is fine. It tells us which levers are realistic, nothing more.",
    fields: [
      {
        kind: "choice",
        name: "spend",
        label: "Monthly marketing spend",
        validate: choiceRequired("Pick a band so we know which levers are on the table."),
        options: [
          { value: "none", label: "Nothing on paid media yet" },
          { value: "lt-10k", label: "Under $10,000" },
          { value: "10-50k", label: "$10,000 – $50,000" },
          { value: "50-200k", label: "$50,000 – $200,000" },
          { value: "gt-200k", label: "Over $200,000" },
        ],
      },
    ],
  },
  {
    id: "bottleneck",
    eyebrow: "Bottleneck",
    question: "Where does it break?",
    help: "The part you would fix first if you could only fix one thing.",
    fields: [
      {
        kind: "textarea",
        name: "bottleneck",
        label: "The biggest bottleneck",
        rows: 5,
        maxLength: 600,
        validate: minLength(
          20,
          "Describe what is going wrong, this is the part the audit starts from.",
          "A sentence or two, please. We need enough to know where to look.",
        ),
      },
    ],
  },
  {
    id: "website",
    eyebrow: "Your site",
    question: "Where should we start looking?",
    fields: [
      {
        kind: "text",
        name: "website",
        type: "url",
        label: "Website address",
        example: "msmunify.com",
        autoComplete: "url",
        validate: websiteUrl,
      },
    ],
  },
  {
    id: "contact",
    eyebrow: "You",
    question: "Who are we sending this back to?",
    fields: [
      {
        kind: "text",
        name: "name",
        label: "Full name",
        autoComplete: "name",
        validate: fullName,
      },
      {
        kind: "text",
        name: "email",
        type: "email",
        label: "Work email",
        example: "you@organisation.edu",
        autoComplete: "email",
        validate: email,
      },
      {
        kind: "text",
        name: "organisation",
        label: "Organisation",
        help: "Optional. Skip it if the email already says it.",
        autoComplete: "organization",
        emptyLabel: "Not given",
      },
    ],
  },
];

export function AuditFlow() {
  return (
    <StepFlow
      idPrefix="audit"
      kind="audit"
      steps={steps}
      reviewQuestion="Read it back before it goes."
      reviewHelp="Change anything that is not right. Everything below is what the audit will be built from."
      submitLabel="Request the audit"
      renderSuccess={(values, restart) => (
        <SuccessPanel
          heading="That is everything we need."
          // Greet with the whole name as given. Splitting on the first space
          // turns "Dr Amara Osei" into "Dr" and mononyms into nonsense.
          lead={`Seven answers, one site to look at, and a clear first thing to fix${
            values.name?.trim() ? `, ${values.name.trim()}` : ""
          }.`}
          honestNote="Your answers have been saved to the SOTAPO intake and the team can see them. We have not set a turnaround promise here, so if this is time-sensitive, reach out through the contact page as well."
          restartLabel="Start over"
          onRestart={restart}
        >
          <div className="border p-6" style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}>
            <p className="font-display text-sm font-semibold">What happens on our side</p>
            <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm text-[var(--text-muted)]">
              <li>We read the site the way one of your prospects would, on a phone, cold.</li>
              <li>We map where the journey from attention to enquiry drops people.</li>
              <li>We write up what we found, including what we could not assess.</li>
            </ol>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold
                         transition-transform duration-200 [transition-timing-function:var(--ease-out-strong)]
                         hover:translate-x-0.5 active:scale-[0.97]"
              style={{ color: "var(--brand-accent-dark)" }}
            >
              Talk to the team instead
              <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </SuccessPanel>
      )}
    />
  );
}
