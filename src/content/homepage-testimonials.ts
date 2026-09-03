import type { ClientTestimonial } from "./types";
import { education } from "./education";
import { automotive } from "./automotive";
import { healthcare } from "./healthcare";
import { realEstate } from "./real-estate";

// PLACEHOLDER TESTIMONIAL CONTENT, replace with real, approved client quotes
// before public launch. Attribution intentionally uses a role only, never a
// fabricated person's name. Sourced from the automotive, healthcare, and
// real-estate industry content files; see each file for the full roster.

// A curated subset for the homepage, one or two per industry rather than the
// full fourteen, so the section stays scannable above the fold.
const selectedNames = new Set([
  // Education leads: it is the flagship vertical and these are the only
  // testimonials on the site from named institutions rather than role-only
  // placeholders.
  "Reliance Animation Academy",
  "Adamas University",
  "RICS Amity University",
  "BMW",
  "Royal Enfield",
  "Fortis Healthcare",
  "Tata 1mg",
  "M3M",
  "Ganga Realty",
]);

export const homepageTestimonials: ClientTestimonial[] = [
  ...(education.testimonials ?? []),
  ...(automotive.testimonials ?? []),
  ...(healthcare.testimonials ?? []),
  ...(realEstate.testimonials ?? []),
].filter((testimonial) => selectedNames.has(testimonial.clientName));
