# Submission capture + admin

Audit, contact, and careers submissions are written to Postgres and read back at
`/admin/submissions`. Case studies are editable at `/admin/case-studies` — see
the section below.

## 1. Attach a Postgres store

In the Vercel dashboard for this project: **Storage → Create Database →
Postgres (Neon)**, then connect it to the project. Vercel injects
`DATABASE_URL` / `POSTGRES_URL` automatically on the next deploy.

No migration step is needed. The `submissions` table is created on first write.

## 2. Set the admin password

Add an environment variable in **Settings → Environment Variables**:

```
ADMIN_PASSWORD=<a long random string>
```

Then redeploy so it takes effect.

`/admin/*` is gated by HTTP Basic auth in `src/middleware.ts`. Any username
works; only the password is checked. **If `ADMIN_PASSWORD` is unset, `/admin`
returns 503 rather than being publicly readable** — a missing variable must
never expose submitted personal data.

## 3. Local development

Create `.env.local` (already gitignored):

```
DATABASE_URL=postgres://...
ADMIN_PASSWORD=devpassword
```

Without `DATABASE_URL`, the site still builds and every marketing page renders.
Submitting a form returns a 503 and the form tells the user plainly that nothing
was saved, rather than showing a success state for a lost submission.

## What is stored

One row per submission: `kind` (audit / contact / careers), the answers as
JSONB, and a timestamp. Whatever the visitor typed is what gets stored, which
includes their name, email, and organisation.

## 4. Rate limiting (Redis)

`src/lib/rate-limit.ts` uses Redis so limits hold across serverless instances.
In the Vercel dashboard: **Storage → Create Database → Upstash Redis**, connect
it to the project. That injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or
the `UPSTASH_REDIS_REST_*` equivalents); both naming schemes are accepted.

Current limits:

| Endpoint | Limit |
|---|---|
| `/api/osiq` | 12 requests / minute / IP |
| `/api/submissions` | 8 requests / minute / IP |

**Without Redis it falls back to per-instance memory and logs a warning once.**
That fallback is weaker than the stated limit by roughly the number of running
instances, so attach Redis before this sees real traffic — every OSiQ message
bills the Anthropic key.

## 5. OSiQ

Set `ANTHROPIC_API_KEY` (mark it Sensitive). Without it the chat says so in
character rather than faking an answer.

OSiQ answers **two** questions, then hands over to Nikhil Sharda and Mudit
Kalia and asks for contact details. That cap is enforced in the route handler
by counting assistant turns, not just requested in the prompt — a prompt is a
preference, and anyone can POST a trimmed message array. Change `FREE_ANSWERS`
in `src/app/api/osiq/route.ts` to adjust it.

## 6. Case studies CMS

Every case study / portfolio card is editable at `/admin/case-studies`
(create, edit, delete), gated by the same Basic auth as `/admin/submissions`.

**Storage.** Uses the same Postgres store as submissions (step 1) — a
`case_studies` table, one row per slug, created automatically on first write.
No separate database needed.

**How it works with no database attached.** The public site (industry pages,
`/campusos/work`, `/campusos/case-studies`, the homepage) always reads from
this table when a database is attached. With no database, everything falls
back to the static content in `src/content/case-studies.ts` and
`src/content/portfolio.ts` — the site behaves exactly as it did before this
CMS existed, and `/admin/case-studies` shows that static content read-only
(edits there will 503 until a database is attached).

**First write seeds the table.** The first time the table is read with a
database attached, it is seeded once from the current static content — so
attaching a database doesn't wipe or change anything already live. From then
on, the database is the source of truth; the static files stay in the repo as
that seed and as the offline fallback, but editing them after the table is
seeded has no effect on the live site.

**Freshness.** Case-study pages use ISR with a 60-second revalidation window,
and every write also calls `revalidatePath` on the affected pages directly —
in practice an edit shows up on the next request, not after a minute.

**Editing model.** One admin form covers both the portfolio card (title,
image, summary) and, when present, the full case-study narrative (challenge,
idea, execution, results with source notes, testimonial). Leaving challenge
and idea blank keeps an entry as a portfolio-only card with no detail page
narrative — matching pieces like TIGC or OMNIYAT today. Array fields (scope,
execution, services) are edited as one item per line; results are
`value | label | source note` one per line.

**Images.** The form takes an image *path* (e.g.
`/images/education/case-studies/example-hero.jpg`), not a file upload — the
actual file still needs to be added to `public/images/...` in the repo and
deployed. There is no image upload in this admin yet.

## Known gaps, deliberately not solved here

- **No spam defence.** There is no captcha or honeypot. If this page gets
  scraped, expect junk rows.
- **No spend cap on the model API.** The rate limit bounds requests per IP, not
  total monthly cost. Set a budget alert in the Anthropic console.
- **No notification.** Nobody is emailed when a submission arrives; someone has
  to open `/admin/submissions`. Wire a notifier (Resend, Slack webhook) in the
  route handler if that matters.
- **Personal data.** Submissions contain personal data, so retention, access,
  and deletion are now a real obligation. There is currently no deletion UI and
  no retention policy.
- **No image upload in the case-studies admin.** Editors can only point at an
  image path that already exists under `public/images/`; getting a new photo
  onto the site still needs a code deploy.
- **No audit trail on case-study edits.** Writes overwrite the row directly;
  there is no history or undo beyond redeploying the seed.
