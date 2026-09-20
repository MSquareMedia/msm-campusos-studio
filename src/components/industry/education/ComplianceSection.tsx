import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { toLines } from "@/lib/text";
import { primaryCta } from "@/lib/site-config";
import type { ComplianceMarket } from "@/content/types";

/**
 * Compliance, wherever you operate. Replaces the single-country accreditation
 * section: the commitments that hold in every market come first, then one card
 * per regulatory market we have actually delivered in, then a prompt for the
 * markets we have not listed. India is one card among others, never the frame.
 */
export function ComplianceSection({
  heading,
  intro,
  commitments,
  markets,
  prompt,
  note,
}: {
  heading: string;
  intro?: string;
  commitments: string[];
  markets: ComplianceMarket[];
  prompt?: { title: string; body: string };
  note: string;
}) {
  return (
    <section style={{ background: "var(--surface-inverse-2)" }}>
      <div className="container-page grid gap-12 py-24 text-[var(--text-inverse)] md:grid-cols-[0.85fr_1.15fr] md:gap-20 md:py-36">
        <div className="md:sticky md:top-[calc(var(--header-height)+3rem)] md:self-start">
          <ShieldCheck size={40} weight="light" color="var(--brand-accent)" aria-hidden="true" />
          <TextReveal
            lines={toLines(heading)}
            className="font-display mt-6 text-3xl font-bold leading-[1.06] md:text-5xl"
          />
          {intro && (
            <FadeUp delay={0.1}>
              <p className="mt-6 max-w-sm text-base text-[var(--text-inverse-muted)]">{intro}</p>
            </FadeUp>
          )}
        </div>

        <div>
          <ol className="flex flex-col">
            {commitments.map((commitment, i) => (
              <li key={i} className="border-t" style={{ borderColor: "var(--border-inverse)" }}>
                <FadeUp
                  className="grid grid-cols-[2.5rem_1fr] gap-4 py-7 md:gap-8 md:py-9"
                  delay={i * 0.05}
                >
                  <span
                    className="font-display pt-1 text-sm font-semibold tabular-nums"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base leading-relaxed text-[var(--text-inverse-muted)] md:text-lg">
                    {commitment}
                  </p>
                </FadeUp>
              </li>
            ))}
          </ol>

          <div className="mt-12 border-t pt-10" style={{ borderColor: "var(--border-inverse)" }}>
            <p className="eyebrow text-[var(--text-inverse-muted)]">Markets we work in</p>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {markets.map((market, i) => (
                <li key={market.name}>
                  <FadeUp y={12} delay={i * 0.06} className="h-full">
                    <div
                      className="h-full border p-6"
                      style={{ borderColor: "var(--border-inverse)" }}
                    >
                    <h3 className="font-display text-xl font-bold">{market.name}</h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {market.frameworks.map((framework) => (
                        <li
                          key={framework}
                          className="font-display border px-2.5 py-1 text-xs font-semibold"
                          style={{ borderColor: "var(--border-inverse)" }}
                        >
                          {framework}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--text-inverse-muted)]">
                      {market.summary}
                    </p>
                    </div>
                  </FadeUp>
                </li>
              ))}
              {prompt && (
                <li>
                  <FadeUp y={12} delay={markets.length * 0.06} className="h-full">
                    <div
                      className="flex h-full flex-col items-start border border-dashed p-6"
                      style={{ borderColor: "var(--border-inverse)" }}
                    >
                    <h3 className="font-display text-xl font-bold">{prompt.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--text-inverse-muted)]">
                      {prompt.body}
                    </p>
                    <div className="mt-6">
                      <MagneticButton href={primaryCta.href} variant="ghost-inverse">
                        {primaryCta.label}
                      </MagneticButton>
                    </div>
                    </div>
                  </FadeUp>
                </li>
              )}
            </ul>
          </div>

          <div className="mt-10 border-t pt-8" style={{ borderColor: "var(--border-inverse)" }}>
            <FadeUp>
              <p
                className="border-l-2 pl-5 text-sm text-white md:text-base"
                style={{ borderColor: "var(--brand-accent)" }}
              >
                {note}
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
