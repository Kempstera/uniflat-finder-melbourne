"use client";

import { useCallback, useEffect, useState } from "react";
import type { Apartment, LivePricesPayload, PricedApartment } from "@/types/apartment";

type LiveState = {
  /** Buildings keyed by apartment id, as returned by the edge function. */
  buildings: LivePricesPayload["buildings"];
  updatedAt: string | null;
  /** True while the first request is still in flight. */
  loading: boolean;
  /** Set when the feed could not be reached at all. */
  error: string | null;
  refetch: () => void;
};

const EMPTY = { buildings: {}, updatedAt: null, loading: true, error: null };

/**
 * Fetch the live price feed from /api/prices.
 *
 * Failures are non-fatal by design: the page keeps rendering baseline prices
 * and surfaces a retry affordance instead of an error page.
 */
export function useLivePrices(): LiveState {
  const [state, setState] = useState<Omit<LiveState, "refetch">>(EMPTY);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/prices", {
          signal: controller.signal,
          headers: { accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = (await res.json()) as LivePricesPayload;
        if (cancelled) return;
        setState({
          buildings: payload.buildings ?? {},
          updatedAt: payload.updatedAt ?? null,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled || (err instanceof DOMException && err.name === "AbortError")) {
          return;
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "request failed",
        }));
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [nonce]);

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setNonce((n) => n + 1);
  }, []);

  return { ...state, refetch };
}

/** Join the static catalogue with whatever the live feed knows. */
export function mergePrices(
  apartments: Apartment[],
  buildings: LivePricesPayload["buildings"],
): PricedApartment[] {
  return apartments.map((apartment) => {
    const live = buildings[apartment.id];
    // Only trust a live figure for buildings flagged as live, so a stray key
    // in the feed can never override a curated baseline for another operator.
    const usable = apartment.priceSource === "live" && live ? live : undefined;
    return {
      ...apartment,
      effectiveRent: usable ? usable.weeklyRent : apartment.weeklyRent,
      isLive: Boolean(usable),
      live: usable,
    };
  });
}
