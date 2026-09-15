/**
 * GET /api/prices
 *
 * Scrapes the operators that publish rent in a machine-readable form and
 * returns each building's lowest currently-listed weekly rate.
 *
 * Response:
 *   {
 *     updatedAt: string,          // ISO timestamp of this scrape
 *     source: "live" | "cache",
 *     complete: boolean,          // every configured source parsed
 *     buildings: {
 *       [apartmentId]: {
 *         weeklyRent: number,
 *         semester: string,
 *         availableRoomTypes: number,
 *         listedRoomTypes: number,
 *         sourceUrl: string
 *       }
 *     }
 *   }
 *
 * Anything missing from `buildings` keeps the baseline figure baked into the
 * static bundle. One building failing never fails the request.
 *
 * Caching is deliberately split: a complete scrape is cached for six hours,
 * a partial one only briefly. Caching a partial result for six hours would
 * pin the site to baseline prices for the rest of the day off a single slow
 * upstream second.
 */

import { BUILDING_URL, SCRAPE_SOURCES } from "../../src/config/scrape";
import { parseScape } from "../../src/lib/scape.js";

// Bump when the response shape changes so stale entries are not reused.
const CACHE_VERSION = "v2";
const COMPLETE_TTL_SECONDS = 60 * 60 * 6; // 6 hours
const PARTIAL_TTL_SECONDS = 60 * 5; // 5 minutes
const FETCH_TIMEOUT_MS = 15_000;
const ATTEMPTS = 2;

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-AU,en;q=0.9",
        "cache-control": "no-cache",
        referer: "https://www.scape.com.au/",
      },
      redirect: "follow",
    });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, status: res.status, html: await res.text() };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err && err.name === "AbortError" ? "timeout" : "fetch-failed",
    };
  } finally {
    clearTimeout(timer);
  }
}

async function scrapeOne(source) {
  const url = BUILDING_URL(source.slug);
  let lastStatus = 0;
  let lastError = "";

  // A single retry absorbs the transient upstream stalls that otherwise leave
  // a building on its baseline figure.
  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    const res = await fetchPage(url);
    if (res.ok) {
      const parsed = parseScape(res.html);
      if (parsed) {
        return {
          ok: true,
          row: {
            id: source.id,
            weeklyRent: parsed.weeklyRent,
            semester: parsed.semester,
            availableRoomTypes: parsed.availableRoomTypes,
            listedRoomTypes: parsed.listedRoomTypes,
            sourceUrl: url,
          },
        };
      }
      lastError = "parse-failed";
      lastStatus = res.status;
    } else {
      lastStatus = res.status;
      lastError = res.error || `http-${res.status}`;
    }
  }

  return { ok: false, id: source.id, status: lastStatus, error: lastError };
}

function jsonResponse(body, cacheState) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=900, s-maxage=21600",
      "x-uniflat-cache": cacheState,
    },
  });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const debug = url.searchParams.get("debug") === "1";

  const cache = caches.default;
  const cacheKey = new Request(`${url.origin}/api/prices?${CACHE_VERSION}`, {
    method: "GET",
  });

  const hit = await cache.match(cacheKey);
  if (hit) {
    const body = await hit.json();
    return jsonResponse({ ...body, source: "cache" }, "HIT");
  }

  const results = await Promise.all(SCRAPE_SOURCES.map(scrapeOne));

  const buildings = {};
  const failures = [];
  for (const result of results) {
    if (result.ok) {
      const { id, ...rest } = result.row;
      buildings[id] = rest;
    } else {
      failures.push({
        id: result.id,
        status: result.status,
        error: result.error,
      });
    }
  }

  const matched = Object.keys(buildings).length;
  const complete = matched === SCRAPE_SOURCES.length;
  const payload = { updatedAt: new Date().toISOString(), complete, buildings };

  // Only a complete scrape earns the long TTL; a partial one expires quickly
  // so the next visit can repair it.
  if (matched > 0) {
    const ttl = complete ? COMPLETE_TTL_SECONDS : PARTIAL_TTL_SECONDS;
    context.waitUntil(
      cache.put(
        cacheKey,
        new Response(JSON.stringify(payload), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": `public, max-age=${ttl}`,
          },
        }),
      ),
    );
  }

  const body = { ...payload, source: "live" };
  if (debug) body.diagnostics = { failures, matched, expected: SCRAPE_SOURCES.length };

  return jsonResponse(body, matched === 0 ? "BYPASS" : complete ? "MISS-FULL" : "MISS-PARTIAL");
}
