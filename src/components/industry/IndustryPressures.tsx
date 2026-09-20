import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";

/**
 * The industry, in one screen. It comes before any product, story or brand
 * name so a reader who has never worked in the sector is framed first: the
 * argument on the left, the pressures that make it true on the right as a
 * ledger rather than a row of icon cards.
 *
 * Statistics render only when the content supplies them with a source. An
 * unsourced figure never appears here.
 */
export function IndustryPressures({
  heading,
  body,
  pressures,
  stats,
}: {
  heading: string;
  body: string;
  pressures: Array<{ title: string; blurb: string }>;
  stats?: Array<{ value: string; label: string; source: string }>;
}) {
  return (
    <section className="border-b" style={{ borderColor: "var(--border)" }}>
      <div className="container-page grid gap-14 py-24 md:grid-cols-[1fr_1.05fr] md:gap-20 md:py-36">
        <div className="md:sticky md:top-[calc(var(--header-height)+3rem)] md:self-start">
          <TextReveal
            lines={toLines(heading)}
            className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl"
          />
          <FadeUp delay={0.15}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
              {body}
            </p>
          </FadeUp>
        </div>

        <div>
          <ol className="flex flex-col">
            {pressures.map((pressure, i) => (
              <li key={pressure.title} className="border-t" style={{ borderColor: "var(--border)" }}>
                <FadeUp
                  y={14}
                  delay={i * 0.05}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 py-6 md:gap-8 md:py-7"
                >
                  <span
                    className="font-display pt-1 text-sm font-semibold tabular-nums"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold leading-tight md:text-2xl">
                      {pressure.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                      {pressure.blurb}
                    </p>
                  </div>
                </FadeUp>
              </li>
            ))}
            <li className="border-t" style={{ borderColor: "var(--border)" }} aria-hidden="true" />
          </ol>

          {stats && stats.length > 0 && (
            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
              {stats.map((stat) => (
                <FadeUp key={stat.label} y={12}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span
                      className="font-display block text-5xl font-extrabold leading-none tabular-nums"
                      style={{ color: "var(--brand-accent)" }}
                    >
                      {stat.value}
                    </span>
                    <p className="mt-3 text-sm text-[var(--text-muted)]">{stat.label}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">Source: {stat.source}</p>
                  </dd>
                </FadeUp>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
