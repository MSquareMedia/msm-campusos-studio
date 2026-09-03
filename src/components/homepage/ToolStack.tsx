import { Reveal } from "@/components/industry/Reveal";

type Tool = { name: string; slug: string };

// Real brand marks via Simple Icons (CC0), restricted to the subset of the
// stack named in the SOTAPO "Saving Cost, Growing Admissions"
// briefing slide that Simple Icons actually carries. No invented marks for
// the niche martech tools (Karix, Sitechecker, WebEngage, etc.) that aren't
// in that catalog, an incomplete real wall beats a padded fake one.
const TOOLS: Tool[] = [
  { name: "Google Ads", slug: "googleads" },
  { name: "Meta", slug: "meta" },
  { name: "Google Analytics", slug: "googleanalytics" },
  { name: "Google Search Console", slug: "googlesearchconsole" },
  { name: "Google Tag Manager", slug: "googletagmanager" },
  { name: "Display & Video 360", slug: "googledisplayandvideo360" },
  { name: "SEMrush", slug: "semrush" },
  { name: "Metabase", slug: "metabase" },
  { name: "WhatsApp Business", slug: "whatsapp" },
  { name: "Instagram", slug: "instagram" },
  { name: "Copilot", slug: "githubcopilot" },
];

export function ToolStack() {
  return (
    <section className="border-y" style={{ borderColor: "var(--border)" }}>
      <div className="container-page py-16 md:py-20">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            The stack running behind every campaign
          </h2>
          <p className="mt-3 text-[var(--text-muted)]">
            Media, analytics, and reporting tools this team runs day to day, pulled from the same
            briefing deck as the numbers above.
          </p>
        </Reveal>
        <Reveal y={12} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-8">
          {TOOLS.map((tool) => (
            <div
              key={tool.slug}
              className="flex items-center gap-3 opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              title={tool.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${tool.slug}`}
                alt={tool.name}
                width={28}
                height={28}
                className="h-7 w-7 shrink-0"
                loading="lazy"
              />
              <span className="font-display text-sm font-medium text-[var(--text-muted)]">
                {tool.name}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
