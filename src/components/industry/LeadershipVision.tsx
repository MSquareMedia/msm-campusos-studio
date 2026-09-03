import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { toLines } from "@/lib/text";
import type { LeaderQuote } from "@/content/types";

/**
 * The founder and president block, split out of the flat team section.
 *
 * Their quotes were previously two small blockquotes above a five-up grid of
 * faces, which read as a caption on the bench rather than as the direction the
 * bench is following. Given their own section on the dark surface, at portrait
 * scale, they read as what they are: the two people who decided this should
 * exist, saying why.
 *
 * Two people only, so a two-column split is the honest shape. The portraits
 * use the clip-and-parallax reveal rather than a plain fade because a portrait
 * that wipes into place has the weight of a title card; a fading one reads as
 * an image that loaded slowly.
 */
export function LeadershipVision({
  heading,
  intro,
  quotes,
}: {
  heading: string;
  intro: string;
  quotes: LeaderQuote[];
}) {
  if (quotes.length === 0) return null;

  return (
    <section style={{ background: "var(--surface-inverse)" }}>
      <div className="container-page py-24 text-[var(--text-inverse)] md:py-36">
        <div className="max-w-2xl">
          <TextReveal
            lines={toLines(heading)}
            className="font-display text-3xl font-bold leading-[1.06] md:text-5xl"
          />
          <FadeUp delay={0.1}>
            <p className="mt-5 text-lg" style={{ color: "var(--text-inverse-muted)" }}>
              {intro}
            </p>
          </FadeUp>
        </div>

        <div className="mt-16 grid gap-14 md:mt-20 md:grid-cols-2 md:gap-16">
          {quotes.map((q, i) => (
            // Not a <figure>: ScrollReveal renders its own figure/figcaption
            // pair for the portrait, and nesting the quote's caption inside
            // that would leave two captions describing different things.
            <div key={q.name} className="flex flex-col">
              {q.photo && (
                <ScrollReveal
                  src={q.photo}
                  alt={`Portrait of ${q.name}`}
                  sizes="(min-width: 768px) 44vw, 90vw"
                  frameClassName="aspect-[4/5] w-full"
                />
              )}

              <FadeUp y={16} delay={0.08 + i * 0.07} className="mt-8 flex flex-1 flex-col">
                <div
                  className="flex flex-1 flex-col border-t pt-8"
                  style={{ borderColor: "var(--border-inverse)" }}
                >
                  <blockquote className="flex flex-1 flex-col">
                    <p className="font-display text-xl leading-snug md:text-2xl">
                      &ldquo;{q.quote}&rdquo;
                    </p>
                    <footer className="mt-auto pt-8">
                      <span
                        className="block h-[3px] w-12"
                        style={{ background: "var(--brand-accent)" }}
                        aria-hidden="true"
                      />
                      <span className="font-display mt-5 block text-base font-semibold">
                        {q.name}
                      </span>
                      <span
                        className="mt-1 block text-sm"
                        style={{ color: "var(--text-inverse-muted)" }}
                      >
                        {q.role}
                      </span>
                    </footer>
                  </blockquote>
                </div>
              </FadeUp>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
