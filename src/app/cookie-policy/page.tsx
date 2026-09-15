import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { legal } from "@/content/legal";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";

export const metadata: Metadata = buildMetadata({
  title: legal.cookies.metaTitle,
  description: legal.cookies.metaDescription,
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  const { cookies } = legal;
  return (
    <section className="container-page py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow" style={{ color: "var(--brand-accent)" }}>
          SOTAPO
        </p>
        <TextReveal
          as="h1"
          lines={["Cookie Policy"]}
          className="font-display mt-4 text-4xl font-bold leading-[1.05] md:text-6xl"
        />
        <FadeUp delay={0.1}>
          <p className="mt-5 text-sm text-[var(--text-muted)]">Last updated {cookies.updated}</p>
          <p className="mt-6 text-lg text-[var(--text-muted)]">{cookies.intro}</p>
        </FadeUp>
      </div>

      <div className="mt-14 flex max-w-2xl flex-col gap-12">
        {cookies.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-xl font-bold md:text-2xl">{section.heading}</h2>
            <div className="mt-4 flex flex-col gap-3">
              {section.body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-[var(--text-muted)]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
