import { istDateKey } from "../../lib/dates";

/** D-045: page sizes the user asked for. */
export const PAGE_SIZES = [10, 20, 30] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export interface RangeFilter {
  from: string;
  to: string;
}

/** Default range: the first of this month (IST) to today. */
export function defaultRange(now: Date = new Date()): RangeFilter {
  const today = istDateKey(now);
  return { from: `${today.slice(0, 8)}01`, to: today };
}

/** First and last day of a month key (YYYY-MM). */
export function monthRange(monthKey: string): RangeFilter {
  const [y, m] = monthKey.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { from: `${monthKey}-01`, to: `${monthKey}-${String(last).padStart(2, "0")}` };
}

/** One page of an already-filtered list (lists the server returns whole). */
export function paginate<T>(rows: T[], page: number, pageSize: number): { rows: T[]; total: number; totalPages: number; page: number } {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const p = Math.min(Math.max(1, page), totalPages);
  return { rows: rows.slice((p - 1) * pageSize, p * pageSize), total: rows.length, totalPages, page: p };
}

export function rangeQuery(r: RangeFilter, extra: Record<string, string | number | undefined> = {}): string {
  const q = new URLSearchParams({ from: r.from, to: r.to });
  for (const [k, v] of Object.entries(extra)) if (v !== undefined && v !== "") q.set(k, String(v));
  return q.toString();
}

export const sumBy = <T>(rows: T[], pick: (r: T) => number | null | undefined) => Math.round(rows.reduce((s, r) => s + (pick(r) ?? 0), 0) * 100) / 100;
