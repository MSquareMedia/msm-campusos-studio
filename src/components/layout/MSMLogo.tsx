import Image from "next/image";
import Link from "next/link";

/**
 * SOTAPO masterbrand wordmark, the Growth Gradient direction: weight and
 * tone climb letter by letter from a quiet grey/white "so" to the final O in
 * full Signal Red. This is the site-wide logo; MSM CampusOS only appears as
 * a secondary, endorsed lockup inside the education page itself (see the
 * eyebrow on /campusos).
 *
 * Two real renderings, not one image boxed for both surfaces: the light-
 * background mark is the approved raster (public/brand/sotapo-logo.png,
 * grey "so", near-black "TAP"), and the dark-surface mark is the same
 * lockup set directly in type, white "so"/"TAP" and the same Signal Red O,
 * so it reads straight off the dark surface instead of sitting on a white
 * patch.
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
      {inverse ? (
        <span className="font-display flex items-baseline text-2xl font-extrabold leading-none tracking-tight md:text-[28px] lg:text-3xl xl:text-[34px]">
          <span className="font-medium text-white/60">so</span>
          <span className="text-white">TAP</span>
          <span style={{ color: "var(--brand-accent)" }}>O</span>
        </span>
      ) : (
        <Image
          src="/brand/sotapo-logo.png"
          alt="SOTAPO"
          width={347}
          height={92}
          priority
          className="h-8 w-auto md:h-9 lg:h-10 xl:h-11"
        />
      )}
    </Link>
  );
}
