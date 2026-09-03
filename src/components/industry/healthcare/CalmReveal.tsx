import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";
import { StickyStory } from "@/components/motion/StickyStory";
import type { StoryMoment } from "@/content/types";

/**
 * Healthcare's five-step path, deliberately the quietest sequence on the site.
 * One held frame, one moment at a time, nothing sliding or panning: the
 * subject is somebody who is already anxious, and motion that draws attention
 * to itself would be working against the content.
 *
 * The image sits opposite education's so the two narrative sections do not
 * read as the same template with different photographs in it.
 */
export function CalmReveal({
  heading,
  intro,
  moments,
}: {
  heading: string;
  intro: string;
  moments: StoryMoment[];
}) {
  return (
    <section className="py-24 md:py-32">
      <div className="container-page max-w-3xl">
        <TextReveal
          lines={toLines(heading)}
          className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl"
        />
        <FadeUp delay={0.1}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
            {intro}
          </p>
        </FadeUp>
      </div>

      <div className="mt-16 md:mt-24">
        <StickyStory
          side="right"
          moments={moments.map((m) => ({
            label: m.label,
            title: m.title,
            description: m.description,
            image: m.image,
            alt: m.alt ?? `Healthcare journey moment: ${m.title}`,
            credit: m.credit,
          }))}
        />
      </div>
    </section>
  );
}
