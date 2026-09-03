import Image from "next/image";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { toLines } from "@/lib/text";
import type { LeaderQuote, TeamMember } from "@/content/types";

function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Five faces on one row, each bordered and padded like a product card, made
 * the bench read as a catalogue. The frames are now edge to edge with the
 * names set beneath them, which is how a masthead is laid out, and the
 * leadership quotes lead the section instead of trailing it: they are the
 * strongest thing here and were buried below the grid.
 *
 * `quotes` is optional. Pages that give the founder and president their own
 * section (see LeadershipVision) omit it, and this becomes the delivery bench
 * on its own; call sites that still pass quotes render exactly as before.
 */
export function TeamSection({
  heading,
  intro,
  members,
  quotes = [],
}: {
  heading: string;
  intro: string;
  members: TeamMember[];
  quotes?: LeaderQuote[];
}) {
  return (
    // No background of its own, see ModernServicesExplorer's note on why.
    <section>
      <div className="container-page py-24 md:py-36">
        <div className="max-w-2xl">
          <TextReveal
            lines={toLines(heading)}
            className="font-display text-3xl font-bold leading-[1.06] md:text-5xl"
          />
          <FadeUp delay={0.1}>
            <p className="mt-5 text-lg text-[var(--text-muted)]">{intro}</p>
          </FadeUp>
        </div>

        {quotes.length > 0 && (
          <div
            className="mt-14 grid gap-10 border-t pt-10 md:grid-cols-2 md:gap-16"
            style={{ borderColor: "var(--border)" }}
          >
            {quotes.map((q, i) => (
              <FadeUp key={q.name} y={14} delay={i * 0.07}>
                <blockquote className="flex h-full flex-col gap-6">
                  <p className="font-display text-xl leading-snug md:text-2xl">
                    &ldquo;{q.quote}&rdquo;
                  </p>
                  <footer className="mt-auto flex items-center gap-4">
                    {q.photo ? (
                      <div
                        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full"
                        style={{ background: "var(--surface-muted)" }}
                      >
                        <Image src={q.photo} alt={q.name} fill sizes="56px" className="object-cover" />
                      </div>
                    ) : (
                      <div
                        className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                        style={{ background: "var(--surface-inverse)", color: "var(--brand-accent)" }}
                        aria-hidden="true"
                      >
                        {initials(q.name)}
                      </div>
                    )}
                    <span className="text-sm text-[var(--text-muted)]">
                      <span className="font-display block font-semibold text-[var(--text)]">
                        {q.name}
                      </span>
                      {q.role}
                    </span>
                  </footer>
                </blockquote>
              </FadeUp>
            ))}
          </div>
        )}

        <div
          className="mt-16 grid gap-x-6 gap-y-12 border-t pt-12 sm:grid-cols-2 lg:grid-cols-5"
          style={{ borderColor: "var(--border)" }}
        >
          {members.map((member, i) => (
            <FadeUp key={member.name} y={14} delay={(i % 5) * 0.05}>
              <div className="group flex h-full flex-col">
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden"
                  style={{ background: "var(--surface)" }}
                >
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-[600ms] [transition-timing-function:var(--ease-out-strong)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div
                      className="font-display flex h-full items-center justify-center text-3xl font-bold"
                      style={{ background: "var(--surface-inverse)", color: "var(--brand-accent)" }}
                      aria-hidden="true"
                    >
                      {initials(member.name)}
                    </div>
                  )}
                </div>
                <h3 className="font-display mt-4 text-base font-semibold">{member.name}</h3>
                <p
                  className="font-display text-xs font-semibold"
                  style={{ color: "var(--brand-accent)" }}
                >
                  {member.role}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">{member.bio}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
