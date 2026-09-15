/**
 * What kind of listing this is. Drives the housing-type filter on the search
 * page and the badge on every result card.
 *
 * - "student"    purpose-built student accommodation run by a commercial
 *                 operator (Scape, UniLodge, Iglu, Yugo, Journal, ...)
 * - "university" halls and apartments owned and allocated by the University
 *                 of Melbourne itself (Little Hall, Lisa Bellear House, ...)
 * - "private"    ordinary rental stock on the open market (1b1b apartments)
 */
export type HousingType = "student" | "university" | "private";

export const HOUSING_TYPES: HousingType[] = [
  "student",
  "university",
  "private",
];

export type Apartment = {
  id: string;
  name: string;
  operator: string;
  address: string;
  suburb: string;
  roomType: string;
  housingType: HousingType;
  /**
   * Walking time in minutes to the University of Melbourne Faculty of Business
   * and Economics — The Spot, 198 Berkeley St, Carlton (OSRM foot routing from
   * the building's OSM address point).
   */
  walkMinutes: number;
  /**
   * Baseline weekly rent in AUD from the curated snapshot. Used until (and
   * unless) the live feed returns a fresher figure for this building.
   */
  weeklyRent: number;
  billsIncluded: boolean;
  facilities: string[];
  vibe: string;
  /** Chinese rendering of `vibe`, shown when the locale is zh. */
  vibeZh?: string;
  previouslyStayed: boolean;
  rating: number;
  availability: string;
  /**
   * "live" when an operator publishes rent in a scrapeable form and this
   * building is wired into /api/prices; "baseline" otherwise.
   */
  priceSource: "live" | "baseline";
  /** Date the baseline snapshot was taken (YYYY-MM-DD). */
  snapshotDate?: string;
};

/** One building's fresh figures from the /api/prices edge function. */
export type LivePrice = {
  weeklyRent: number;
  semester: string;
  availableRoomTypes: number;
  listedRoomTypes: number;
  sourceUrl: string;
};

export type LivePricesPayload = {
  updatedAt: string;
  source: "live" | "cache";
  buildings: Record<string, LivePrice>;
};

/** Apartment joined with whatever the live feed knows about it. */
export type PricedApartment = Apartment & {
  effectiveRent: number;
  isLive: boolean;
  live?: LivePrice;
};
