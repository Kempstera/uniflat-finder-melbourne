"use client";

import { useI18n } from "@/i18n/context";

type LiveStatusProps = {
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
  liveCount: number;
  total: number;
  onRetry: () => void;
  /** "default" for body copy, "compact" for the sticky results header. */
  size?: "default" | "compact";
};

/**
 * One line explaining where the prices came from. Kept in a single component
 * so the home page and the results page can never disagree about freshness.
 */
export default function LiveStatus({
  loading,
  error,
  updatedAt,
  liveCount,
  total,
  onRetry,
  size = "default",
}: LiveStatusProps) {
  const { t } = useI18n();

  const text = size === "compact" ? "text-[11px]" : "text-xs";

  const updatedLabel = updatedAt
    ? new Intl.DateTimeFormat("zh-CN", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(updatedAt))
    : null;

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 ${text}`}>
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
            onClick={onRetry}
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
          {t.updatedAt} {updatedLabel} · {t.liveSummary(liveCount, total)}
        </span>
      )}
    </div>
  );
}
