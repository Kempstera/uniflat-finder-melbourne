"use client";

import { useMemo, useState } from "react";
import ApartmentCard from "@/components/ApartmentCard";
import type { Apartment } from "@/types/apartment";
import apartmentsData from "@/data/apartments.json";

const apartments = apartmentsData as Apartment[];

const RENT_MIN = 400;
const RENT_MAX = 750;
const WALK_MAX = 25;

export default function Home() {
  const [maxRent, setMaxRent] = useState(RENT_MAX);
  const [maxWalk, setMaxWalk] = useState(WALK_MAX);
  const [billsOnly, setBillsOnly] = useState(false);

  const filtered = useMemo(
    () =>
      apartments
        .filter((apartment) => apartment.weeklyRent <= maxRent)
        .filter((apartment) => apartment.walkMinutes <= maxWalk)
        .filter((apartment) => (billsOnly ? apartment.billsIncluded : true))
        .sort(
          (a, b) =>
            a.walkMinutes - b.walkMinutes || a.weeklyRent - b.weeklyRent,
        ),
    [maxRent, maxWalk, billsOnly],
  );

  const cheapest = filtered.length
    ? Math.min(...filtered.map((apartment) => apartment.weeklyRent))
    : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
            Melbourne · Studio search
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            UniFlat Finder: Melbourne Business School
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Single-occupancy studios within walking distance of Melbourne
            Business School (200 Leicester St, Carlton). Walking times are on
            foot to the MBS campus — tram options are noted where the walk gets
            long.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="max-rent"
                  className="text-sm font-semibold text-slate-700"
                >
                  Max weekly rent
                </label>
                <span className="text-sm font-bold text-slate-900">
                  ${maxRent}/wk
                </span>
              </div>
              <input
                id="max-rent"
                type="range"
                min={RENT_MIN}
                max={RENT_MAX}
                step={10}
                value={maxRent}
                onChange={(event) => setMaxRent(Number(event.target.value))}
                className="mt-3 w-full accent-sky-600"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>${RENT_MIN}</span>
                <span>${RENT_MAX}</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="max-walk"
                  className="text-sm font-semibold text-slate-700"
                >
                  Max walk to MBS
                </label>
                <span className="text-sm font-bold text-slate-900">
                  {maxWalk} min
                </span>
              </div>
              <input
                id="max-walk"
                type="range"
                min={5}
                max={WALK_MAX}
                step={1}
                value={maxWalk}
                onChange={(event) => setMaxWalk(Number(event.target.value))}
                className="mt-3 w-full accent-sky-600"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>5 min</span>
                <span>{WALK_MAX} min</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={billsOnly}
                onChange={(event) => setBillsOnly(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-sky-600"
              />
              Bills included only
            </label>
            <button
              type="button"
              onClick={() => {
                setMaxRent(RENT_MAX);
                setMaxWalk(WALK_MAX);
                setBillsOnly(false);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              {filtered.length}
            </span>{" "}
            of {apartments.length} studios match
            {cheapest !== null && (
              <>
                {" "}
                · cheapest matching:{" "}
                <span className="font-semibold text-slate-900">
                  ${cheapest}/wk
                </span>
              </>
            )}
          </p>
          <p className="text-xs text-slate-500">
            Sorted by shortest walk, then lowest rent
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-base font-semibold text-slate-800">
              No studios match those filters.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Try raising the maximum rent or walking time.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        )}

        <p className="mt-10 pb-4 text-xs leading-relaxed text-slate-500">
          Mock data for planning purposes only — rents, availability, and
          facilities change every intake. Verify directly with each operator
          before signing anything.
        </p>
      </section>
    </main>
  );
}
