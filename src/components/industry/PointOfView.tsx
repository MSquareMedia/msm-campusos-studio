import { SystemDiagram } from "./SystemDiagram";
import { CapabilityFlow } from "./CapabilityFlow";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";

/**
 * The argument beat of the page. It gets display scale and a lot of air, and
 * the supporting prose is deliberately set below and to the right of the
 * headline rather than beside it: the reader should hit the claim first and
 * only then decide whether to read the reasoning.
 */
export function PointOfView({
  heading,
  body,
  flowSteps,
}: {
  heading: string;
  body: string[];
  /** Real per-industry capability-group titles. When provided, renders the
   * left-to-right CapabilityFlow instead of the generic radial SystemDiagram,
   * so each industry page shows its own real structure rather than a
   * repeated identical diagram. */
  flowSteps?: string[];
}) {
  return (
    <section className="border-y" style={{ borderColor: "var(--border)" }}>
      <div className="container-page py-24 md:py-36">
        <TextReveal
          lines={toLines(heading)}
          className="font-display max-w-[16ch] text-4xl font-extrabold leading-[1.02] tracking-tight md:text-7xl"
        />

        <div className="mt-12 flex flex-col gap-6 md:mt-16 md:ml-auto md:max-w-xl">
          {body.map((paragraph, i) => (
            <FadeUp key={i} delay={0.06 * i}>
              <p className="text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
                {paragraph}
              </p>
            </FadeUp>
          ))}
        </div>

        <FadeUp className="mt-16 md:mt-24" delay={0.1}>
          {flowSteps && flowSteps.length > 1 ? (
            <CapabilityFlow steps={flowSteps} className="w-full" />
          ) : (
            <SystemDiagram className="w-full max-w-md" />
          )}
        </FadeUp>
      </div>
    </section>
  );
}
