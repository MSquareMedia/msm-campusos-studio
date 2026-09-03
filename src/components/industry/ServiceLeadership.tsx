import Image from "next/image";
import { TextReveal, FadeUp } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { toLines } from "@/lib/text";
import type { ServiceLeadershipRole, TeamMember } from "@/content/types";

/**
 * Heads of service: Content Head, SEO Head, and the rest of the service lines.
 *
 * No such person exists in this codebase yet, and this project does not invent
 * people (see the placeholder-testimonial notes in src/content/*.ts, where
 * attribution is role-only for exactly this reason). So the section is driven
 * entirely by `members`, which ships empty, and falls back to naming the SEATS
 * rather than fabricating anyone to sit in them.
 *
 * The empty state is deliberately not an apology or a row of grey avatar
 * circles. A named seat with a real scope attached is genuine information for
 * an institution deciding who would own its SEO or its accreditation file, and
 * it is honest about the fact that the individual is not announced yet. The
 * moment a real head is added to `members` in the content file, this section
 * switches to the portrait grid and the seat list disappears.
 */
export function ServiceLeadership({
  heading,
  intro,
  members,
  roles,
  note,
  ctaLabel,
  ctaHref,
}: {
  heading: string;
  intro: string;
  members: TeamMember[];
  roles: ServiceLeadershipRole[];
  note: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  const hasPeople = members.length > 0;

  // Nothing at all to show: no named heads and no seats defined. Render
  // nothing rather than an empty heading with a rule under it.
  if (!hasPeople && roles.length === 0) return null;

  return (
    // No background of its own, see ModernServicesExplorer's note on why.
    <section className="border-t" style={{ borderColor: "var(--border)" }}>
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

        {hasPeople ? (
          // Eight to a row on desktop rather than four: this is a "know the
          // team" roster, not a leadership showcase, so smaller tiles that
          // read at a glance suit it better than large portrait cards. Bio is
          // clamped to two lines at this density; the full line still lives
          // in the content file for anyone who wants it on hover/tap.
          <div
            className="mt-16 grid grid-cols-3 gap-x-5 gap-y-10 border-t pt-12 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
            style={{ borderColor: "var(--border)" }}
          >
            {members.map((member, i) => (
              <FadeUp key={member.name} y={14} delay={(i % 8) * 0.04}>
                <div className="group flex h-full flex-col" title={member.bio}>
                  {member.photo ? (
                    <div
                      className="relative aspect-[4/5] w-full overflow-hidden"
                      style={{ background: "var(--surface-muted)" }}
                    >
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        sizes="(min-width: 1024px) 11vw, (min-width: 640px) 22vw, 30vw"
                        className="object-cover transition-transform duration-[600ms] [transition-timing-function:var(--ease-out-strong)] group-hover:scale-[1.04]"
                      />
                    </div>
                  ) : (
                    // Initials rather than a stock portrait or a silhouette
                    // icon. A generic stand-in face reads as a real person the
                    // reader cannot quite make out; initials read honestly as
                    // "no photograph yet" while keeping the grid's rhythm.
                    <div
                      aria-hidden="true"
                      className="flex aspect-[4/5] w-full items-center justify-center"
                      style={{ background: "var(--surface-muted)" }}
                    >
                      <span
                        className="font-display text-xl font-bold"
                        style={{ color: "var(--border)" }}
                      >
                        {member.name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                  <h3 className="font-display mt-3 text-xs font-semibold leading-tight">
                    {member.name}
                  </h3>
                  <p
                    className="font-display text-[10px] font-semibold leading-tight"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    {member.role}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-[10px] leading-snug text-[var(--text-muted)]">
                    {member.bio}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        ) : (
          <ul
            className="mt-16 grid border-t sm:grid-cols-2 lg:grid-cols-3"
            style={{ borderColor: "var(--border)" }}
          >
            {roles.map((role, i) => (
              <li
                key={role.title}
                className="border-b py-7 pr-8"
                style={{ borderColor: "var(--border)" }}
              >
                <FadeUp y={12} delay={(i % 3) * 0.05}>
                  <span
                    className="block h-[2px] w-8"
                    style={{ background: "var(--brand-accent)" }}
                    aria-hidden="true"
                  />
                  <h3 className="font-display mt-4 text-lg font-bold leading-tight">
                    {role.title}
                  </h3>
                  <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-[var(--text-muted)]">
                    {role.scope}
                  </p>
                </FadeUp>
              </li>
            ))}
          </ul>
        )}

        {!hasPeople && (
          <FadeUp delay={0.1} className="mt-12">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
              <p
                className="max-w-xl border-l-2 pl-5 text-base leading-relaxed"
                style={{ borderColor: "var(--brand-accent)" }}
              >
                {note}
              </p>
              <MagneticButton href={ctaHref} variant="ghost" className="shrink-0 whitespace-nowrap">
                {ctaLabel}
              </MagneticButton>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}
