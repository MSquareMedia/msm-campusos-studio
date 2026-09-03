import { Compass, Flask, ChartLineUp, RocketLaunch } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import type { EngagementStep } from "@/content/types";

const STEP_ICONS: Icon[] = [Compass, Flask, ChartLineUp, RocketLaunch];

/**
 * Four steps on one continuous rule. The arrow glyphs between columns were
 * doing work the shared line already does, and they broke on the wrap to a
 * single column.
 */
export function EngagementModel({ steps }: { steps: EngagementStep[] }) {
  return (
    <section className="container-page py-24 md:py-36">
      <TextReveal
        lines={["Engagement model"]}
        className="font-display max-w-xl text-3xl font-bold md:text-5xl"
      />

      <ol
        className="mt-16 grid gap-x-8 gap-y-12 border-t sm:grid-cols-2 md:grid-cols-4"
        style={{ borderColor: "var(--border)" }}
      >
        {steps.map((step, i) => {
          const StepIcon = STEP_ICONS[i % STEP_ICONS.length];
          return (
            <li key={step.step} className="relative pt-8">
              <FadeUp y={14} delay={i * 0.06}>
                <span
                  className="absolute left-0 top-0 h-[3px] w-12"
                  style={{ background: "var(--brand-accent)" }}
                  aria-hidden="true"
                />
                <span
                  className="font-display block text-5xl font-bold leading-none tabular-nums tracking-tight"
                  style={{ color: "transparent", WebkitTextStroke: "1.5px var(--border)" }}
                  aria-hidden="true"
                >
                  {step.step}
                </span>
                <StepIcon
                  size={24}
                  weight="regular"
                  color="var(--brand-accent)"
                  aria-hidden="true"
                  className="mt-6"
                />
                <h3 className="font-display mt-3 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  {step.description}
                </p>
              </FadeUp>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
