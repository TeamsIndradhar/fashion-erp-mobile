import type { ReportColumn, ReportDescriptor } from "../../api/types";
import { formatMoney } from "../requests/requests";
import { formatDateKey } from "../../lib/dates";

/** Section → metrics for the overview reports (Executive Dashboard, Daily MIS). Values arrive already formatted. */
export function groupBySection(d: Pick<ReportDescriptor, "rows">): { section: string; items: { metric: string; value: string }[] }[] {
  const order: string[] = [];
  const map = new Map<string, { metric: string; value: string }[]>();
  for (const r of d.rows) {
    const section = String(r.section ?? "");
    if (!map.has(section)) {
      map.set(section, []);
      order.push(section);
    }
    map.get(section)!.push({ metric: String(r.metric ?? ""), value: String(r.value ?? "") });
  }
  return order.map((section) => ({ section, items: map.get(section)! }));
}

/** One cell for display; strings the server already formatted pass through. */
export function formatCell(value: unknown, type: ReportColumn["type"]): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" && type !== "date") return value;
  const n = typeof value === "number" ? value : Number(value);
  switch (type) {
    case "currency":
      return Number.isFinite(n) ? formatMoney(n) : String(value);
    case "percent":
      return Number.isFinite(n) ? `${Math.round(n * 100) / 100}%` : String(value);
    case "number":
      return Number.isFinite(n) ? n.toLocaleString("en-IN") : String(value);
    case "date":
      return /^\d{4}-\d{2}-\d{2}/.test(String(value)) ? formatDateKey(String(value).slice(0, 10)) : String(value);
    default:
      return typeof value === "object" ? JSON.stringify(value) : String(value);
  }
}

/** Card layout for a report row on a phone: first column is the title, the rest are label/value pairs. */
export function rowToCard(row: Record<string, unknown>, columns: ReportColumn[]) {
  const [first, ...rest] = columns;
  return {
    title: first ? formatCell(row[first.key], first.type) : "",
    fields: rest.map((c) => ({ label: c.label, value: formatCell(row[c.key], c.type) })),
  };
}

/** Phones render at most this many rows; the rest is in the export / on the website. */
export const MAX_MOBILE_ROWS = 200;
