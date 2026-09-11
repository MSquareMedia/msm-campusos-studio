"use client";

/**
 * Captures marketing campaign parameters (UTM & Google Click ID) from the URL.
 * Completely invisible to the user; operates silently in the background.
 */
export function getClientUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};

  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};

    const keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
    ];

    for (const key of keys) {
      const val = params.get(key);
      if (val) {
        utm[key] = val.slice(0, 100);
      }
    }

    return utm;
  } catch {
    return {};
  }
}
