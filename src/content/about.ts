// Framing copy for the /about narrative. Chapter labels and
// connective sentences only, no facts, names, or numbers live here. Every
// factual claim on the page traces back to src/content/education.ts or
// src/content/homepage.ts.
//
// Numeral and label are separate fields so the page can set them as a real
// masthead mark (a large numeral beside a plain label) rather than joining
// them into one punctuated string.
export const about = {
  // This page's own opening statement, distinct from the homepage's, so a
  // visitor who lands on both doesn't read the same line twice.
  statement: {
    line: "SOTAPO is the judgment about which direction actually matters.",
    body: "Every agency can point revenue up. Fewer can tell you when the right move is cost down, customers closer, or the campaign you didn't run. That judgment is what the people on this page have spent their careers building, in education first, and now everywhere else.",
  },
  chapters: {
    origin: {
      numeral: "I",
      label: "Where this started",
    },
    people: {
      numeral: "II",
      label: "Who's behind it",
      wordsHeading: "In their own words",
      benchLabel: "The bench",
    },
    standard: {
      numeral: "III",
      label: "What we hold everyone to",
      heading: "What holding one standard actually means",
      lead: "Every engagement runs on the same five disciplines. Not a checklist, a floor.",
    },
    proof: {
      numeral: "IV",
      label: "By the numbers",
    },
  },
};
