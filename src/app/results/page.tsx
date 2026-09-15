"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import ApartmentCard from "@/components/ApartmentCard";
import LanguageToggle from "@/components/LanguageToggle";
import LiveStatus from "@/components/LiveStatus";
import SearchForm from "@/components/SearchForm";
import { useI18n } from "@/i18n/context";
import { housingTypeShort } from "@/i18n/dictionary";
import { mergePrices, useLivePrices } from "@/lib/useLivePrices";
import { APARTMENTS } from "@/lib/apartments";
import { applyFilters, parseSearch, toQueryString } from "@/lib/filter";

/**
 * Results page. The URL is the only filter state: it is read on every render
 * and never copied into local state, so back/forward and shared links always
 * show exactly what the address bar says.
 */
function ResultsContent() {
  const { t, locale } = useI18n();
  const params = useSearchParams();
  const { buildings, updatedAt, loading, error, refetch } = useLivePrices();

  const query = useMemo(() => parseSearch(params), [params]);

  const priced = useMemo(
    () => mergePrices(APARTMENTS, buildings),
    [buildings],
  );

  const filtered = useMemo(() => applyFilters(priced, query), [priced, query]);

  const cheapest = filtered.length
    ? Math.min(...filtered.map((row) => row.effectiveRent))
    : null;

  const liveCount = priced.filter((row) => row.isLive).length;

  // Readable summary of what is currently applied, for the header.
  const activeSummary = [
    query.types.length > 0
      ? query.types.map((type) => housingTypeShort[locale][type]).join(" / ")
      : t.housingTypeAll,
    t.perWeekShort(query.maxRent),
    query.maxWalk < 120
      ? t.walkOption(query.maxWalk)
      : `${t.walkLabel} ${t.walkAny}`,
  ].join(" · ");

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                href="/"
                className="text-sm font-semibold uppercase tracking-widest text-sky-600 hover:text-sky-700"
              >
                {t.kicker}
              </Link>
              <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {t.resultsHeading(filtered.length)}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                {t.resultsLead}
              </p>
            </div>
            <LanguageToggle />
          </div>

          <div className="mt-4">
            <LiveStatus
              loading={loading}
              error={error}
              updatedAt={updatedAt}
              liveCount={liveCount}
              total={priced.length}
              onRetry={refetch}
              size="compact"
            />
          </div>
        </div>
      </header>

      {/* Refine bar — the same form, compact, prefilled from the URL. */}
      <section className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 py-3.5 sm:px-6">
          <SearchForm variant="compact" initial={query} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-7 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-slate-600">
            {activeSummary}
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
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
          >
            {t.newSearch}
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-base font-semibold text-slate-800">
              {t.noResults}
            </p>
            <p className="mt-2 text-sm text-slate-600">{t.noResultsCta}</p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-xl bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
            >
              {t.newSearch}
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        )}

        <div className="mt-10 space-y-1.5 pb-4">
          <p className="text-xs leading-relaxed text-slate-500">
            {t.disclaimer}
          </p>
          <p className="text-xs leading-relaxed text-slate-500">
            {t.dataNote}
          </p>
        </div>
      </section>
    </main>
  );
}

export default function ResultsPage() {
  // useSearchParams needs a Suspense boundary during static export.
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <ResultsContent />
    </Suspense>
  );
}
