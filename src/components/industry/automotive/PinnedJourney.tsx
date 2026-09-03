import Image from "next/image";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";
import { StickyRail } from "@/components/motion/StickyRail";
import type { StoryMoment } from "@/content/types";

/**
 * The eight-step vehicle journey, panned sideways as the page scrolls down.
 *
 * A buying journey is the one thing on this site that is genuinely linear, so
 * it gets the one horizontal move on the page: the reader travels the path
 * rather than reading a list of its stops. Previously this cross-faded eight
 * absolutely-positioned panels in place, which showed one moment at a time and
 * hid the sense of distance that is the whole point.
 *
 * The pin is CSS sticky (see StickyRail). GSAP's `pin: true` is not used
 * anywhere in this codebase: its pin-spacer wrapper and React's reconciler
 * fight over the same parent node.
 */
export function PinnedJourney({
  heading,
  intro,
  moments,
}: {
  heading: string;
  intro: string;
  moments: StoryMoment[];
}) {
  return (
    <section className="pt-24 md:pt-36">
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

      <StickyRail className="mt-16 md:mt-20">
        {moments.map((moment) => (
          <figure key={moment.title} className="w-full shrink-0 md:w-[38vw]">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={moment.image}
                alt={moment.alt ?? `Automotive journey moment: ${moment.title}`}
                fill
                sizes="(min-width: 768px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-5">
              <span
                className="font-display text-xs font-semibold tracking-[0.18em]"
                style={{ color: "var(--brand-accent)" }}
              >
                {moment.label}
              </span>
              <h3 className="font-display mt-2 text-2xl font-bold md:text-3xl">{moment.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                {moment.description}
              </p>
            </figcaption>
          </figure>
        ))}
      </StickyRail>
    </section>
  );
}
