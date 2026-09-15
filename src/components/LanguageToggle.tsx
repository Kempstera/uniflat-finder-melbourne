"use client";

import { LOCALES, LOCALE_LABEL, type Locale } from "@/i18n/dictionary";
import { useI18n } from "@/i18n/context";

export default function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.langSwitchLabel}
      className="inline-flex rounded-full border border-slate-300 bg-white p-0.5 shadow-sm"
    >
      {LOCALES.map((code: Locale) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {LOCALE_LABEL[code]}
          </button>
        );
      })}
    </div>
  );
}
