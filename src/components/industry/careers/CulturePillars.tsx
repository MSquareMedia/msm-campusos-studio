import { Reveal } from "@/components/industry/Reveal";

type Pillar = { title: string; description: string };

/**
 * Culture-pillar grid for the Careers page. Hairline grid via a background
 * border color behind gap-px cards, the same technique already used for
 * borders elsewhere in this codebase, just applied as a grid rather than a
 * stacked list (see ServiceUniverse for the stacked-row variant).
 */
export function CulturePillars({
  heading,
  intro,
  pillars,
}: {
  heading: string;
  intro: string;
  pillars: Pillar[];
}) {
  return (
    <section id="culture">
      <div className="container-page py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-[var(--text-muted)]">{intro}</p>
        </Reveal>

        <div
          className="mt-14 grid gap-px overflow-hidden border md:grid-cols-2 lg:grid-cols-3"
          style={{ borderColor: "var(--border)", background: "var(--border)" }}
        >
          {pillars.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              delay={i * 0.05}
              y={12}
              className="flex flex-col gap-3 bg-[var(--surface)] p-8 md:p-10"
            >
              <span
                className="font-display text-sm font-semibold"
                style={{ color: "var(--brand-accent)" }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-bold">{pillar.title}</h3>
              <p className="text-[var(--text-muted)]">{pillar.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
