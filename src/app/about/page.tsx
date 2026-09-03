import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import { buildMetadata, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";
import { scrollGradientStyle } from "@/lib/theme";
import { homepage } from "@/content/homepage";
import { education } from "@/content/education";
import { about } from "@/content/about";
import { toLines } from "@/lib/text";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ServiceLeadership } from "@/components/industry/ServiceLeadership";
import { FinalCTA } from "@/components/industry/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: "About SOTAPO: the team behind the growth",
  description:
    "SOTAPO is built by a team with 14+ years in education marketing exclusively, now applying that same connected standard to automotive, healthcare, real estate, and beyond. Meet the people and the standard behind the work.",
  path: "/about",
});

function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Masthead mark for each chapter: an oversized numeral against a plain
 *  label. Doing the numbering typographically means the page can chapter
 *  itself without four identical uppercase eyebrows down the left edge. */
function ChapterMark({ numeral, label }: { numeral: string; label: string }) {
  return (
    <FadeUp y={10}>
      <div className="flex items-baseline gap-4">
        <span
          className="font-display text-3xl font-extrabold leading-none md:text-5xl"
          style={{ color: "var(--brand-accent)" }}
          aria-hidden="true"
        >
          {numeral}
        </span>
        <span className="font-display text-sm font-semibold text-[var(--text-muted)]">{label}</span>
      </div>
    </FadeUp>
  );
}

