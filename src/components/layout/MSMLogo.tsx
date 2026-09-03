import Image from "next/image";
import Link from "next/link";

/**
 * SOTAPO masterbrand wordmark (public/brand/sotapo-logo.png), the Growth
 * Gradient direction: weight and tone climb letter by letter from a quiet
 * grey "so" to the final O in full Signal Red. This is the site-wide logo;
 * MSM CampusOS only appears as a secondary, endorsed lockup inside the
 * education page itself (see the eyebrow on /campusos).
 *
 * On dark surfaces it sits on a small white plate rather than being
 * recolored or inverted, since the wordmark's ink and grey tones would
 * otherwise lose contrast.
 *
 * Scale: 32px tall on mobile, stepping to 44px at xl. The lockup is wide
 * (~3.8:1), so every pixel of height costs nearly four of width in a row that
 * also has to hold five nav items and two CTAs. The steps are tied to the same
 * breakpoints the nav uses to add items back, so the row gains logo and gains
 * items in step rather than fighting for the same space.
 */
export function MSMLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center shrink-0"
      aria-label="SOTAPO home"
    >
      <span
        className={inverse ? "flex items-center rounded-[2px] bg-white px-2 py-1.5" : "flex items-center"}
      >
        <Image
          src="/brand/sotapo-logo.png"
          alt="SOTAPO"
          width={347}
          height={92}
          priority
          className="h-8 w-auto md:h-9 lg:h-10 xl:h-11"
        />
      </span>
    </Link>
  );
}
