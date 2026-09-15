// Scrape sources for UniFlat Finder live pricing.
//
// Only operators that publish prices in a machine-readable form are listed.
// Scape embeds a `propertiesPriceData` JSON array in each building page
// containing the lowest available rate per room type, plus semester and
// sold-out markers. UniLodge, Iglu, Yugo, Journal and Student Village publish
// prices only behind their booking engines, so they keep a dated baseline
// figure instead.

export type ScrapeSource = {
  /** Matches Apartment.id in src/data/apartments.json */
  id: string;
  slug: string;
};

export const SITE_ORIGIN = "https://www.scape.com.au";

export const SCRAPE_SOURCES: ScrapeSource[] = [
  { id: "scape-lincoln-college", slug: "scape-lincoln-college" },
  { id: "scape-cornell-place", slug: "scape-cornell-place" },
  { id: "scape-melbourne-central", slug: "scape-melbourne-central" },
  { id: "scape-swanston", slug: "scape-swanston" },
  { id: "scape-peel-street", slug: "scape-peel" },
];

export const BUILDING_URL = (slug: string) =>
  `${SITE_ORIGIN}/melbourne/${slug}/`;

/** Human-facing note shown for each live operator. */
export const LIVE_OPERATORS = ["Scape"];
