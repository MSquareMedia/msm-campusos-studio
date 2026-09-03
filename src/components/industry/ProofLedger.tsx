import { FadeUp, TextReveal } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";
import { CountUpStat } from "./CountUpStat";
import type { ProofStat } from "@/content/types";

/**
 * The education proof stats, as a flat ledger.
 *
 * Previously grouped and captioned by each stat's own `sourceNote` (MSM Unify
 * company-wide vs. leadership track record vs. prior-business figures). Those
 * captions read as internal briefing-document language on a client-facing
 * page and were removed at the client's direction, since the numbers
 * themselves are not in question. `sourceNote` still exists on the underlying
 * `ProofStat` data, nothing was deleted from the content file, only from
 * what renders here.
 */
export function ProofLedger({
  heading,
  intro,
  stats,
}: {
  heading: string;
  intro: string;
  stats: ProofStat[];
}) {
  if (stats.length === 0) return null;

  return (
    // No background of its own, see ModernServicesExplorer's note on why.
    <section className="border-y" style={{ borderColor: "var(--border)" }}>
      <div className="container-page py-24 md:py-32">
        <div className="max-w-3xl">
          <TextReveal
            lines={toLines(heading)}
            className="font-display text-3xl font-bold leading-[1.06] md:text-5xl"
          />
          <FadeUp delay={0.1}>
            <p className="mt-5 max-w-xl text-lg text-[var(--text-muted)]">{intro}</p>
          </FadeUp>
        </div>

        <dl className="mt-14 grid gap-x-10 gap-y-12 border-t pt-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:pt-14">
          {stats.map((stat, i) => (
            <FadeUp key={stat.label} y={12} delay={(i % 6) * 0.05}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <CountUpStat
                  value={stat.value}
                  className="font-display block text-4xl font-extrabold leading-none tabular-nums md:text-6xl"
                  style={{ color: "var(--brand-accent)" }}
                />
                <p className="mt-3 max-w-[24ch] text-sm text-[var(--text-muted)]">{stat.label}</p>
              </dd>
            </FadeUp>
          ))}
        </dl>
      </div>
    </section>
  );
}
