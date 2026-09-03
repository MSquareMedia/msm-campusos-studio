"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { usePrefersReducedMotion } from "@/lib/motion";

export function ClientWordmarks({
  heading,
  disclosure,
  logos,
  size = "md",
}: {
  heading: string;
  disclosure: string;
  logos: Array<{ name: string; src: string }>;
  size?: "md" | "lg";
}) {
  const reducedMotion = usePrefersReducedMotion();
  const track = [...logos, ...logos];
  const logoHeightClass = size === "lg" ? "h-20 w-auto object-contain md:h-28" : "h-16 w-auto object-contain md:h-20";

  return (
    <section className="py-16 md:py-20">
      <div className="container-page">
        <Reveal>
          <p className="font-display text-sm font-semibold text-[var(--text-muted)]">{heading}</p>
        </Reveal>
      </div>

      {reducedMotion ? (
        <div className="container-page mt-8 flex flex-wrap items-center gap-x-12 gap-y-8">
          {logos.map((logo) => (
            <Image
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              width={220}
              height={96}
              className={logoHeightClass}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee-track flex w-max items-center gap-14">
            {track.map((logo, i) => (
              <Image
                key={`${logo.name}-${i}`}
                src={logo.src}
                alt={logo.name}
                width={220}
                height={96}
                className={`${logoHeightClass} shrink-0`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="container-page">
        <p className="mt-8 max-w-xl text-xs text-[var(--text-muted)]">{disclosure}</p>
      </div>
    </section>
  );
}
