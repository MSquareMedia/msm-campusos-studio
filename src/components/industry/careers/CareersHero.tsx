import Link from "next/link";
import { AgencyMotionBackdrop } from "@/components/homepage/AgencyMotionBackdrop";
import { OrbitRings } from "@/components/OrbitRings";
import { MagneticButton } from "@/components/MagneticButton";
import { primaryCta } from "@/lib/site-config";

/**
 * Careers page hero. Reuses the homepage's industry-neutral animated
 * backdrop (this page isn't scoped to one of the four industry verticals,
 * so it deliberately doesn't borrow IndustryHero's per-industry
 * PlaceholderMedia/photo system) plus the same OrbitRings motif used behind
 * other agency-wide hero copy. No GSAP entrance timeline and no
 * ScrollTrigger pin, just the static layout IndustryHero itself uses.
 */
export function CareersHero({
  eyebrow,
  headline,
  supportingCopy,
}: {
  eyebrow: string;
  headline: string;
  supportingCopy: string;
}) {
  return (
    <section className="relative flex items-center overflow-hidden" style={{ minHeight: "82vh" }}>
      <AgencyMotionBackdrop />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.15) 100%)",
        }}
        aria-hidden="true"
      />
      <OrbitRings className="right-[-140px] top-1/2 h-[520px] w-[520px] -translate-y-1/2 md:right-[-20px]" />

      <div className="container-page relative z-10 py-28 text-white md:py-36">
        <p className="eyebrow text-[var(--brand-accent)]">{eyebrow}</p>
        <h1 className="font-display mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] md:text-6xl md:leading-[1.06]">
          {headline}
        </h1>
        <p className="mt-6 max-w-lg text-base text-white/85 md:text-lg">{supportingCopy}</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <MagneticButton>
            <Link href={primaryCta.href} className="btn btn-primary">
              {primaryCta.label}
            </Link>
          </MagneticButton>
          <MagneticButton>
            <a href="#culture" className="btn btn-secondary text-white border-white">
              See what we value
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
