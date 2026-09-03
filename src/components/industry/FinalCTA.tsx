import { primaryCta } from "@/lib/site-config";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";

/**
 * The last frame. It gets the largest type on the page and almost nothing
 * else: after a full scroll the reader needs one sentence and one thing to
 * press, not a summary of what they just read.
 */
export function FinalCTA({ heading, body }: { heading: string; body: string }) {
  return (
    <section style={{ background: "var(--surface-inverse)" }}>
      <div className="container-page flex flex-col items-start gap-8 py-28 text-[var(--text-inverse)] md:py-40">
        <TextReveal
          lines={toLines(heading)}
          className="font-display max-w-[16ch] text-4xl font-extrabold leading-[1.02] tracking-tight md:text-7xl"
        />
        <FadeUp delay={0.15}>
          <p className="max-w-lg text-lg text-[var(--text-inverse-muted)]">{body}</p>
          <div className="mt-9">
            <MagneticButton href={primaryCta.href}>{primaryCta.label}</MagneticButton>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
