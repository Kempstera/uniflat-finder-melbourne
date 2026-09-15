import type { HousingType, PricedApartment } from "@/types/apartment";

/**
 * Search state shared by the home page and the results page, plus the helpers
 * that move it in and out of the URL.
 *
 * The URL is the single source of truth: the home page writes the query, the
 * results page reads it back, so any result set can be linked or reloaded.
 */

export const RENT_MIN = 300;
export const RENT_MAX = 800;
export const RENT_STEP = 10;

/** Walk-time buckets offered in the form, in minutes. */
export const WALK_OPTIONS = [10, 15, 20, 30] as const;
/** Sentinel for "no walk-time restriction"; never sent to the URL. */
export const WALK_ANY = 120;
export const DEFAULT_MAX_WALK = WALK_ANY;

const ALL_TYPES: HousingType[] = ["student", "university", "private"];

export type SearchQuery = {
  /** Empty means "no type restriction". */
  types: HousingType[];
  maxRent: number;
  maxWalk: number;
};

export const DEFAULT_SEARCH: SearchQuery = {
  types: [],
  maxRent: RENT_MAX,
  maxWalk: DEFAULT_MAX_WALK,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function isHousingType(value: string): value is HousingType {
  return (ALL_TYPES as string[]).includes(value);
}

/**
 * Read a query object out of URL search params. Anything unparseable falls
 * back to the default so a hand-edited URL can never render an empty page.
 */
export function parseSearch(
  params: { get(key: string): string | null } | null | undefined,
): SearchQuery {
  if (!params) return DEFAULT_SEARCH;

  const types = (params.get("type") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(isHousingType);

  const rentRaw = Number(params.get("maxRent"));
  const walkRaw = Number(params.get("maxTime"));

  return {
    types,
    maxRent:
      Number.isFinite(rentRaw) && rentRaw > 0
        ? clamp(rentRaw, RENT_MIN, RENT_MAX)
        : RENT_MAX,
    maxWalk:
      Number.isFinite(walkRaw) && walkRaw > 0
        ? clamp(walkRaw, 1, 120)
        : DEFAULT_MAX_WALK,
  };
}

/** Serialise back to a query string, dropping anything at its default. */
export function toQueryString(query: SearchQuery): string {
  const params = new URLSearchParams();
  if (query.types.length > 0 && query.types.length < ALL_TYPES.length) {
    params.set("type", query.types.join(","));
  }
  if (query.maxRent < RENT_MAX) params.set("maxRent", String(query.maxRent));
  if (query.maxWalk < WALK_ANY) {
    params.set("maxTime", String(query.maxWalk));
  }
  return params.toString();
}

/** Filter the catalogue and order it by walk time, then rent. */
export function applyFilters(
  rows: PricedApartment[],
  query: SearchQuery,
): PricedApartment[] {
  const typeSet = new Set(query.types);
  return rows
    .filter((row) => typeSet.size === 0 || typeSet.has(row.housingType))
    .filter((row) => row.effectiveRent <= query.maxRent)
    .filter((row) => row.walkMinutes <= query.maxWalk)
    .sort(
      (a, b) =>
        a.walkMinutes - b.walkMinutes || a.effectiveRent - b.effectiveRent,
    );
}
