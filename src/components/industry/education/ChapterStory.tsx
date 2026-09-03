import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";
import { StickyStory } from "@/components/motion/StickyStory";
import type { StoryMoment } from "@/content/types";

/**
 * Education's opening narrative. Previously two long paragraphs stacked under
 * a heading with no picture at all, on the page with the weakest imagery.
 * Now the two campus photographs hold position while the chapters pass them,
 * so the story is carried by the frame and punctuated by the text.
 */
export function ChapterStory({
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
      </div>

      <div className="mt-16 md:mt-24">
        <StickyStory
          side="left"
          moments={moments.map((m) => ({
            label: m.label,
            title: m.title,
            description: m.description,
            image: m.image,
            alt: m.alt ?? m.title,
            credit: m.credit,
          }))}
        />
      </div>

      {/* The fiction disclaimer is a factual note about the illustration, not
          part of the story, so it sits below it at footnote scale rather than
          taking up the section's lead paragraph. */}
      <FadeUp className="container-page mt-14">
        <p className="max-w-xl text-xs leading-relaxed text-[var(--text-muted)]">{intro}</p>
      </FadeUp>
    </section>
  );
}
