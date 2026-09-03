import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { PlayCircle, ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getAllPortfolio, getAllCaseStudies } from "@/lib/case-studies-content";
import type { PortfolioPiece } from "@/content/portfolio";
import type { IndustryCaseStudy } from "@/content/types";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const revalidate = 60;

export async function generateStaticParams() {
  const portfolio = await getAllPortfolio();
  return portfolio.map((piece) => ({ slug: piece.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [portfolio, caseStudies] = await Promise.all([getAllPortfolio(), getAllCaseStudies()]);
  const piece = portfolio.find((p) => p.slug === slug);
  if (!piece) {
    return buildMetadata({
      title: "Work",
      description: "Selected work from SOTAPO's brand and marketing leadership.",
      path: `/work/${slug}`,
    });
  }

  const caseStudy = piece.caseStudyId
    ? caseStudies.find((cs) => cs.id === piece.caseStudyId)
    : undefined;
  const description = caseStudy?.challenge ?? piece.summary;

  return buildMetadata({
    title: `${piece.title} | Selected work`,
    description,
    path: `/work/${piece.slug}`,
    ogImage: piece.image,
  });
}

/**
 * Case study pages read as a brief: a full-height opening frame, then the
 * argument broken into beats with the project's own photography set between
 * them rather than dumped in a gallery at the end. The previous layout put
 * challenge, insight, idea and execution in one narrow column and every
 * picture below all of it, which meant the reader met four paragraphs before
 * seeing any of the work being described.
 */
export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [portfolio, caseStudies] = await Promise.all([getAllPortfolio(), getAllCaseStudies()]);
  const piece = portfolio.find((p) => p.slug === slug);
  if (!piece) notFound();

  const caseStudy = piece.caseStudyId
    ? caseStudies.find((cs) => cs.id === piece.caseStudyId)
    : undefined;

  const gallery = caseStudy?.gallery ?? piece.gallery ?? [];
  const [galleryFeature, ...galleryRest] = gallery;

  const breadcrumb = breadcrumbJsonLd([
    { name: "SOTAPO", path: "/" },
    { name: "Selected work", path: "/#works" },
    { name: piece.title, path: `/work/${piece.slug}` },
  ]);

  return (
    <>
      <Script
        id="work-detail-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "82dvh" }}>
        <Image
          src={piece.image}
          alt={piece.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        <div className="container-page relative z-10 pb-12 text-white md:pb-16">
          <FadeUp y={12} onMount>
            <p className="eyebrow text-[var(--brand-accent)]">{piece.category}</p>
          </FadeUp>
          <TextReveal
            as="h1"
            delay={0.08}
            onMount
            lines={[caseStudy?.title ?? piece.title]}
            className="font-display mt-4 max-w-4xl text-[clamp(2.25rem,7vw,3rem)] font-extrabold leading-[1.02] tracking-tight md:text-6xl"
          />
        </div>
      </section>

      <div className="container-page py-6">
        <Link
          href="/#works"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to selected work
        </Link>
      </div>

      {caseStudy ? (
        <CaseStudyBody
          caseStudy={caseStudy}
          videoUrl={piece.videoUrl}
          galleryFeature={galleryFeature}
        />
      ) : (
        <StandardBody piece={piece} galleryFeature={galleryFeature} />
      )}

      <GalleryGrid images={galleryRest} title={piece.title} />

      <section className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="container-page py-20 md:py-28">
          <TextReveal
            lines={["More selected work"]}
            className="font-display text-2xl font-bold md:text-4xl"
          />
          <div className="mt-10 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio
              .filter((p) => p.slug !== piece.slug)
              .slice(0, 3)
              .map((p, i) => (
                <FadeUp key={p.slug} y={16} delay={i * 0.06}>
                  <Link
                    href={`/work/${p.slug}`}
                    className="group relative block aspect-[4/5] overflow-hidden"
                  >
                    <Image
                      src={p.image}
                      alt={p.title}
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
                        <p className="eyebrow text-[var(--brand-accent)]">{p.category}</p>
                        <h3 className="font-display mt-1 text-lg font-bold">{p.title}</h3>
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
    </>
  );
}

function VideoCta({ videoUrl }: { videoUrl: string }) {
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-secondary inline-flex items-center gap-2"
    >
      <PlayCircle size={20} aria-hidden="true" />
      Watch the film
    </a>
  );
}

type GalleryImage = { src: string; alt: string };

/** The project's strongest frame, set edge to edge between the lead and the
 *  detail. It is the same picture that used to open the gallery block at the
 *  bottom of the page, moved to where it does argumentative work. */
function FeatureFrame({ image }: { image?: GalleryImage }) {
  if (!image) return null;
  return (
    <ScrollReveal
      src={image.src}
      alt={image.alt}
      sizes="100vw"
      className="my-16 md:my-24"
      frameClassName="h-[55vh] w-full md:h-[78vh]"
    />
  );
}

function GalleryGrid({ images, title }: { images: GalleryImage[]; title: string }) {
  if (images.length === 0) return null;

  return (
    <section className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container-page py-20 md:py-28">
        <TextReveal
          lines={[`Inside the ${title} project`]}
          className="font-display max-w-2xl text-2xl font-bold md:text-4xl"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <FadeUp key={img.src} y={16} delay={(i % 3) * 0.07}>
              {/* Every third frame runs tall, so the grid has a rhythm instead
                  of reading as a contact sheet of identical crops. */}
              <div
                className={`group relative w-full overflow-hidden ${
                  i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[600ms] [transition-timing-function:var(--ease-out-strong)] group-hover:scale-105"
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetaList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="eyebrow text-[var(--text-muted)]">{label}</p>
      <ul className="mt-4 border-t" style={{ borderColor: "var(--border)" }}>
        {items.map((item) => (
          <li
            key={item}
            className="border-b py-3 text-base text-[var(--text)]"
            style={{ borderColor: "var(--border)" }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultsBand({ results }: { results: Array<{ value: string; label: string }> }) {
  if (results.length === 0) return null;
  return (
    <section style={{ background: "var(--surface-inverse)" }}>
      <div className="container-page py-16 md:py-24">
        <div className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result, i) => (
            <FadeUp key={result.label} y={12} delay={(i % 3) * 0.06}>
              <p className="font-display text-5xl font-extrabold tabular-nums leading-none text-[var(--brand-accent)] md:text-7xl">
                {result.value}
              </p>
              <p className="mt-3 max-w-[24ch] text-sm text-[var(--text-inverse-muted)]">
                {result.label}
              </p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function StandardBody({
  piece,
  galleryFeature,
}: {
  piece: PortfolioPiece;
  galleryFeature?: GalleryImage;
}) {
  return (
    <>
      <section className="container-page pb-4">
        <FadeUp className="max-w-3xl">
          <p className="font-display text-2xl font-bold leading-snug md:text-4xl">
            {piece.summary}
          </p>
        </FadeUp>
      </section>

      <FeatureFrame image={galleryFeature} />

      <section className="container-page pb-20 md:pb-28">
        <div className="grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
          <FadeUp className="flex flex-col gap-6">
            {piece.body?.map((paragraph, i) => (
              <p key={i} className="max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
                {paragraph}
              </p>
            ))}
            {piece.videoUrl && (
              <div className="mt-2">
                <VideoCta videoUrl={piece.videoUrl} />
              </div>
            )}
          </FadeUp>

          <FadeUp className="flex flex-col gap-10" delay={0.08}>
            <MetaList label="Scope" items={piece.services ?? []} />
            {piece.results && piece.results.length > 0 && (
              <div>
                <p className="eyebrow text-[var(--text-muted)]">Results</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {piece.results.map((result) => (
                    <li
                      key={result}
                      className="font-display text-xl font-bold text-[var(--brand-accent)]"
                    >
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </FadeUp>
        </div>
      </section>
    </>
  );
}

function CaseStudyBody({
  caseStudy,
  videoUrl,
  galleryFeature,
}: {
  caseStudy: IndustryCaseStudy;
  videoUrl?: string;
  galleryFeature?: GalleryImage;
}) {
  return (
    <>
      {/* The challenge, at pull-quote scale. It is the one paragraph that has
          to land, so it is not competing with three others beside it. */}
      <section className="container-page pb-4">
        {caseStudy.geography && (
          <FadeUp y={10}>
            <p className="eyebrow text-[var(--text-muted)]">
              {caseStudy.approvedClientLabel} &middot; {caseStudy.geography}
            </p>
          </FadeUp>
        )}
        <FadeUp className="mt-6 max-w-3xl" delay={0.06}>
          <p className="font-display text-2xl font-bold leading-snug md:text-4xl">
            {caseStudy.challenge}
          </p>
        </FadeUp>
      </section>

      <FeatureFrame image={galleryFeature} />

      <section className="container-page pb-16 md:pb-24">
        <div className="grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
          <div className="flex flex-col gap-10">
            {caseStudy.insight && (
              <FadeUp>
                <p className="eyebrow text-[var(--text-muted)]">Insight</p>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
                  {caseStudy.insight}
                </p>
              </FadeUp>
            )}

            <FadeUp delay={0.06}>
              <p className="eyebrow text-[var(--text-muted)]">The idea</p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
                {caseStudy.idea}
              </p>
            </FadeUp>

            {caseStudy.execution.length > 0 && (
              <FadeUp delay={0.1}>
                <p className="eyebrow text-[var(--text-muted)]">Execution</p>
                <ol className="mt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  {caseStudy.execution.map((step, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[2.25rem_1fr] gap-4 border-b py-4"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span
                        className="font-display pt-0.5 text-sm font-semibold tabular-nums"
                        style={{ color: "var(--brand-accent)" }}
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base leading-relaxed text-[var(--text)]">{step}</span>
                    </li>
                  ))}
                </ol>
              </FadeUp>
            )}

            {caseStudy.testimonial && caseStudy.testimonial.approvalConfirmed && (
              <FadeUp delay={0.12}>
                <blockquote
                  className="border-l-2 pl-5 font-display text-lg leading-snug text-[var(--text)] md:text-2xl"
                  style={{ borderColor: "var(--brand-accent)" }}
                >
                  &ldquo;{caseStudy.testimonial.quote}&rdquo;
                  <footer className="font-sans mt-4 text-sm text-[var(--text-muted)]">
                    {caseStudy.testimonial.name}, {caseStudy.testimonial.role}
                  </footer>
                </blockquote>
              </FadeUp>
            )}

            {videoUrl && (
              <FadeUp delay={0.14}>
                <VideoCta videoUrl={videoUrl} />
              </FadeUp>
            )}
          </div>

          <FadeUp className="md:sticky md:top-[calc(var(--header-height)+3rem)] md:self-start" delay={0.08}>
            <MetaList label="Scope" items={caseStudy.scope} />
          </FadeUp>
        </div>

        {caseStudy.disclosure && (
          <p className="mt-12 max-w-2xl text-xs text-[var(--text-muted)]">{caseStudy.disclosure}</p>
        )}
      </section>

      <ResultsBand results={caseStudy.results} />
    </>
  );
}
