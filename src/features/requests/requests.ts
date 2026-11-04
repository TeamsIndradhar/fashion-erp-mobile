import type { CorrectionType, LeaveDuration, PaymentRequestStatus, SalaryAdvance } from "../../api/types";
import type { Tone } from "../attendance/labels";

export const LEAVE_DURATIONS: { value: LeaveDuration; label: string }[] = [
  { value: "FULL", label: "Full day" },
  { value: "F_HALF", label: "1st half" },
  { value: "S_HALF", label: "2nd half" },
  { value: "QR1", label: "Quarter 1" },
  { value: "QR2", label: "Quarter 2" },
  { value: "QR3", label: "Quarter 3" },
  { value: "QR4", label: "Quarter 4" },
];

/** The four session corrections the app offers (EMP-029); leave-type regularizations stay on the web. */
export const CORRECTION_TYPES: { value: CorrectionType; label: string; needs: ("date" | "session" | "in" | "out")[] }[] = [
  { value: "MISSED_PUNCH", label: "Missed punch", needs: ["date", "in", "out"] },
  { value: "MISSED_LOGOUT", label: "Missed logout", needs: ["session", "out"] },
  { value: "CHANGE_LOGIN", label: "Change login time", needs: ["session", "in"] },
  { value: "CHANGE_LOGOUT", label: "Change logout time", needs: ["session", "out"] },
];

export const CORRECTION_LABEL: Record<CorrectionType, string> = {
  MISSED_PUNCH: "Missed punch",
  MISSED_LOGOUT: "Missed logout",
  CHANGE_LOGIN: "Change login",
  CHANGE_LOGOUT: "Change logout",
  LEAVE_NOT_TAKEN: "Leave not taken",
  EMERGENCY_LEAVE: "Emergency leave",
};

export function decisionStatus(status: string): { label: string; tone: Tone } {
  switch (status) {
    case "PENDING":
    case "PENDING_APPROVAL":
      return { label: "Waiting for approval", tone: "warning" };
    case "IN_PROCESS":
      return { label: "Clarification sent", tone: "warning" };
    case "APPROVED":
      return { label: "Approved", tone: "success" };
    case "PARTIALLY_PAID":
      return { label: "Partly paid", tone: "info" };
    case "PAID":
      return { label: "Paid", tone: "success" };
    case "RECOVERING":
      return { label: "Paid · being recovered", tone: "info" };
    case "RECOVERED":
      return { label: "Fully recovered", tone: "success" };
    case "REJECTED":
      return { label: "Rejected", tone: "danger" };
    case "CANCELLED":
      return { label: "Cancelled", tone: "muted" };
    default:
      return { label: status, tone: "muted" };
  }
}

export const EXPENSE_FILTERS: { value: PaymentRequestStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING_APPROVAL", label: "Waiting" },
  { value: "APPROVED", label: "Approved" },
  { value: "PAID", label: "Paid" },
  { value: "REJECTED", label: "Rejected" },
];

/** Cancel is allowed only before payment (server: PENDING_APPROVAL or APPROVED). */
export const canCancelExpense = (s: PaymentRequestStatus) => s === "PENDING_APPROVAL" || s === "APPROVED";
export const canCancelAdvance = (a: Pick<SalaryAdvance, "status">) => a.status === "PENDING_APPROVAL" || a.status === "APPROVED";

/** Every calendar day from `from` to `to` (inclusive), "YYYY-MM-DD"; [] when reversed; at most 62 (server limit). */
export function dateRange(from: string, to: string): string[] {
  const out: string[] = [];
  const [y1, m1, d1] = from.split("-").map(Number);
  const [y2, m2, d2] = to.split("-").map(Number);
  const end = Date.UTC(y2, m2 - 1, d2);
  for (let t = Date.UTC(y1, m1 - 1, d1); t <= end && out.length < 62; t += 86_400_000) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
}

/** Indian grouping, 2 decimals: 123456.5 → "₹1,23,456.50". */
export function formatMoney(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : (value ?? 0);
  if (!Number.isFinite(n)) return "—";
  const [int, dec] = Math.abs(n).toFixed(2).split(".");
  const last3 = int.slice(-3);
  const rest = int.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${n < 0 ? "-" : ""}₹${rest ? `${rest},${last3}` : last3}.${dec}`;
}

/** "1,250.50" / "1250.5" → 1250.5; null when not a positive amount with ≤ 2 decimals. */
export function parseAmount(text: string): number | null {
  const clean = text.replace(/[,\s₹]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
  const n = Number(clean);
  return n > 0 ? n : null;
}

export function validateExpense(input: { amount: string; payToName: string; accountId: string | null; dueDate: string | null; today: string }) {
  const e: { amount?: string; payToName?: string; accountId?: string; dueDate?: string } = {};
  if (parseAmount(input.amount) === null) e.amount = "Enter an amount above 0 with at most 2 decimals.";
  if (!input.payToName.trim()) e.payToName = "Enter who is to be paid.";
  if (!input.accountId) e.accountId = "Choose what the expense is for.";
  if (!input.dueDate) e.dueDate = "Choose the due date.";
  else if (input.dueDate < input.today) e.dueDate = "The due date can't be in the past.";
  return e;
}

export function validateAdvance(input: { amount: string; installments: number; reason: string }) {
  const e: { amount?: string; installments?: string; reason?: string } = {};
  const amount = parseAmount(input.amount);
  if (amount === null) e.amount = "Enter an amount above 0 with at most 2 decimals.";
  else if (amount > 10_000_000) e.amount = "The amount is too large.";
  if (!Number.isInteger(input.installments) || input.installments < 1 || input.installments > 24) e.installments = "Choose 1 to 24 instalments.";
  if (input.reason.trim().length < 3) e.reason = "Write a short reason (at least 3 characters).";
  return e;
}

/** Same rounding as the server: ceil to 2 decimals. */
export const installmentAmount = (amount: number, installments: number) => Math.ceil((amount / installments) * 100) / 100;

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
