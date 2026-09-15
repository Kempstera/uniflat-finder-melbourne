/**
 * Scape building-page parsing.
 *
 * Kept as plain JS (not TypeScript) so the same file can be imported by the
 * Cloudflare Pages Function at runtime and by the local parser tests without
 * a transpile step.
 *
 * Shape note: every Scape Melbourne building page embeds the SAME city-wide
 * `propertiesPriceData` array, keyed by `roomLocationId`. Reading the first
 * row therefore yields an identical rent for every building. The building's
 * own `roomLocationID` also appears on the page beside its room-type list —
 * the correct rent is the table row whose key matches that id.
 */

const PRICE_MARKER = "propertiesPriceData";
const MARKER_WINDOW_BYTES = 400_000;

/** Extract the city-wide price array embedded in a building page. */
export function globalPriceTable(html) {
  const at = html.indexOf(PRICE_MARKER);
  if (at === -1) return null;

  // The array starts a few hundred bytes after the marker and is far smaller
  // than the multi-megabyte page, so a bounded window keeps parsing cheap.
  const window = html
    .slice(at, at + MARKER_WINDOW_BYTES)
    .replace(/\\"/g, '"')
    .replace(/\\\//g, "/");

  const start = window.indexOf("[");
  if (start === -1) return null;

  // Bracket-match instead of regexing: entries are nested objects.
  let depth = 0;
  let end = -1;
  for (let i = start; i < window.length; i += 1) {
    const ch = window[i];
    if (ch === "[") depth += 1;
    else if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) return null;

  try {
    const rows = JSON.parse(window.slice(start, end));
    return Array.isArray(rows) && rows.length > 0 ? rows : null;
  } catch {
    return null;
  }
}

/** The `roomLocationID` belonging to the building whose page this is. */
export function ownRoomLocationId(html) {
  const unescaped = html.replace(/\\"/g, '"');
  const anchor = unescaped.indexOf('"roomTypesId"');
  if (anchor === -1) return null;
  const segment = unescaped.slice(Math.max(0, anchor - 4000), anchor + 2000);
  const match = segment.match(/"roomLocationID"\s*:\s*"?(\d+)"?/);
  return match ? Number(match[1]) : null;
}

/**
 * Pull this building's own lowest listed weekly rate out of its page.
 * Returns null when the page cannot be parsed with confidence.
 */
export function parseScape(html) {
  const table = globalPriceTable(html);
  if (!table) return null;

  const ownId = ownRoomLocationId(html);

  // Without a confirmed own-id, refuse to guess: a wrong row would silently
  // publish another building's rent. Callers fall back to the baseline figure.
  if (ownId === null) return null;
  const row = table.find((entry) => entry && entry.roomLocationId === ownId);
  if (!row) return null;

  const rate = row.lowestPriceRoom;
  const amount = rate && Number(rate.Amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const roomTypes = Array.isArray(row.roomTypeIds) ? row.roomTypeIds.length : 0;

  return {
    weeklyRent: amount,
    semester: row.semester ? String(row.semester) : "",
    availableRoomTypes: roomTypes,
    listedRoomTypes: table.length,
  };
}
