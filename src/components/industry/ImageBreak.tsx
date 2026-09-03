import { ScrollReveal } from "@/components/motion/ScrollReveal";

/**
 * The page's breathing point. It was a contained 21:9 letterbox inside the
 * text column, which reads as an illustration of the section above it; edge to
 * edge and taller, it reads as a change of subject, which is what a break is
 * for.
 *
 * The credit line stays inside the page gutter rather than under the bleed:
 * several of these photographs are Wikimedia CC0 and the attribution is a
 * licence condition, so it has to sit where it is legible, not where it is
 * tidy.
 */
export function ImageBreak({
  src,
  alt,
  credit,
}: {
  src: string;
  alt: string;
  credit?: string;
}) {
  return (
    <section className="py-10 md:py-16">
      <ScrollReveal
        src={src}
        alt={alt}
        sizes="100vw"
        frameClassName="h-[60vh] w-full md:h-[82vh]"
      />
      {credit && (
        <div className="container-page">
          <p className="mt-4 text-xs text-[var(--text-muted)]">{credit}</p>
        </div>
      )}
    </section>
  );
}
