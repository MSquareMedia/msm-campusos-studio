import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { solutionsNav } from "@/lib/site-config";
import { solutions, getSolutionItems } from "@/content/solutions";
import { getAllPortfolio } from "@/lib/case-studies-content";
import type { PortfolioPiece } from "@/content/portfolio";
import { homepage } from "@/content/homepage";
import { toLines } from "@/lib/text";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { FinalCTA } from "@/components/industry/FinalCTA";

function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const nav = solutionsNav.find((n) => n.slug === slug);
  const solution = getSolution(slug);

  if (!nav || !solution) {
    return buildMetadata({
      title: "Solutions",
      description: "Growth capability from SOTAPO.",
      path: `/solutions/${slug}`,
    });
  }

  return buildMetadata({
    title: `${nav.label} | SOTAPO solutions`,
    description: solution.metaDescription,
    path: nav.href,
    ogImage: solution.image.src,
  });
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nav = solutionsNav.find((n) => n.slug === slug);
  const solution = getSolution(slug);
  if (!nav || !solution) notFound();

  const items = getSolutionItems(solution.groupTitle);
  const portfolio = await getAllPortfolio();
  const work = solution.workSlugs
    .map((s) => portfolio.find((p) => p.slug === s))
    .filter((p): p is PortfolioPiece => Boolean(p));

  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: nav.label, path: nav.href },
  ]);

  return (
    <>
      <Script
        id="solution-detail-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Opening: one bold line against a tall frame. The page used to lead
          with type alone and hold its only photograph back until halfway down,
          which is the wrong order for a page selling creative work. */}
      <section className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="container-page grid gap-12 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-16 md:py-28">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              SOTAPO
            </Link>
            <FadeUp className="mt-8" y={12} onMount>
              <p className="eyebrow text-[var(--brand-accent)]">Solutions</p>
            </FadeUp>
            <TextReveal
              as="h1"
              delay={0.08}
              onMount
              lines={toLines(solution.heroLine)}
              className="font-display mt-4 text-[clamp(2.5rem,8vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight md:text-7xl"
            />
            <FadeUp delay={0.28} onMount>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-[var(--text-muted)]">
                {solution.heroSupport}
              </p>
            </FadeUp>
          </div>

          <ScrollReveal
            src={solution.image.src}
            alt={solution.image.alt}
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            frameClassName="aspect-[3/2] w-full"
            caption={solution.image.credit}
          />
        </div>
      </section>

      {/* What it covers. Short labels only: the per-item prose lives on the
          industry pages, and repeating it here would double the page's word
          count for no new information. */}
      <section className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="container-page py-20 md:py-28">
          <FadeUp className="max-w-2xl">
            <p className="font-display text-2xl font-bold leading-snug md:text-4xl">
              {solution.intro}
            </p>
          </FadeUp>

          <ul
            className="mt-14 grid border-t sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3"
            style={{ borderColor: "var(--border)" }}
          >
            {items.map((item, i) => (
              <li key={item} className="border-b" style={{ borderColor: "var(--border)" }}>
                <FadeUp
                  className="group flex h-full flex-col gap-5 py-8 pr-8 transition-transform duration-[400ms] [transition-timing-function:var(--ease-out-strong)] hover:translate-x-2 md:py-10"
                  y={12}
                  delay={(i % 3) * 0.05}
                >
                  <span
                    className="font-display text-sm font-semibold tabular-nums"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-xl font-bold leading-snug md:text-2xl">{item}</p>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Real work: visual proof, not more copy. Skipped entirely on pages
          where nothing in the existing library is a genuine thematic fit. */}
      {work.length > 0 && (
        <section className="border-t" style={{ borderColor: "var(--border)" }}>
          <div className="container-page py-20 md:py-28">
            <TextReveal
              lines={[`Real work behind ${nav.label.toLowerCase()}`]}
              className="font-display max-w-2xl text-3xl font-bold leading-[1.06] md:text-5xl"
            />

            <div
              className={`mt-12 grid gap-4 ${
                work.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
              }`}
            >
              {work.map((piece, i) => (
                <FadeUp key={piece.slug} y={16} delay={i * 0.06}>
                  <Link
                    href={`/work/${piece.slug}`}
                    className="group relative block aspect-[4/5] w-full overflow-hidden"
                  >
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[600ms] [transition-timing-function:var(--ease-out-strong)] group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-90"
                      style={{
                        background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 55%)",
                      }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                      <div>
                        <p className="eyebrow text-[var(--brand-accent)]">{piece.category}</p>
                        <h3 className="font-display mt-1 text-lg font-bold">{piece.title}</h3>
                      </div>
                      <ArrowUpRight
                        size={20}
                        className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Keeps the dropdown's five pages connected to each other, not just
          back to the homepage. */}
      <section className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="container-page py-16 md:py-20">
          <FadeUp>
            <p className="font-display text-sm font-semibold text-[var(--text-muted)]">
              More solutions
            </p>
          </FadeUp>
          <div className="mt-8 flex flex-wrap gap-3">
            {solutionsNav
              .filter((n) => n.slug !== nav.slug)
              .map((n, i) => (
                <FadeUp key={n.slug} y={10} delay={i * 0.04}>
                  <MagneticButton href={n.href} variant="ghost">
                    {n.label}
                    <ArrowUpRight size={14} aria-hidden="true" className="ml-2" />
                  </MagneticButton>
                </FadeUp>
              ))}
          </div>
        </div>
      </section>

      <FinalCTA heading={homepage.finalCta.heading} body={homepage.finalCta.body} />
    </>
  );
}
