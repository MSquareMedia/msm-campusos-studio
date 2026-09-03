import { FadeUp } from "@/components/motion/TextReveal";
import { CountUpStat } from "./CountUpStat";
import type { ProofStat } from "@/content/types";

/**
 * Warm cream base (var(--surface-muted)) by default; `variant="inverse"` swaps
 * to the dark surface token for pages that want a bolder stat moment.
 *
 * The grid is three across at every size above mobile rather than six, because
 * six columns of a nine-item list left an orphaned half-row and shrank the
 * numbers to the size of the labels. Three columns lets the figures run at
 * display scale, which is the only reason to have a stat band at all. Numbers
 * count up on scroll-into-view.
 */
export function ProofStatBand({
  heading,
  stats,
  variant = "cream",
}: {
  heading: string;
  stats: ProofStat[];
  variant?: "cream" | "inverse";
}) {
  const inverse = variant === "inverse";
  const muted = inverse ? "var(--text-inverse-muted)" : "var(--text-muted)";

  return (
    <section
      className="border-y"
      style={{
        background: inverse ? "var(--surface-inverse)" : "var(--surface-muted)",
        borderColor: inverse ? "var(--surface-inverse)" : "var(--border)",
      }}
    >
      <div className="container-page py-20 md:py-28">
        <FadeUp>
          <p className="font-display text-sm font-semibold" style={{ color: muted }}>
            {heading}
          </p>
        </FadeUp>

        <div
          className="mt-10 grid gap-x-10 border-t sm:grid-cols-2 lg:grid-cols-3"
          style={{ borderColor: inverse ? "var(--border-inverse)" : "var(--border)" }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="border-b py-8"
              style={{ borderColor: inverse ? "var(--border-inverse)" : "var(--border)" }}
            >
              <FadeUp y={12} delay={(i % 3) * 0.06}>
                <CountUpStat
                  value={stat.value}
                  className="font-display block text-4xl font-extrabold tabular-nums leading-none md:text-6xl"
                  style={{ color: inverse ? "var(--text-inverse)" : "var(--brand-accent)" }}
                />
                <p className="mt-3 max-w-[22ch] text-sm" style={{ color: muted }}>
                  {stat.label}
                </p>
              </FadeUp>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
