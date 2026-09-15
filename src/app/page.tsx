"use client";

import LanguageToggle from "@/components/LanguageToggle";
import SearchForm from "@/components/SearchForm";
import { useI18n } from "@/i18n/context";
import { housingTypeShort } from "@/i18n/dictionary";
import { APARTMENTS } from "@/lib/apartments";

/**
 * Entry point: a single centred search form. All filtering happens on
 * /results, which reads its filters back out of the URL, so this page holds
 * no listing state at all.
 */
export default function Home() {
  const { t, locale } = useI18n();

  const counts = {
    student: APARTMENTS.filter((a) => a.housingType === "student").length,
    university: APARTMENTS.filter((a) => a.housingType === "university").length,
    private: APARTMENTS.filter((a) => a.housingType === "private").length,
  };

  const catalogue = [
    `${counts.student} ${housingTypeShort[locale].student}`,
    `${counts.university} ${housingTypeShort[locale].university}`,
    `${counts.private} ${housingTypeShort[locale].private}`,
  ].join(" · ");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-widest text-sky-600">
            {t.kicker}
          </span>
          <LanguageToggle />
        </div>

        <div className="flex flex-1 flex-col justify-center py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t.siteTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">
              {t.intro}
            </p>
          </div>

          <div className="mt-9">
            <SearchForm variant="hero" />
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            {t.searchHint}
          </p>

          <p className="mt-2 text-center text-xs text-slate-500">
            {APARTMENTS.length} listings · {catalogue}
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs leading-relaxed text-slate-500">
            {t.disclaimer}
          </p>
          <p className="text-xs leading-relaxed text-slate-500">
            {t.dataNote}
          </p>
        </div>
      </div>
    </main>
  );
}
