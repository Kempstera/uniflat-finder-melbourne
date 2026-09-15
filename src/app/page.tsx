"use client";

import { useMemo, useState } from "react";
import ApartmentCard from "@/components/ApartmentCard";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/context";
import { mergePrices, useLivePrices } from "@/lib/useLivePrices";
import type { Apartment } from "@/types/apartment";
import apartmentsData from "@/data/apartments.json";

const apartments = apartmentsData as Apartment[];

const RENT_MIN = 400;
const RENT_MAX = 750;
const WALK_MIN = 2;
const WALK_MAX = 25;
const STEP = 10;

export default function Home() {
  const { t } = useI18n();
  const { buildings, updatedAt, loading, error, refetch } = useLivePrices();

  const [maxRent, setMaxRent] = useState(RENT_MAX);
  const [maxWalk, setMaxWalk] = useState(WALK_MAX);
  const [billsOnly, setBillsOnly] = useState(false);

  const priced = useMemo(
    () => mergePrices(apartments, buildings),
    [buildings],
  );

  const filtered = useMemo(
    () =>
      priced
        .filter((apartment) => apartment.effectiveRent <= maxRent)
        .filter((apartment) => apartment.walkMinutes <= maxWalk)
        .filter((apartment) => (billsOnly ? apartment.billsIncluded : true))
        .sort(
          (a, b) =>
            a.walkMinutes - b.walkMinutes ||
            a.effectiveRent - b.effectiveRent,
        ),
    [priced, maxRent, maxWalk, billsOnly],
  );

  const cheapest = filtered.length
    ? Math.min(...filtered.map((apartment) => apartment.effectiveRent))
    : null;

  const liveCount = priced.filter((apartment) => apartment.isLive).length;

  const updatedLabel = updatedAt
    ? new Intl.DateTimeFormat("zh-CN", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(updatedAt))
    : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
                {t.kicker}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {t.siteTitle}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                {t.intro}
              </p>
            </div>
            <LanguageToggle />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
            {loading && (
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                {t.checking}
              </span>
            )}
            {!loading && error && (
              <span className="inline-flex items-center gap-2 text-amber-700">
                {t.neverUpdated}
                <button
                  type="button"
                  onClick={refetch}
                  className="font-semibold underline underline-offset-2 hover:text-amber-900"
                >
                  {t.retry}
                </button>
              </span>
            )}
            {!loading && !error && updatedLabel && (
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                </span>
                {t.updatedAt} {updatedLabel} · {t.liveSummary(liveCount, priced.length)}
              </span>
            )}
          </div>
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
                  {t.maxRent}
                </label>
                <span className="text-sm font-bold text-slate-900">
                  {t.perWeekShort(maxRent)}
                </span>
              </div>
              <input
                id="max-rent"
                type="range"
                min={RENT_MIN}
                max={RENT_MAX}
                step={STEP}
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
                  {t.maxWalk}
                </label>
                <span className="text-sm font-bold text-slate-900">
                  {maxWalk} {t.minShort}
                </span>
              </div>
              <input
                id="max-walk"
                type="range"
                min={WALK_MIN}
                max={WALK_MAX}
                step={1}
                value={maxWalk}
                onChange={(event) => setMaxWalk(Number(event.target.value))}
                className="mt-3 w-full accent-sky-600"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>
                  {WALK_MIN} {t.minShort}
                </span>
                <span>
                  {WALK_MAX} {t.minShort}
                </span>
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
              {t.billsOnly}
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
              {t.reset}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              {t.matchCount(filtered.length, priced.length)}
            </span>
            {cheapest !== null && (
              <>
                {" · "}
                {t.cheapestMatching}:{" "}
                <span className="font-semibold text-slate-900">
                  {t.perWeekShort(cheapest)}
                </span>
              </>
            )}
          </p>
          <p className="text-xs text-slate-500">{t.sortedBy}</p>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-base font-semibold text-slate-800">
              {t.noResults}
            </p>
            <p className="mt-2 text-sm text-slate-600">{t.noResultsHint}</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        )}

        <p className="mt-10 pb-2 text-xs leading-relaxed text-slate-500">
          {t.disclaimer}
        </p>
        <p className="pb-4 text-xs leading-relaxed text-slate-500">
          {t.dataNote}
        </p>
      </section>
    </main>
  );
}
