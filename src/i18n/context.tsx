"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  dict,
} from "./dictionary";

type I18nValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (typeof dict)[Locale];
};

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "uniflat.locale";

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as string[]).includes(value);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Server render and first client paint both use the default (Chinese) so
  // the markup matches during hydration; a stored choice is applied after.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) setLocaleState(stored);
    } catch {
      /* private mode — keep the default */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale, t: dict[locale] }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