export default function AboutPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: "About", path: "/about" },
  ]);
  const org = organizationJsonLd();

  const proofStats = education.proofStats;

  return (
    <>
      <Script
        id="about-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="about-org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />

      {/* This page has no dark hero to preserve, the opening is already on
          the plain page background, so the white-to-peach gradient starts
          immediately and runs through to the final CTA, same treatment as
          every other page. */}
      <div style={scrollGradientStyle}>
      {/* Opening. Quiet and editorial, no CTA: the homepage already owns the
          hero-with-buttons job, and About should read like the first page of a
          piece of writing rather than another landing-page top. */}
      <section>
        <div className="container-page pt-24 pb-16 md:pt-32 md:pb-20">
          <TextReveal
            as="h1"
            onMount
            lines={toLines(about.statement.line)}
            className="font-display max-w-[18ch] text-[clamp(2.5rem,8vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight md:text-7xl"
          />
          <FadeUp delay={0.25} onMount>
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-[var(--text-muted)] md:ml-auto md:text-xl">
              {about.statement.body}
            </p>
          </FadeUp>
        </div>

        {/* The page's one full-bleed frame, immediately after the statement.
            Attribution is a licence condition on this photograph and travels
            with it. */}
        <ScrollReveal
          src="/images/education/campus-break.jpg"
          alt="Red-brick university campus buildings along a quiet street at dusk"
          priority
          sizes="100vw"
          frameClassName="h-[52vh] w-full md:h-[74vh]"
        />
        <div className="container-page">
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Photography by Dayne Topkin, via Wikimedia Commons (CC0).
          </p>
        </div>
      </section>

      {/* Chapter I: origin. */}
      <section className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="container-page py-24 md:py-32">
          <ChapterMark numeral={about.chapters.origin.numeral} label={about.chapters.origin.label} />
          <TextReveal
            lines={toLines(education.pov.heading)}
            className="font-display mt-8 max-w-[16ch] text-3xl font-bold leading-[1.04] md:text-6xl"
          />
          <div className="mt-10 flex max-w-2xl flex-col gap-6 md:ml-auto">
            {education.pov.body.map((paragraph, i) => (
              <FadeUp key={i} y={14} delay={i * 0.06}>
                <p className="text-lg leading-relaxed text-[var(--text-muted)] md:text-xl">
                  {paragraph}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter II: people. Two beats, the leadership voice then the bench,
          told magazine-style rather than as a flat grid of identical cards. */}
      {education.team && (
        <section className="border-t" style={{ borderColor: "var(--border)" }}>
          <div className="container-page py-24 md:py-32">
            <ChapterMark
              numeral={about.chapters.people.numeral}
              label={about.chapters.people.label}
            />
            <TextReveal
              lines={toLines(education.team.heading)}
              className="font-display mt-8 max-w-2xl text-3xl font-bold leading-[1.06] md:text-5xl"
            />
            <FadeUp delay={0.12}>
              <p className="mt-5 max-w-xl text-lg text-[var(--text-muted)]">
                {education.team.intro}
              </p>
            </FadeUp>

            {education.team.quotes.length > 0 && (
              <div
                className="mt-16 grid gap-12 border-t pt-12 md:grid-cols-2 md:gap-16"
                style={{ borderColor: "var(--border)" }}
              >
                {education.team.quotes.map((q, i) => (
                  <FadeUp key={q.name} y={16} delay={i * 0.07}>
                    <blockquote className="flex h-full flex-col gap-6">
                      <p className="font-display text-xl leading-snug md:text-2xl">
                        &ldquo;{q.quote}&rdquo;
                      </p>
                      <footer className="mt-auto flex items-center gap-4">
                        {q.photo ? (
                          <div
                            className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full"
                            style={{ background: "var(--surface-muted)" }}
                          >
                            <Image
                              src={q.photo}
                              alt={q.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className="font-display flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-base font-bold"
                            style={{
                              background: "var(--surface-inverse)",
                              color: "var(--brand-accent)",
                            }}
                            aria-hidden="true"
                          >
                            {initials(q.name)}
                          </div>
                        )}
                        <span className="text-sm text-[var(--text-muted)]">
                          <span className="font-display block font-semibold text-[var(--text)]">
                            {q.name}
                          </span>
                          {q.role}
                        </span>
                      </footer>
                    </blockquote>
                  </FadeUp>
                ))}
              </div>
            )}

            <div className="mt-20">
              <FadeUp>
                <p className="font-display text-sm font-semibold text-[var(--text-muted)]">
                  {about.chapters.people.benchLabel}
                </p>
              </FadeUp>
              <div
                className="mt-8 flex flex-col gap-16 border-t pt-12 md:gap-24"
                style={{ borderColor: "var(--border)" }}
              >
                {education.team.members.map((member, i) => (
                  <FadeUp key={member.name} y={20} delay={0.04}>
                    <div
                      className={`flex flex-col gap-8 md:items-center md:gap-14 ${
                        i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                      }`}
                    >
                      <div
                        className="group relative aspect-[4/5] w-full shrink-0 overflow-hidden md:w-[38%]"
                        style={{ background: "var(--surface-muted)" }}
                      >
                        {member.photo ? (
                          <Image
                            src={member.photo}
                            alt={member.name}
                            fill
                            sizes="(min-width: 768px) 38vw, 100vw"
                            className="object-cover transition-transform duration-[700ms] [transition-timing-function:var(--ease-out-strong)] group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div
                            className="font-display flex h-full items-center justify-center text-5xl font-bold"
                            style={{
                              background: "var(--surface-inverse)",
                              color: "var(--brand-accent)",
                            }}
                            aria-hidden="true"
                          >
                            {initials(member.name)}
                          </div>
                        )}
                      </div>
                      <div className="md:flex-1">
                        <h3 className="font-display text-2xl font-bold md:text-4xl">
                          {member.name}
                        </h3>
                        <p className="font-display mt-1 text-sm font-semibold text-[var(--text-muted)]">
                          {member.role}
                        </p>
                        <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--text-muted)]">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {education.team?.serviceLeadership && (
        <ServiceLeadership
          heading={education.team.serviceLeadership.heading}
          intro={education.team.serviceLeadership.intro}
          members={education.team.serviceLeadership.members}
          roles={education.team.serviceLeadership.roles}
          note={education.team.serviceLeadership.note}
          ctaLabel={education.team.serviceLeadership.ctaLabel}
          ctaHref={education.team.serviceLeadership.ctaHref}
        />
      )}

      {/* Chapter III: the standard. The five pillar titles as marks, not the
          itemized capability list that already lives on the homepage. */}
      <section className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="container-page py-24 md:py-32">
          <ChapterMark
            numeral={about.chapters.standard.numeral}
            label={about.chapters.standard.label}
          />
          <TextReveal
            lines={toLines(about.chapters.standard.heading)}
            className="font-display mt-8 max-w-[18ch] text-3xl font-bold leading-[1.04] md:text-6xl"
          />
          <FadeUp delay={0.12}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--text-muted)] md:text-xl">
              {about.chapters.standard.lead}
            </p>
          </FadeUp>
          <ol className="mt-12 border-t" style={{ borderColor: "var(--border)" }}>
            {homepage.serviceUniverse.groups.map((group, i) => (
              <li key={group.title} className="border-b" style={{ borderColor: "var(--border)" }}>
                <FadeUp
                  className="flex items-baseline gap-6 py-5 md:gap-10"
                  y={10}
                  delay={i * 0.05}
                >
                  <span className="font-display text-2xl font-bold md:text-4xl">{group.title}</span>
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Chapter IV: proof. Quiet numbers with footnoted sources, not a
          full-width stat band; the industry pages already carry that. */}
      {proofStats && (
        <section className="border-t" style={{ borderColor: "var(--border)" }}>
          <div className="container-page py-20 md:py-28">
            <ChapterMark
              numeral={about.chapters.proof.numeral}
              label={about.chapters.proof.label}
            />
            <div className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {proofStats.stats.map((stat, i) => (
                <FadeUp key={stat.label} y={10} delay={(i % 3) * 0.05}>
                  <div className="border-b py-6" style={{ borderColor: "var(--border)" }}>
                    <p className="font-display text-3xl font-bold tabular-nums md:text-5xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 max-w-[24ch] text-sm text-[var(--text-muted)]">
                      {stat.label}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}
      </div>

      <FinalCTA heading={homepage.finalCta.heading} body={homepage.finalCta.body} />
    </>
  );
}
