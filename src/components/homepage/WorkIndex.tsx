"use client";

import { useMemo, type ReactNode } from "react";
import { MouseRevealImage } from "@/components/motion/MouseRevealImage";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import type { PortfolioPiece } from "@/content/portfolio";

/** Module-level so the memo dependency is stable across renders. */
const DEFAULT_LEAD_SECTORS = ["education"];

/**
 * The work, as an index rather than a card grid.
 *
 * A grid of thumbnails asks the visitor to evaluate fourteen things at once
 * and shows every image at postage-stamp size. A typographic index reads fast,
 * puts the client names at headline scale, and holds each image back until the
 * cursor asks for it, which is also the only reason the image is worth
 * showing at 300px instead of 120px.
 *
 * Ordering: sectors named in `leadSectors` are pulled to the front, in the
 * order they are named, and everything else keeps its authored order behind
 * them. The match is made against the piece's own `category` and `services`
 * strings, so a piece leads only if it genuinely says it belongs to that
 * sector. Nothing here relabels a piece to make it qualify.
 *
 * IDP and Adamas University (both real, both linked to a full case study in
 * `src/content/case-studies.ts`) carry "Education" in their category, so
 * `leadSectors={["education"]}` now genuinely pulls them to the front rather
 * than being a no-op waiting for content that didn't exist yet.
 */
export function WorkIndex({
  pieces,
  leadSectors = DEFAULT_LEAD_SECTORS,
  headlineLines = ["Work this team", "has already shipped."],
  standfirst = "Brands built before SOTAPO, by the people who now run it.",
  highlights,
}: {
  pieces: PortfolioPiece[];
  /** Rendered between the heading and the index. Engagements with disclosed
   *  numbers lead; the typographic index below carries breadth. */
  highlights?: ReactNode;
  /** Sector keywords pulled to the front of the index, in the order given. */
  leadSectors?: string[];
  /** Section headline, one array entry per rendered line. */
  headlineLines?: string[];
  standfirst?: string;
}) {
  const ordered = useMemo(() => {
    if (leadSectors.length === 0) return pieces;

    const rank = (piece: PortfolioPiece) => {
      const haystack = [piece.category, ...(piece.services ?? [])].join(" ").toLowerCase();
      const hit = leadSectors.findIndex((sector) => haystack.includes(sector.toLowerCase()));
      return hit === -1 ? leadSectors.length : hit;
    };

    // Decorate-sort-undecorate keeps the authored order inside each rank,
    // which Array.prototype.sort only guarantees for equal comparisons.
    return pieces
      .map((piece, index) => ({ piece, index, rank: rank(piece) }))
      .sort((a, b) => a.rank - b.rank || a.index - b.index)
      .map((entry) => entry.piece);
  }, [pieces, leadSectors]);

  return (
    <section className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container-page py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TextReveal
            lines={headlineLines}
            className="font-display max-w-2xl text-3xl font-extrabold leading-[1.06] tracking-tight md:text-5xl"
          />
          <FadeUp delay={0.15}>
            <p className="max-w-xs text-sm text-[var(--text-muted)]">{standfirst}</p>
          </FadeUp>
        </div>

        {highlights}

        <div className="mt-14 border-t" style={{ borderColor: "var(--border)" }}>
          {ordered.map((piece) => (
            <MouseRevealImage
              key={piece.slug}
              label={piece.title}
              meta={piece.category}
              src={piece.image}
              alt={piece.title}
              href={`/work/${piece.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
