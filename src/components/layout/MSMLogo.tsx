import Image from "next/image";
import Link from "next/link";

/**
 * SOTAPO masterbrand wordmark, the Growth Gradient direction: weight and
 * tone climb letter by letter from a quiet grey "so" to the final O in full
 * Signal Red. This is the site-wide logo; MSM CampusOS only appears as a
 * secondary, endorsed lockup inside the education page itself (see the
 * eyebrow on /campusos).
 *
 * Two real approved renderings, not one image boxed for both surfaces: the
 * light-background mark (public/brand/sotapo-logo.png, near-black "TAP")
 * for the header, and the dedicated dark-surface mark
 * (public/brand/sotapo-logo-dark.png, pale "so"/"TAP") for the footer and
 * any other dark section, so it reads straight off the dark surface instead
 * of sitting on a white patch.
 *
 * Scale: 32px tall on mobile, stepping to 44px at xl. The lockup is wide
 * (~4.2:1), so every pixel of height costs several of width in a row that
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
      <Image
        src={inverse ? "/brand/sotapo-logo-dark.png" : "/brand/sotapo-logo.png"}
        alt="SOTAPO"
        width={1364}
        height={323}
        priority
        className="h-8 w-auto md:h-9 lg:h-10 xl:h-11"
      />
    </Link>
  );
}
