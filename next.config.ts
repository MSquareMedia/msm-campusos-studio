import type { NextConfig } from "next";

/**
 * Route map after the SOTAPO rebrand: the masterbrand moved from /campusos
 * to site root, and /campusos is now reserved for the one vertical that goes
 * deeper than marketing — Sotapo Education, powered by MSM CampusOS.
 * Permanent redirects here catch anyone (or any search engine) still holding
 * a pre-rebrand /campusos/* URL.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/campusos/about", destination: "/about", permanent: true },
      { source: "/campusos/audit", destination: "/audit", permanent: true },
      { source: "/campusos/automotive", destination: "/automotive", permanent: true },
      { source: "/campusos/careers", destination: "/careers", permanent: true },
      { source: "/campusos/case-studies", destination: "/case-studies", permanent: true },
      { source: "/campusos/contact", destination: "/contact", permanent: true },
      { source: "/campusos/education", destination: "/campusos", permanent: true },
      { source: "/campusos/healthcare", destination: "/healthcare", permanent: true },
      { source: "/campusos/real-estate", destination: "/real-estate", permanent: true },
      { source: "/campusos/solutions/:slug", destination: "/solutions/:slug", permanent: true },
      { source: "/campusos/work", destination: "/work", permanent: true },
      { source: "/campusos/work/:slug", destination: "/work/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
