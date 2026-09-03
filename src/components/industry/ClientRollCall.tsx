import Image from "next/image";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";

/**
 * The full education roster, shown in full.
 *
 * A marquee is the right treatment for six logos and the wrong one for
 * nineteen: it never shows the reader the size of the list, and any given
 * institution has roughly a two-second window to be recognised as it slides
 * past. Laid out as a grid, every mark is on screen at once, the count is
 * legible without anyone doing arithmetic, and a vice chancellor scanning for
 * a peer institution can actually find it.
 *
 * The count defaults to `logos.length` so it cannot fall out of step with the
 * grid, pass `countLabel` only when the real number of institutions worked
 * with is genuinely larger than the set of logos held as approved assets.
 *
 * Logos only, no category labels underneath: the mark is the credibility, and
 * the institution's name lives in the alt text where it does screen-reader
 * work instead of visual clutter. The disclosure below the grid is a condition
 * of publishing this list at all and travels with it.
 */
export function ClientRollCall({
  heading,
  disclosure,
  logos,
  countLabel,
}: {
  heading: string;
  disclosure: string;
  logos: Array<{ name: string; src: string }>;
  /** Overrides the displayed count, see the type's own doc comment. */
  countLabel?: string;
}) {
  if (logos.length === 0) return null;
  const count = countLabel ?? String(logos.length);

  return (
    // No background of its own, see ModernServicesExplorer's note on why.
    <section className="py-24 md:py-32">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-16">
          <TextReveal
            lines={toLines(heading)}
            className="font-display max-w-xl text-3xl font-bold leading-[1.06] md:text-5xl"
          />
          <FadeUp delay={0.1} className="shrink-0">
            <span
              className="font-display block text-6xl font-extrabold leading-none tabular-nums md:text-8xl"
              style={{ color: "transparent", WebkitTextStroke: "1.5px var(--brand-accent)" }}
              aria-hidden="true"
            >
              {count}
            </span>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              <span className="sr-only">{count} </span>institutions worked with
            </p>
          </FadeUp>
        </div>

        <ul
          className="mt-14 grid grid-cols-2 border-l border-t sm:grid-cols-3 lg:grid-cols-5"
          style={{ borderColor: "var(--border)" }}
        >
          {logos.map((logo, i) => (
            <li
              key={logo.name}
              className="border-b border-r"
              style={{ borderColor: "var(--border)" }}
            >
              <FadeUp
                y={10}
                delay={(i % 5) * 0.04}
                className="flex h-full items-center justify-center p-6 md:p-8"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={220}
                  height={96}
                  className="h-12 w-auto object-contain md:h-16"
                />
              </FadeUp>
            </li>
          ))}
        </ul>

        <FadeUp delay={0.1}>
          <p className="mt-8 max-w-2xl text-xs leading-relaxed text-[var(--text-muted)]">
            {disclosure}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
