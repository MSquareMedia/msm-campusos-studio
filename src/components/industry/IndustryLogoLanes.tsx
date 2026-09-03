import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ClientLane } from "@/content/client-lanes";

/**
 * Client logos as one horizontal lane per industry.
 *
 * A single mixed logo wall flattens four different bodies of work into one
 * undifferentiated wall of marks. One lane per industry keeps the sectors
 * legible, puts a count and a way through next to each set, and lets the
 * education lane lead without pretending the others do not exist.
 *
 * Deliberately a server component: everything moves in CSS.
 *   - The track holds two copies of the logo set and translates -50% on a
 *     linear infinite animation, which runs off the main thread. The second
 *     copy is aria-hidden so a screen reader reads nineteen institutions once,
 *     not thirty-eight.
 *   - Lane speed scales with how many logos the lane holds, so a four-logo
 *     lane and a nineteen-logo lane travel at the same pixels per second.
 *   - Alternating lanes run in reverse. Four lanes moving in lockstep read as
 *     one object; alternating them reads as four.
 *   - Under `prefers-reduced-motion` the animation is not slowed, it is gone:
 *     the duplicate set is removed from the layout entirely and the remaining
 *     set wraps into a static grid.
 *
 * The per-industry disclosure lines are rendered under the lanes rather than
 * dropped. They state which engagements were SOTAPO's own and which
 * belong to the leadership's earlier careers, which is the difference between
 * an honest logo wall and a misleading one.
 */

/** Seconds of travel per logo. Constant across lanes, so speed is constant. */
const SECONDS_PER_LOGO = 4.2;

export type IndustryLogoLanesProps = {
  lanes: ClientLane[];
  headlineLines?: string[];
  standfirst?: string;
  /** Label on each lane's link through to that industry page. */
  exploreLabel?: string;
};

export function IndustryLogoLanes({
  lanes,
  headlineLines = ["Who the team has", "worked with."],
  standfirst = "Four sectors, one lane each. Follow a lane through to the work behind it.",
  exploreLabel = "Explore",
}: IndustryLogoLanesProps) {
  // Identical disclosures across two industries would otherwise print twice.
  const disclosures = lanes.reduce<Array<{ label: string; text: string }>>((acc, lane) => {
    if (acc.some((d) => d.text === lane.disclosure)) return acc;
    return [...acc, { label: lane.label, text: lane.disclosure }];
  }, []);

  return (
    // No background of its own, see ModernServicesExplorer's note on why.
    <section className="mcos-lanes border-t" style={{ borderColor: "var(--border)" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes mcos-lane-scroll {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}
.mcos-lanes .mcos-lane-track {
  display: flex;
  width: max-content;
  animation: mcos-lane-scroll var(--lane-duration, 40s) linear infinite;
}
.mcos-lanes .mcos-lane-track[data-reverse="true"] { animation-direction: reverse; }
.mcos-lanes .mcos-lane-viewport:hover .mcos-lane-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .mcos-lanes .mcos-lane-viewport {
    overflow: visible;
    mask-image: none;
    -webkit-mask-image: none;
  }
  .mcos-lanes .mcos-lane-track {
    animation: none;
    width: 100%;
    flex-wrap: wrap;
  }
  /* The set is a shrink-0 flex item while it is a marquee, which is exactly
     what must stop once it becomes a static grid: without this it keeps its
     content width, overflows the lane and rides over the meta column. */
  .mcos-lanes .mcos-lane-set {
    flex-wrap: wrap;
    flex-shrink: 1;
    width: 100%;
    padding-left: 0;
    gap: 1.5rem 2.5rem;
  }
  .mcos-lanes .mcos-lane-duplicate { display: none; }
}`,
        }}
      />

      <div className="container-page pt-20 md:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display max-w-2xl text-3xl font-extrabold leading-[1.06] tracking-tight md:text-5xl">
            {headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="max-w-xs text-sm text-[var(--text-muted)]">{standfirst}</p>
        </div>
      </div>

      <div className="container-page mt-12 border-t" style={{ borderColor: "var(--border)" }}>
        {lanes.map((lane, i) => (
          <div
            key={lane.id}
            className="grid items-center gap-y-5 border-b py-8 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-x-8 md:py-9"
            style={{ borderColor: "var(--border)" }}
          >
            {/* -------------------------------------------------- meta column */}
            <div>
              <p className="flex items-baseline gap-3">
                <span
                  className="font-display text-xs font-semibold tabular-nums tracking-[0.18em]"
                  style={{ color: "var(--brand-accent)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl font-bold leading-none md:text-2xl">
                  {lane.label}
                </span>
              </p>
              <Link
                href={lane.href}
                className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-semibold
                           transition-transform duration-200
                           [transition-timing-function:var(--ease-out-strong)]
                           hover:translate-x-0.5 active:scale-[0.97]"
                style={{ color: "var(--brand-accent-dark)" }}
              >
                {exploreLabel}
                <ArrowRight size={15} weight="bold" aria-hidden="true" />
                <span className="sr-only"> {lane.label}</span>
              </Link>
            </div>

            {/* ------------------------------------------------------- track */}
            <div
              className="mcos-lane-viewport overflow-hidden
                         [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]
                         [-webkit-mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]"
            >
              <div
                className="mcos-lane-track"
                data-reverse={i % 2 === 1 ? "true" : undefined}
                style={
                  {
                    "--lane-duration": `${(lane.logos.length * SECONDS_PER_LOGO).toFixed(1)}s`,
                  } as React.CSSProperties
                }
              >
                <LogoSet lane={lane} />
                <LogoSet lane={lane} duplicate />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container-page py-10 md:py-12">
        <ul className="flex max-w-3xl flex-col gap-2">
          {disclosures.map((disclosure) => (
            <li key={disclosure.label} className="text-xs leading-relaxed text-[var(--text-muted)]">
              {/* The industry prefix only earns its place when the sectors
                  actually say different things. Once they share one line, a
                  leading "Education." would imply the sentence covers only
                  that lane when it covers all four. */}
              {disclosures.length > 1 && (
                <>
                  <span className="font-display font-semibold" style={{ color: "var(--text)" }}>
                    {disclosure.label}.
                  </span>{" "}
                </>
              )}
              {disclosure.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LogoSet({ lane, duplicate = false }: { lane: ClientLane; duplicate?: boolean }) {
  return (
    <ul
      className={`mcos-lane-set flex shrink-0 items-center gap-10 pl-10 md:gap-14 md:pl-14 ${
        duplicate ? "mcos-lane-duplicate" : ""
      }`}
      aria-hidden={duplicate || undefined}
    >
      {lane.logos.map((logo) => (
        <li key={logo.name} className="shrink-0">
          <Image
            src={logo.src}
            alt={duplicate ? "" : logo.name}
            width={220}
            height={96}
            /* Capped on both axes: a wide wordmark left uncapped takes over
               the lane and turns a set of peers into one logo with company. */
            className="h-11 w-auto max-w-[130px] object-contain md:h-14 md:max-w-[170px]"
          />
        </li>
      ))}
    </ul>
  );
}
