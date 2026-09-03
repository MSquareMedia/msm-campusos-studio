"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CountUpStat } from "@/components/industry/CountUpStat";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import type { IndustryCaseStudy } from "@/content/types";
import type { PortfolioPiece } from "@/content/portfolio";
import type { IndustrySlug } from "@/lib/site-config";

type IndustryOption = { slug: IndustrySlug; label: string };

/**
 * Every piece of real, named work as one interactive card grid, image
 * first, the previous version was a text-heavy numbered list that could
 * only really carry a handful of entries gracefully. This is built to hold
 * the full portfolio (sixteen pieces and rising), not just the three with a
 * full challenge/idea/results writeup.
 *
 * A card whose piece links to a real case study (`caseStudyId`) gets that
 * case study's single headline result as a bold, colour-blocked badge laid
 * over the image, the number the client actually reported, not a
 * decorative flourish. A card with no linked case study, most of the
 * pre-MSM-CampusOS portfolio, just shows the work itself: real image, real
 * client name, no invented number bolted on to make it feel complete.
 *
 * Every card is a real link to /work/{slug}, which already renders
 * the full case-study narrative when one exists (challenge, idea, execution,
 * testimonial, every result) and falls back to the piece's own summary
 * when it doesn't. Nothing here duplicates that page, the card is the
 * index, the click is the actual case study.
 */
export function CaseStudiesIndex({
  pieces,
  caseStudies,
  industries,
}: {
  pieces: PortfolioPiece[];
  caseStudies: IndustryCaseStudy[];
  industries: IndustryOption[];
}) {
  const [active, setActive] = useState<IndustrySlug | "all">("all");

  const caseStudyById = new Map(caseStudies.map((cs) => [cs.id, cs]));
  const industryByPiece = new Map(
    pieces
      .map((p) => [p.slug, p.caseStudyId ? caseStudyById.get(p.caseStudyId)?.industry : undefined] as const)
      .filter((entry): entry is [string, IndustrySlug] => Boolean(entry[1])),
  );

  // Education leads the "all work" view, it's the flagship vertical, then
  // every other industry-tagged piece, then everything with no industry tag
  // (the pre-MSM-CampusOS portfolio) in its authored order. A stable sort
  // keeps each of those groups in the order they were written.
  const industryRank: Record<IndustrySlug, number> = {
    education: 0,
    automotive: 1,
    healthcare: 2,
    "real-estate": 3,
  };
  const rankOf = (p: PortfolioPiece) => {
    const industry = industryByPiece.get(p.slug);
    return industry ? industryRank[industry] : industries.length;
  };
  const ordered = [...pieces].sort((a, b) => rankOf(a) - rankOf(b));

  const filtered =
    active === "all" ? ordered : ordered.filter((p) => industryByPiece.get(p.slug) === active);

  return (
    <section>
      <div className="container-page pt-24 pb-16 md:pt-32 md:pb-20">
        <TextReveal
          as="h1"
          onMount
          lines={["Case studies."]}
          className="font-display text-[clamp(2.5rem,8vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight md:text-7xl"
        />
        <FadeUp delay={0.2} onMount>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--text-muted)]">
            Every piece of real, named work this team has shipped. The numbers shown are exactly
            what the client reported, nothing rounded, nothing invented.
          </p>
        </FadeUp>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter by industry">
          {[{ slug: "all" as const, label: "All work" }, ...industries].map((option) => {
            const isActive = active === option.slug;
            return (
              <button
                key={option.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(option.slug)}
                className={`font-display rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-transparent text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
                style={{
                  borderColor: isActive ? "transparent" : "var(--border)",
                  background: isActive ? "var(--brand-accent)" : "transparent",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="container-page pb-24">
          <p
            className="border-t py-16 text-center text-[var(--text-muted)]"
            style={{ borderColor: "var(--border)" }}
          >
            No published work for this industry yet.
          </p>
        </div>
      ) : (
        <div className="container-page pb-24 md:pb-32">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((piece, i) => {
              const cs = piece.caseStudyId ? caseStudyById.get(piece.caseStudyId) : undefined;
              const headline = cs?.results[0];
              return (
                <FadeUp key={piece.slug} y={18} delay={(i % 6) * 0.06}>
                  <Link href={`/work/${piece.slug}`} className="group block">
                    <div
                      className="relative aspect-[4/3] w-full overflow-hidden"
                      style={{ background: "var(--surface-muted)" }}
                    >
                      <Image
                        src={piece.image}
                        alt={piece.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[600ms] [transition-timing-function:var(--ease-out-strong)] group-hover:scale-[1.06]"
                      />
                      <div
                        className="absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-85"
                        style={{
                          background:
                            "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 45%, transparent 70%)",
                        }}
                      />

                      {/* The headline result: the whole reason a case study
                          leads with an image instead of a name. Set apart
                          from the caption with its own colour block so it
                          reads as the client's own reported number, not page
                          furniture. */}
                      {headline && (
                        <div
                          className="absolute right-0 top-0 px-4 py-3"
                          style={{ background: "var(--brand-accent)" }}
                        >
                          <CountUpStat
                            value={headline.value}
                            className="font-display block text-2xl font-extrabold leading-none tabular-nums text-white md:text-3xl"
                          />
                          <p className="mt-0.5 max-w-[16ch] text-[10px] font-semibold leading-tight text-white/85">
                            {headline.label}
                          </p>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                        <div>
                          <p className="font-display text-lg font-bold leading-tight text-white md:text-xl">
                            {cs?.approvedClientLabel ?? piece.title}
                          </p>
                          <p className="mt-1 text-xs text-white/70">{piece.category}</p>
                        </div>
                        <ArrowUpRight
                          size={20}
                          weight="bold"
                          className="shrink-0 text-white opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
