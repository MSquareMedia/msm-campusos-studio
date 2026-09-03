import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/industry/Reveal";
import type { PortfolioPiece } from "@/content/portfolio";

export function PortfolioStrip({
  heading,
  intro,
  pieces,
}: {
  heading: string;
  intro: string;
  pieces: PortfolioPiece[];
}) {
  return (
    <section id="works" className="container-page py-20 md:py-28">
      <Reveal className="max-w-2xl">
        <p className="eyebrow text-[var(--text-muted)]">Selected work</p>
        <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">{heading}</h2>
        <p className="mt-4 text-lg text-[var(--text-muted)]">{intro}</p>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pieces.map((piece, i) => (
          <Reveal key={piece.title} y={16} delay={(i % 3) * 0.08}>
            <Link
              href={`/work/${piece.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden"
            >
              <Image
                src={piece.image}
                alt={piece.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-1"
              />
              <div
                className="absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-90"
                style={{
                  background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 55%)",
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
                <div>
                  <p className="eyebrow text-[var(--brand-accent)]">{piece.category}</p>
                  <h3 className="font-display mt-1 text-xl font-bold">{piece.title}</h3>
                </div>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
