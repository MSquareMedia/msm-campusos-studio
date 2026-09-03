import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/forms/ContactForm";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";

export const metadata: Metadata = buildMetadata({
  title: "Start a conversation",
  description: "Tell SOTAPO about your industry, markets, and marketing goals.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow" style={{ color: "var(--brand-accent)" }}>
          SOTAPO
        </p>
        <TextReveal
          as="h1"
          lines={["Start a conversation."]}
          className="font-display mt-4 text-4xl font-bold leading-[1.05] md:text-6xl"
        />
        <FadeUp delay={0.1}>
          <p className="mt-6 text-lg text-[var(--text-muted)]">
            Tell us who you are and what you need. One screen, no questionnaire. If you would
            rather have us look at your marketing first, take the free assessment instead.
          </p>
        </FadeUp>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
        <div>
          <ContactForm />
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:self-start">
          <div
            className="border p-7"
            style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
          >
            <h2 className="font-display text-lg font-bold">Not ready to talk yet?</h2>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Ask for a free audit instead. Six questions, and the team reviews where your
              marketing is losing people before either of us commits to anything.
            </p>
            <Link
              href="/audit"
              className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold
                         transition-transform duration-200 [transition-timing-function:var(--ease-out-strong)]
                         hover:translate-x-0.5 active:scale-[0.97]"
              style={{ color: "var(--brand-accent-dark)" }}
            >
              Request a free audit
              <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
