import { Reveal } from "@/components/industry/Reveal";
import { ServiceOrbitDiagram } from "./ServiceOrbitDiagram";

type ServiceGroup = { title: string; items: string[] };

export function ServiceUniverse({
  heading,
  intro,
  groups,
}: {
  heading: string;
  intro: string;
  groups: ServiceGroup[];
}) {
  return (
    <section style={{ background: "var(--surface-inverse)" }}>
      <div className="container-page py-20 text-[var(--text-inverse)] md:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-[var(--text-inverse-muted)]">{intro}</p>
        </Reveal>

        <div className="mt-14">
          <ServiceOrbitDiagram />
        </div>

        <div className="mt-14 flex flex-col">
          {groups.map((group, i) => (
            <Reveal key={group.title} y={16} delay={i * 0.05}>
              <div
                className="group grid gap-4 border-t py-8 transition-colors duration-300 md:grid-cols-[280px_1fr] md:gap-10 md:py-10"
                style={{ borderColor: "var(--border-inverse)" }}
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-display text-sm font-semibold transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: "var(--brand-accent)" }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-bold md:text-2xl">{group.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-[2px] border px-3 py-1.5 text-sm text-[var(--text-inverse-muted)] transition-colors duration-200 hover:border-[var(--brand-accent)] hover:text-[var(--text-inverse)]"
                      style={{ borderColor: "var(--border-inverse)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
