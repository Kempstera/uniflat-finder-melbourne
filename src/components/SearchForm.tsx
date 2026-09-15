"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { housingTypeShort } from "@/i18n/dictionary";
import {
  DEFAULT_SEARCH,
  RENT_MAX,
  RENT_MIN,
  RENT_STEP,
  WALK_ANY,
  WALK_OPTIONS,
  toQueryString,
  type SearchQuery,
} from "@/lib/filter";
import type { HousingType } from "@/types/apartment";

const HOUSING_TYPES: HousingType[] = ["student", "university", "private"];

type SearchFormProps = {
  /** Existing filters, used by the refine bar on the results page. */
  initial?: SearchQuery;
  /**
   * "hero" is the big centred form on the home page; "compact" is the slim
   * single-row bar pinned to the top of the results page.
   */
  variant?: "hero" | "compact";
};

/**
 * The one place a search is composed. Submitting pushes the filters onto the
 * URL, so the results page never holds filter state of its own.
 */
export default function SearchForm({
  initial,
  variant = "hero",
}: SearchFormProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const compact = variant === "compact";

  const start = initial ?? DEFAULT_SEARCH;
  const [types, setTypes] = useState<HousingType[]>(start.types);
  const [maxRent, setMaxRent] = useState(start.maxRent);
  const [maxWalk, setMaxWalk] = useState(start.maxWalk);

  function toggleType(type: HousingType) {
    setTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type],
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const qs = toQueryString({ types, maxRent, maxWalk });
    const target = qs ? `/results?${qs}` : "/results";
    // Refining should not stack history entries the way a fresh search does.
    if (compact) router.replace(target);
    else router.push(target);
  }

  const typeButtons = (
    <div className="flex flex-wrap gap-2">
      {HOUSING_TYPES.map((type) => {
        const active = types.includes(type);
        return (
          <button
            key={type}
            type="button"
            aria-pressed={active}
            onClick={() => toggleType(type)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            {housingTypeShort[locale][type]}
          </button>
        );
      })}
      {types.length === 0 && (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3.5 py-1.5 text-sm text-slate-500">
          {t.housingTypeAll}
        </span>
      )}
    </div>
  );

  const rentField = (
    <div className={compact ? "min-w-[190px] flex-1" : ""}>
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={compact ? "refine-rent" : "max-rent"}
          className="text-sm font-semibold text-slate-700"
        >
          {t.maxRent}
        </label>
        <span className="text-sm font-bold text-slate-900">
          {t.perWeekShort(maxRent)}
        </span>
      </div>
      <input
        id={compact ? "refine-rent" : "max-rent"}
        type="range"
        min={RENT_MIN}
        max={RENT_MAX}
        step={RENT_STEP}
        value={maxRent}
        onChange={(event) => setMaxRent(Number(event.target.value))}
        className="mt-2 w-full accent-sky-600"
      />
      <div className="mt-0.5 flex justify-between text-xs text-slate-500">
        <span>${RENT_MIN}</span>
        <span>${RENT_MAX}</span>
      </div>
    </div>
  );

  const walkField = (
    <div className={compact ? "min-w-[150px]" : ""}>
      <label
        htmlFor={compact ? "refine-walk" : "max-walk"}
        className="text-sm font-semibold text-slate-700"
      >
        {t.walkLabel}
      </label>
      <select
        id={compact ? "refine-walk" : "max-walk"}
        value={maxWalk}
        onChange={(event) => setMaxWalk(Number(event.target.value))}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
      >
        <option value={WALK_ANY}>{t.walkAny}</option>
        {WALK_OPTIONS.map((minutes) => (
          <option key={minutes} value={minutes}>
            {t.walkOption(minutes)}
          </option>
        ))}
      </select>
    </div>
  );

  const submitButton = (
    <button
      type="submit"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
        compact ? "px-5 py-2 text-sm" : "w-full px-6 py-3 text-base"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      {compact ? t.apply : t.searchButton}
    </button>
  );

  if (compact) {
    return (
      <form
        onSubmit={submit}
        className="flex flex-wrap items-center gap-x-5 gap-y-3"
      >
        <div className="min-w-[240px] flex-1">
          <span className="text-sm font-semibold text-slate-700">
            {t.housingTypeLabel}
          </span>
          <div className="mt-2">{typeButtons}</div>
        </div>
        {rentField}
        {walkField}
        <div className="self-end pb-1">{submitButton}</div>
      </form>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm sm:p-7"
    >
      <div>
        <span className="text-sm font-semibold text-slate-700">
          {t.housingTypeLabel}
        </span>
        <div className="mt-2.5">{typeButtons}</div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {rentField}
        {walkField}
      </div>

      <div className="mt-7">{submitButton}</div>
    </form>
  );
}
