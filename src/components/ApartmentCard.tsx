"use client";

import { useI18n } from "@/i18n/context";
import type { PricedApartment } from "@/types/apartment";

type ApartmentCardProps = {
  apartment: PricedApartment;
};

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  const { locale, t } = useI18n();
  const {
    name,
    operator,
    address,
    suburb,
    roomType,
    walkMinutes,
    billsIncluded,
    facilities,
    vibe,
    vibeZh,
    previouslyStayed,
    rating,
    availability,
    effectiveRent,
    isLive,
    live,
  } = apartment;

  const walkTone =
    walkMinutes <= 5
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : walkMinutes <= 10
        ? "bg-sky-50 text-sky-700 ring-sky-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";

  const blurb = locale === "zh" && vibeZh ? vibeZh : vibe;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {name}
            </h2>
            {previouslyStayed && (
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                {t.youLivedHere}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-slate-500">
            {operator} · {address}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-bold leading-none tracking-tight text-slate-900">
            ${effectiveRent}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.perWeek}
          </p>
          <span
            title={isLive ? t.liveTitle : t.baselineTitle}
            className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${
              isLive
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-slate-100 text-slate-600 ring-slate-200"
            }`}
          >
            {isLive && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
              </span>
            )}
            {isLive ? t.live : t.baseline}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${walkTone}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
              <path d="m7 21 2-5 3-2-2-3-3 1" />
              <path d="m13 9 3 3 3 1" />
              <path d="M9 21h6" />
            </svg>
            {t.minWalkToMbs(walkMinutes)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
            {roomType}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 ${
              billsIncluded
                ? "bg-teal-50 text-teal-700 ring-teal-200"
                : "bg-slate-50 text-slate-600 ring-slate-200"
            }`}
          >
            {billsIncluded ? t.billsIncluded : t.billsExtra}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600 ring-1 ring-slate-200">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5 text-amber-500"
            >
              <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.7 1.2 6.6L12 17.7l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z" />
            </svg>
            {rating.toFixed(1)}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">{blurb}</p>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t.facilities}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {facilities.map((facility) => (
              <li
                key={facility}
                className="rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/70"
              >
                {facility}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
        <span>
          {suburb} · {availability}
          {isLive && live?.semester ? ` · ${live.semester}` : ""}
        </span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${name} ${address}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline"
        >
          {t.viewLocation}
        </a>
      </div>
    </article>
  );
}
