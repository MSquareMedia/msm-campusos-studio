import Image from "next/image";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";
import type { ClientTestimonial } from "@/content/types";

// PLACEHOLDER TESTIMONIAL CONTENT, replace with real, approved client quotes
// before public launch. Attribution intentionally uses a role only, never a
// fabricated person's name. This component renders whatever `testimonials`
// array it is given; the placeholder disclaimer lives with the content in
// src/content/*.ts and src/content/homepage-testimonials.ts.

/**
 * Three quotes on hairlines instead of three bordered cards. The client
 * wordmark does the identifying, so the attribution line can stay small and
 * the quote can carry the section at close to headline scale.
 */
export function TestimonialSection({
  heading,
  intro,
  testimonials,
}: {
  heading: string;
  intro?: string;
  testimonials: ClientTestimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    // No background of its own, see ModernServicesExplorer's note on why.
    <section className="py-24 md:py-32">
      <div className="container-page">
        <div className="max-w-2xl">
          <TextReveal
            lines={toLines(heading)}
            className="font-display text-3xl font-bold leading-[1.06] md:text-5xl"
          />
          {intro && (
            <FadeUp delay={0.1}>
              <p className="mt-5 text-lg text-[var(--text-muted)]">{intro}</p>
            </FadeUp>
          )}
        </div>

        {/* Columns follow the count rather than the other way round: four
            quotes in a three-up grid leaves an orphan in the second row. */}
        <div
          className={`mt-14 grid gap-x-12 gap-y-10 ${
            testimonials.length % 3 === 0 ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
        >
          {testimonials.map((testimonial, i) => (
            <FadeUp key={testimonial.clientName} y={14} delay={(i % 3) * 0.07}>
              <blockquote
                className="flex h-full flex-col gap-6 border-t pt-8"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Set the name when we hold no approved logo file for that
                    client. Better a plain wordmark than a redrawn approximation
                    of somebody's trademark. */}
                {testimonial.clientLogo ? (
                  <Image
                    src={testimonial.clientLogo}
                    alt={testimonial.clientName}
                    width={160}
                    height={64}
                    // Crest-plus-wordmark marks (e.g. Adamas: crest, "ADAMAS",
                    // "UNIVERSITY", city, tagline, five lines of content) need
                    // more vertical room than a flat wordmark to read at the
                    // same visual weight as M3M or Tata 1mg. Widening the box
                    // keeps every logo legible rather than shrinking the busy
                    // ones down to match the simplest one.
                    className={
                      testimonial.clientLogoTall
                        ? "h-16 w-auto object-contain md:h-20"
                        : "h-10 w-auto object-contain md:h-12"
                    }
                  />
                ) : (
                  <p className="font-display flex h-10 items-center text-lg font-bold tracking-tight md:h-12 md:text-xl">
                    {testimonial.clientName}
                  </p>
                )}
                <p className="font-display flex-1 text-lg leading-snug md:text-xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="text-sm text-[var(--text-muted)]">
                  {testimonial.personName ?? testimonial.rolePlaceholder}, {testimonial.clientName}
                </footer>
              </blockquote>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
