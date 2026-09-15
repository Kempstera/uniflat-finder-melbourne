import apartmentsData from "@/data/apartments.json";
import type { Apartment } from "@/types/apartment";

/**
 * The static catalogue, typed once. Both pages read from here so a schema
 * mistake shows up in one place rather than in each page's own cast.
 */
export const APARTMENTS = apartmentsData as Apartment[];
