# Implementation notes

## Context

No existing MSM CampusOS website repository was available to extend, so this is a fresh
Next.js 16 (App Router, TypeScript, Tailwind v4) build rather than an in-place addition to a
live codebase. Brand tokens (red `#E8252A`, charcoal `#1A1A1A` / `#2E2A28`, off-white
`#FAF9F7`, Poppins body / Inter display type, sharp corners) were extracted live from
`https://www.msmunify.com/campusos/` via computed styles, not guessed.

## Routes

- `/campusos` — lightweight hub page linking to the three industry pages (not the existing
  institution page, which doesn't exist in this fresh repo; built only so navigation,
  breadcrumbs, and internal linking have somewhere real to point).
- `/campusos/automotive`
- `/campusos/healthcare`
- `/campusos/real-estate`
- `/campusos/contact` — shared "Start a conversation" form, used by every primary CTA.

## Stack and dependencies added

- `next@16.3.0`, `react@19.2.8` (create-next-app default scaffold: TypeScript, Tailwind v4,
  ESLint, App Router, `src/` dir).
- `gsap@^3.15` — the only dependency added beyond the scaffold, for ScrollTrigger-driven
  storytelling per the brief's explicit motion requirements.

## Motion system and the bug it required fixing

Each industry's story sequence is its own component (`PinnedJourney` for automotive,
`CalmReveal` for healthcare, `SpatialReveal` for real estate) rather than one component with
branching props, so the three pages don't converge on a shared layout.

Initial versions of `PinnedJourney` and `SpatialReveal` decided, on every render, whether to
show the GSAP-pinned experience or the static fallback based on a live `matchMedia` listener
for `prefers-reduced-motion` and `pointer: coarse`. That caused a real crash
(`NotFoundError: Failed to execute 'insertBefore' on 'Node'`) on mobile viewports: GSAP's
`pin: true` wraps the pinned element in a `.pin-spacer` div it manages outside React, and if
device-capability detection changes the branch mid-session, React tries to tear down or
reconcile a subtree GSAP has already reparented. Fixed by adding
`useEnableScrollMotion()` (`src/lib/motion.ts`): it always starts `false` (so server and first
client paint match exactly, no hydration correction) and flips to `true` in a one-time mount
effect only on a fine pointer with no reduced-motion preference, strictly before GSAP's own
effect can run. GSAP now only ever mounts onto a tree that has already settled. Verified fixed
at 375px width on all three pages after the change.

## Case studies

`src/content/case-studies.ts` implements the requested `IndustryCaseStudy` schema. All three
seed records are `status: "draft"`, so `CaseStudyFeature` renders the required holding state
("Selected work will be added following client approval.") on every page today. No invented
client names, quotes, or metrics are seeded anywhere.

## Contact form

`src/components/industry/ContactForm.tsx` has real client-side validation (required fields,
email format), loading/success/error states, labeled fields (no placeholder-as-label), and an
explicit line asking users not to submit health or other sensitive data. Submission is a
simulated 700ms delay — no external send is wired up, since no CRM/mail endpoint or
authorization for one was provided.

## Design polish pass (taste-skill audit)

After the initial build, ran a taste/UI-UX audit against the site as a "redesign, preserve
brand" case (real tokens already extracted from the live site, so this wasn't a greenfield
aesthetic choice). Findings and fixes:

- **Real accessibility bug**: `.btn-secondary:hover` set the hover text color to `var(--surface)`,
  which flips to white in light mode. On a white hover fill, that produced invisible white
  text on white. Fixed to `var(--surface-inverse)` (a fixed dark value that never flips with
  the OS color scheme), verified visually on the real-estate hero's "Explore our capabilities"
  button.
- **Eyebrow overuse**: had 5 small-caps section labels across 9 sections per page (hero,
  engagement model, governance, modern services, case studies). Cut to 3 (hero, modern
  services, governance) by dropping the other two and letting their headlines stand alone.
- **Hero top padding**: was `pt-40` (10rem) on the hero's inner content wrapper, above the
  audit's 6rem cap. It had no visible effect given the `items-end` bottom alignment, so
  dropped to `pt-8`.
- **Split-header pattern**: `PointOfView` was a bare "sticky headline left, paragraphs right"
  layout with no visual in the second column, which the audit flags as a default anti-pattern
  unless the right column carries a real visual. Added `SystemDiagram` (see below) under the
  paragraphs, which resolves it with a compositional reason rather than removing the layout.
- **Real photography**: swapped the 3 hero placeholders for real, CC0-licensed photography
  (car interior, hospital reception, living room) plus one supporting image per page (alloy
  wheel, hospital hallway, glass facade), all sourced from Wikimedia Commons and verified
  license-clean. See `ASSET_MANIFEST.md` for full credits. No image-generation API key was
  configured in this environment; the user chose free stock photography over supplying one.
- **New `SystemDiagram` component** (`src/components/industry/SystemDiagram.tsx`): an SVG
  hub-and-spoke diagram (Strategy, Brand and creative, Media and distribution, Digital
  experience, Data and measurement, all connected through MSM CampusOS) used once per page in
  `PointOfView`. This is the "graph" the polish pass asked for; it is intentionally a
  relationship diagram, not a data chart, since there is no approved client data to plot and
  the brief explicitly bans invented metrics.
- **New `ImageBreak` component** (`src/components/industry/ImageBreak.tsx`): a full-bleed
  photo section with a plain credit line underneath, used once per page between the capability
  tabs and the modern-services list.

## Checks run

- `npx tsc --noEmit` — clean.
- `npx eslint .` — clean (flat config, `@next/eslint-plugin-next` defaults).
- `npm run build` — all 7 routes prerender as static content, no errors.
- Manual browser verification (desktop 1280px and mobile 375px): all three hero sections fit
  `100dvh`, capability tabs switch correctly, contact form validation/success states work,
  mobile nav opens/closes, no console errors after the motion fix, internal links resolve.

## Known gaps / not done

- Hero and one supporting image per page are now real CC0 photography; the per-moment
  story-sequence tiles (8 automotive, 5 healthcare, 7 real estate) are still labeled
  placeholders. See `ASSET_MANIFEST.md` for exact shot specs and current status per file.
- No real logo file: header/footer use a text lockup standing in for the official MSM Unify
  logo (see comment in `src/components/layout/MSMLogo.tsx`).
- No Lighthouse run was performed in this environment; LCP/INP/CLS targets are addressed
  architecturally (static prerendering, `next/font`, reserved media aspect ratios, minimal
  client JS) but not measured against real hardware.
- Contact form has no real backend — needs a CRM/mail integration and explicit authorization
  before it can send anything externally.
- No case study content exists yet; the schema and holding state are ready for real,
  client-approved records.
- `robots.txt` / `sitemap.xml` were not generated — add via Next's `app/sitemap.ts` and
  `app/robots.ts` conventions once the production domain and any non-indexed routes are
  confirmed.
