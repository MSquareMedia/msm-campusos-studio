import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { CountUpStat } from "./CountUpStat";
import { portfolio } from "@/content/portfolio";
import type { IndustryCaseStudy } from "@/content/types";

/**
 * Work, shown as work. The featured engagement now leads with its own
 * photograph at close to full width, with the numbers set against it rather
 * than boxed off to the side, and the supporting engagements become image
 * tiles that link into their detail pages. A case study section built entirely
 * out of bordered text panels is the one place on an agency site where an
 * absence of pictures is read as an absence of work.
 */
export function CaseStudyFeature({
  industryLabel,
  caseStudies,
}: {
  industryLabel: string;
  caseStudies: IndustryCaseStudy[];
}) {
  const [featured, ...supporting] = caseStudies;
  const featuredPiece = featured
    ? portfolio.find((p) => p.caseStudyId === featured.id)
    : undefined;

  return (
    <section className="container-page py-24 md:py-36">
      <TextReveal
        lines={[`${industryLabel} engagements`]}
        className="font-display max-w-2xl text-3xl font-bold leading-[1.06] md:text-5xl"
      />

      {!featured ? (
        <FadeUp className="mt-12">
          <div
            className="flex min-h-[220px] flex-col items-start justify-center gap-3 border-t pt-10"
            style={{ borderColor: "var(--border)" }}
          >
            <Clock size={26} weight="light" color="var(--text-muted)" aria-hidden="true" />
            <p className="max-w-md text-lg text-[var(--text-muted)]">
              Selected work will be added following client approval.
            </p>
          </div>
        </FadeUp>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <FadeUp y={20}>
            {featuredPiece && (
              <Link
                href={`/work/${featuredPiece.slug}`}
                className="group relative block aspect-[16/10] w-full overflow-hidden"
              >
                <Image
                  src={featuredPiece.image}
                  alt={featuredPiece.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover transition-transform duration-[600ms] [transition-timing-function:var(--ease-out-strong)] group-hover:scale-105"
                />
                <span
                  className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 p-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.7), transparent)" }}
                >
                  <span className="font-display text-sm font-semibold">Read the case study</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </Link>
            )}
            <article className={featuredPiece ? "mt-8" : ""}>
              {featured.geography && (
                <p className="eyebrow text-[var(--text-muted)]">
                  {featured.approvedClientLabel} &middot; {featured.geography}
                </p>
              )}
              <h3 className="font-display mt-3 text-2xl font-bold md:text-3xl">{featured.title}</h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">
                {featured.challenge}
              </p>
              {featured.testimonial && featured.testimonial.approvalConfirmed && (
                <blockquote
                  className="mt-7 border-l-2 pl-5 font-display text-lg leading-snug"
                  style={{ borderColor: "var(--brand-accent)" }}
                >
                  &ldquo;{featured.testimonial.quote}&rdquo;
                  <footer className="font-sans mt-3 text-sm text-[var(--text-muted)]">
                    {featured.testimonial.name}, {featured.testimonial.role}
                  </footer>
                </blockquote>
              )}
              {featured.disclosure && (
                <p className="mt-6 max-w-xl text-xs text-[var(--text-muted)]">
                  {featured.disclosure}
                </p>
              )}
            </article>
          </FadeUp>

          {featured.results.length > 0 && (
            <FadeUp
              className="flex flex-col border-t lg:sticky lg:top-[calc(var(--header-height)+3rem)] lg:self-start"
              y={14}
              delay={0.1}
            >
              {featured.results.map((result) => (
                <div
                  key={result.label}
                  className="border-b py-7"
                  style={{ borderColor: "var(--border)" }}
                >
                  {/* Counts up on scroll-into-view. The result is the whole
                      point of a case study, so it gets display scale and the
                      one moment of motion in this block. */}
                  <CountUpStat
                    value={result.value}
                    className="font-display block text-5xl font-extrabold tabular-nums md:text-6xl"
                    style={{ color: "var(--brand-accent)" }}
                  />
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{result.label}</p>
                </div>
              ))}
            </FadeUp>
          )}
        </div>
      )}

      {supporting.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {supporting.map((cs, i) => {
            const piece = portfolio.find((p) => p.caseStudyId === cs.id);
            const inner = (
              <>
                {piece && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                )}
                <p className="eyebrow mt-5 text-[var(--text-muted)]">{cs.approvedClientLabel}</p>
                <h4 className="font-display mt-2 text-lg font-semibold">{cs.title}</h4>
                {/* The headline result, at scale and counting up. A case study
                    tile that shows only a title makes the reader open it to
                    find out whether it is worth opening. */}
                {cs.results.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                    {cs.results.slice(0, 2).map((result) => (
                      <div key={result.label}>
                        <CountUpStat
                          value={result.value}
                          className="font-display block text-3xl font-extrabold tabular-nums md:text-4xl"
                          style={{ color: "var(--brand-accent)" }}
                        />
                        <p className="mt-1 max-w-[16ch] text-xs leading-snug text-[var(--text-muted)]">
                          {result.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
            return (
              <FadeUp key={cs.id} y={14} delay={i * 0.06}>
                {piece ? (
                  <Link href={`/work/${piece.slug}`} className="group block">
                    {inner}
                  </Link>
                ) : (
                  <article className="group block">{inner}</article>
                )}
              </FadeUp>
            );
          })}
        </div>
      )}
    </section>
  );
}
