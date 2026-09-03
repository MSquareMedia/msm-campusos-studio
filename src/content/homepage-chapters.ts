import type { Chapter } from "@/components/motion/StickyChapters";

/**
 * The homepage narrative: the four industries SOTAPO is already
 * flagship in, told as chapters rather than listed as a grid.
 *
 * Framing copy only. Every chapter restates a proposition that already
 * exists on that industry's own page, no new claims, clients, outcomes, or
 * numbers are introduced here.
 */
export const homepageChapters: Chapter[] = [
  {
    eyebrow: "Education",
    heading: "A campus sells a decision, not a degree.",
    body: "Enrollment turns on one question a family asks quietly at a kitchen table. We build the answer, then make sure it reaches them.",
    imageIndia: "/images/education/campus-india.jpg",
    altIndia: "Modern red-brick university campus in India in daylight",
    imageGlobal: "/images/education/campus-break.jpg",
    altGlobal: "Red-brick university campus buildings along a quiet street at dusk",
    ctaHref: "/",
  },
  {
    eyebrow: "Automotive",
    heading: "The showroom starts on a phone.",
    body: "By the time someone walks in, the shortlist is already written. We work upstream of the test drive, where the decision actually forms.",
    imageIndia: "/images/automotive/hero-india.jpg",
    altIndia: "An SUV on an Indian highway at dusk",
    imageGlobal: "/images/automotive/hero.jpg",
    altGlobal: "Detail of a modern car exterior",
    ctaHref: "/automotive",
  },
  {
    eyebrow: "Healthcare",
    heading: "Trust is the entire funnel.",
    body: "Nobody books a specialist on a discount. Health marketing earns its appointment through credibility, clarity, and restraint.",
    imageIndia: "/images/healthcare/hero-india.jpg",
    altIndia: "A physician in a modern diagnostic imaging suite in India",
    imageGlobal: "/images/healthcare/hero.jpg",
    altGlobal: "Interior of a modern healthcare facility",
    ctaHref: "/healthcare",
  },
  {
    eyebrow: "Real Estate",
    heading: "Market the life inside the address.",
    body: "A building is concrete until someone can picture a Sunday in it. That picture is the product we make.",
    imageIndia: "/images/real-estate/hero-india.jpg",
    altIndia: "A premium modern living room interior in an Indian home",
    imageGlobal: "/images/real-estate/hero.jpg",
    altGlobal: "Modern residential interior with natural light",
    ctaHref: "/real-estate",
  },
];
