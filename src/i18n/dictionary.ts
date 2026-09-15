export type Locale = "en" | "zh";

export const LOCALES: Locale[] = ["zh", "en"];
export const DEFAULT_LOCALE: Locale = "zh";

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  zh: "中文",
};

type Dict = {
  kicker: string;
  siteTitle: string;
  intro: string;
  maxRent: string;
  maxWalk: string;
  billsOnly: string;
  reset: string;
  perWeekShort: (v: number) => string;
  matchCount: (matched: number, total: number) => string;
  cheapestMatching: string;
  sortedBy: string;
  noResults: string;
  noResultsHint: string;
  disclaimer: string;
  facilities: string;
  viewLocation: string;
  youLivedHere: string;
  minWalkToSpot: (m: number) => string;
  billsIncluded: string;
  billsExtra: string;
  live: string;
  baseline: string;
  liveTitle: string;
  baselineTitle: string;
  checking: string;
  updatedAt: string;
  neverUpdated: string;
  liveError: string;
  retry: string;
  dataNote: string;
  minShort: string;
  perWeek: string;
  langSwitchLabel: string;
  liveSummary: (live: number, total: number) => string;
};

export const dict: Record<Locale, Dict> = {
  en: {
    kicker: "Melbourne · Studio search",
    siteTitle: "UniFlat Finder: University of Melbourne (FBE)",
    intro:
      "Single-occupancy studios within walking distance of the University of Melbourne's Faculty of Business and Economics (FBE). Walking times are routed on foot to The Spot, 198 Berkeley St, Carlton — tram options are noted where the walk gets long.",
    maxRent: "Max weekly rent",
    maxWalk: "Max walk to The Spot",
    billsOnly: "Bills included only",
    reset: "Reset filters",
    perWeekShort: (v) => `$${v}/wk`,
    matchCount: (matched, total) => `${matched} of ${total} studios match`,
    cheapestMatching: "cheapest matching",
    sortedBy: "Sorted by shortest walk, then lowest rent",
    noResults: "No studios match those filters.",
    noResultsHint: "Try raising the maximum rent or walking time.",
    disclaimer:
      "Prices marked Live are scraped from operator websites and can lag behind a signed contract — always confirm directly with the operator before signing anything.",
    facilities: "Facilities",
    viewLocation: "View location →",
    youLivedHere: "You lived here",
    minWalkToSpot: (m) => `${m} min walk to The Spot`,
    billsIncluded: "Bills included",
    billsExtra: "Bills extra",
    live: "Live",
    baseline: "Baseline",
    liveTitle: "Price scraped live from the operator's website.",
    baselineTitle:
      "Indicative price from a curated snapshot — this operator does not publish prices in a scrapeable form.",
    checking: "Checking live prices…",
    updatedAt: "Live prices updated",
    neverUpdated: "Live prices unavailable — showing baseline data",
    liveError: "Could not reach the live price feed.",
    retry: "Retry",
    dataNote:
      "Live feed covers Scape Melbourne buildings. Other operators publish prices only behind their booking engines, so those show a dated baseline figure.",
    minShort: "min",
    perWeek: "per week",
    langSwitchLabel: "Language",
    liveSummary: (live, total) => `${live} of ${total} prices live right now`,
  },
  zh: {
    kicker: "墨尔本 · 单间搜索",
    siteTitle: "UniFlat 找房：墨尔本大学商学院",
    intro:
      "步行可达墨尔本大学商学院（FBE）的单人套间。上课地点为 The Spot 教学楼（Carlton 区 Berkeley 街 198 号），步行时间按实际路网计算，路程较远时会标注电车方案。",
    maxRent: "每周租金上限",
    maxWalk: "步行到 The Spot 上限",
    billsOnly: "仅看含账单",
    reset: "重置筛选",
    perWeekShort: (v) => `$${v}/周`,
    matchCount: (matched, total) => `${total} 个单间中有 ${matched} 个符合条件`,
    cheapestMatching: "符合条件中最低",
    sortedBy: "按步行时间从短到长排序，时间相同看租金",
    noResults: "没有符合这些条件的单间。",
    noResultsHint: "试着放宽租金上限或步行时间。",
    disclaimer:
      "标注「实时」的价格抓取自公寓官网，签约前仍可能与最终合同有出入——下单前请务必直接向公寓方确认。",
    facilities: "设施",
    viewLocation: "查看位置 →",
    youLivedHere: "你住过这里",
    minWalkToSpot: (m) => `步行 ${m} 分钟到 The Spot`,
    billsIncluded: "含账单",
    billsExtra: "账单另计",
    live: "实时",
    baseline: "参考价",
    liveTitle: "价格实时抓取自公寓官网。",
    baselineTitle: "参考价来自人工整理的快照——该公寓未以可抓取的形式公布价格。",
    checking: "正在获取实时价格…",
    updatedAt: "实时价格更新于",
    neverUpdated: "实时价格暂不可用——显示参考价",
    liveError: "无法连接实时价格源。",
    retry: "重试",
    dataNote:
      "实时数据覆盖 Scape 墨尔本各公寓。其余公寓只在预订系统内公布价格，因此显示带日期的参考价。",
    minShort: "分钟",
    perWeek: "每周",
    langSwitchLabel: "语言",
    liveSummary: (live, total) => `${total} 个价格中有 ${live} 个实时获取`,
  },
};
