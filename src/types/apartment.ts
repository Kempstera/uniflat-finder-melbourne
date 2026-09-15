export type Apartment = {
  id: string;
  name: string;
  operator: string;
  address: string;
  suburb: string;
  roomType: string;
  /** Walking time to Melbourne Business School (200 Leicester St, Carlton), in minutes. */
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
