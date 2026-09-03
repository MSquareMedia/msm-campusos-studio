import { education } from "./education";
import { automotive } from "./automotive";
import { healthcare } from "./healthcare";
import { realEstate } from "./real-estate";
import type { IndustryContent } from "./types";

/**
 * The four industry client lists, assembled into one ordered set of lanes for
 * the homepage logo carousel.
 *
 * Nothing is retyped here: every name, logo path and disclosure line is read
 * straight off the industry content files, so a logo added to an industry page
 * appears in the lane automatically and the two can never drift apart.
 *
 * Education leads, by request.
 *
 * The per-industry `disclosure` strings travel with the logos. They are an
 * accuracy statement about which engagements were MSM CampusOS's and which
 * belong to the leadership's prior careers, and dropping them for layout
 * reasons would turn an honest logo wall into a false one.
 */

export type ClientLane = {
  /** Route slug of the industry page, used as a stable key. */
  id: string;
  label: string;
  href: string;
  logos: Array<{ name: string; src: string }>;
  disclosure: string;
};

const ORDER: IndustryContent[] = [education, automotive, healthcare, realEstate];

export const clientLanes: ClientLane[] = ORDER.flatMap((industry) => {
  const clients = industry.clients;
  if (!clients || clients.logos.length === 0) return [];
  return [
    {
      id: industry.slug,
      label: industry.industryLabel,
      // Education is the one industry that lives at /campusos (Sotapo
      // Education, powered by MSM CampusOS); every other industry is a
      // root-level SOTAPO page.
      href: industry.slug === "education" ? "/campusos" : `/${industry.slug}`,
      logos: clients.logos,
      disclosure: clients.disclosure,
    },
  ];
});
