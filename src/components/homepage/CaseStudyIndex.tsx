"use client";

import { MouseRevealImage } from "@/components/motion/MouseRevealImage";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import type { IndustryCaseStudy } from "@/content/types";

/**
 * Case studies, presented as the typographic hover-reveal index the homepage
 * used before CaseStudyHighlights' challenge/solution/results card grid
 * replaced it, brought back at the client's direction. Same interaction as
 * the old WorkIndex (client name at headline scale, image held back until
 * the cursor asks for it), just driven by real case-study content instead of
 * the older portfolio pieces, so the headline result travels with each row
 * as the meta line.
 */
export function CaseStudyIndex({
  caseStudies,
  headlineLines = ["Results this team", "has actually delivered."],
  standfirst = "Real engagements, with the numbers the client reported. Not a portfolio list.",
}: {
  caseStudies: IndustryCaseStudy[];
  headlineLines?: string[];
  standfirst?: string;
}) {
  if (caseStudies.length === 0) return null;

  return (
    <section id="work" className="scroll-mt-28 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container-page py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TextReveal
            lines={headlineLines}
            className="font-display max-w-2xl text-3xl font-extrabold leading-[1.06] tracking-tight md:text-5xl"
          />
          <FadeUp delay={0.15}>
            <p className="max-w-xs text-sm text-[var(--text-muted)]">{standfirst}</p>
          </FadeUp>
        </div>

        <div className="mt-14 border-t" style={{ borderColor: "var(--border)" }}>
          {caseStudies.map((cs) => (
            <MouseRevealImage
              key={cs.id}
              label={cs.approvedClientLabel}
              meta={
                cs.results[0]
                  ? `${cs.results[0].value} ${cs.results[0].label}`
                  : cs.industry.replace("-", " ")
              }
              src={cs.heroAsset.src}
              alt={cs.heroAsset.alt}
              href="/case-studies"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
