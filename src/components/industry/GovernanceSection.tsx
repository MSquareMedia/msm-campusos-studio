import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";

/**
 * Governance read as a stack of five identical check-marked paragraphs, which
 * is the least persuasive shape for the most legally-loaded copy on the page.
 * It is now a numbered ledger: each commitment is a separate line item with
 * its own rule and its own number, held against a sticky heading. It reads
 * like something signed rather than something bulleted.
 */
export function GovernanceSection({
  heading,
  body,
  note,
}: {
  heading: string;
  body: string[];
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
        </div>

        <ol className="flex flex-col">
          {body.map((paragraph, i) => (
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
                  {paragraph}
                </p>
              </FadeUp>
            </li>
          ))}
          <li className="border-t pt-8" style={{ borderColor: "var(--border-inverse)" }}>
            <FadeUp delay={body.length * 0.05}>
              <p
                className="border-l-2 pl-5 text-sm text-white md:text-base"
                style={{ borderColor: "var(--brand-accent)" }}
              >
                {note}
              </p>
            </FadeUp>
          </li>
        </ol>
      </div>
    </section>
  );
}
