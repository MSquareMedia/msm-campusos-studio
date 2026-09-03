import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";
import { IndexExplorer } from "@/components/motion/IndexExplorer";
import type { ModernServiceItem } from "@/content/types";

/**
 * Was twelve icon cards, each carrying its own paragraph: a wall of text
 * pretending to be a grid. It is now an index. The titles scan in one pass and
 * the prose arrives one item at a time, for the item the reader pointed at.
 */
export function ModernServicesExplorer({
  heading,
  intro,
  items,
}: {
  heading: string;
  intro: string;
  items: ModernServiceItem[];
}) {
  return (
    // No background of its own: this section sits inside the page's
    // white-to-peach scroll gradient (see the industry page files), and a
    // flat surface-muted fill here would cut a hard block out of it.
    <section>
      <div className="container-page py-24 md:py-36">
        <div className="max-w-3xl">
          <TextReveal
            lines={toLines(heading)}
            className="font-display text-3xl font-bold leading-[1.05] md:text-5xl"
          />
          <FadeUp delay={0.1}>
            <p className="mt-6 max-w-lg text-lg text-[var(--text-muted)]">{intro}</p>
          </FadeUp>
        </div>

        <FadeUp className="mt-16" delay={0.05}>
          <IndexExplorer entries={items} />
        </FadeUp>
      </div>
    </section>
  );
}
