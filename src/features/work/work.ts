import type { AssignmentStatus, MyAssignment, ProgressEntry, ProgressQuantities } from "../../api/types";
import type { Tone } from "../attendance/labels";

/** Decimal strings from the ERP ("12.0000") → whole pieces. */
export const pieces = (v: string | number | null | undefined) => Math.round(Number(v ?? 0) || 0);

export const ASSIGNMENT_GROUPS: { key: "todo" | "doing" | "done"; label: string; statuses: AssignmentStatus[] }[] = [
  { key: "todo", label: "To do", statuses: ["ASSIGNED"] },
  { key: "doing", label: "In progress", statuses: ["IN_PROGRESS"] },
  { key: "done", label: "Completed", statuses: ["COMPLETED", "REASSIGNED"] },
];

export function groupAssignments(list: MyAssignment[]) {
  return ASSIGNMENT_GROUPS.map((g) => ({ ...g, items: list.filter((a) => g.statuses.includes(a.status)) }));
}

/** Pieces an entry uses from the assignment — the server's rule: completed + rejected + damaged − extra. */
export const usedBy = (e: Pick<ProgressEntry, "completedQuantity" | "rejectedQuantity" | "damagedQuantity" | "extraQuantity">) =>
  pieces(e.completedQuantity) + pieces(e.rejectedQuantity) + pieces(e.damagedQuantity) - pieces(e.extraQuantity);

/** What is still open on an assignment from my own entries (pending counts, rejected doesn't) — display only; the server decides. */
export function assignmentProgress(a: Pick<MyAssignment, "id" | "assignedQuantity">, entries: ProgressEntry[]) {
  const mine = entries.filter((e) => e.jobOrderAssignmentId === a.id && e.approvalStatus !== "REJECTED");
  const approved = mine.filter((e) => e.approvalStatus !== "PENDING").reduce((s, e) => s + usedBy(e), 0);
  const pending = mine.filter((e) => e.approvalStatus === "PENDING").reduce((s, e) => s + usedBy(e), 0);
  const assigned = pieces(a.assignedQuantity);
  return { assigned, approved, pending, remaining: Math.max(0, assigned - approved - pending) };
}

const whole = (s: string) => (/^\d+$/.test(s.trim()) ? Number(s.trim()) : null);

/** WRK-004 rules: whole numbers ≥ 0, at least one of completed/rejected/damaged > 0, extra ≤ completed, ≤ remaining. */
export function validateProgress(input: { completed: string; rejected: string; damaged: string; extra: string }, opts: { remaining: number; allowsExtra: boolean }) {
  const errors: Partial<Record<"completed" | "rejected" | "damaged" | "extra" | "form", string>> = {};
  const q: ProgressQuantities = { completedQuantity: 0, rejectedQuantity: 0, damagedQuantity: 0, extraQuantity: 0 };
  for (const [field, key] of [["completed", "completedQuantity"], ["rejected", "rejectedQuantity"], ["damaged", "damagedQuantity"], ["extra", "extraQuantity"]] as const) {
    const raw = input[field];
    if (raw.trim() === "") continue;
    const n = whole(raw);
    if (n === null) errors[field] = "Use whole pieces (0, 1, 2 …).";
    else q[key] = n;
  }
  if (Object.keys(errors).length) return { errors, quantities: null };
  if (q.completedQuantity + q.rejectedQuantity + q.damagedQuantity === 0) errors.form = "Enter at least one finished, rejected or damaged piece.";
  if (q.extraQuantity > 0 && !opts.allowsExtra) errors.extra = "This stage does not allow extra pieces.";
  else if (q.extraQuantity > q.completedQuantity) errors.extra = "Extra pieces can't be more than finished pieces.";
  const used = q.completedQuantity + q.rejectedQuantity + q.damagedQuantity - q.extraQuantity;
  if (!errors.form && used > opts.remaining) errors.form = `That is ${used} pieces, but only ${opts.remaining} are left on your assignment.`;
  return Object.keys(errors).length ? { errors, quantities: null } : { errors, quantities: q };
}

export function validateHandBack(quantity: string, reason: string, returnable: number) {
  const e: { quantity?: string; reason?: string } = {};
  const n = whole(quantity);
  if (n === null || n <= 0) e.quantity = "Enter how many pieces you are returning.";
  else if (n > returnable) e.quantity = `You can return at most ${returnable} unworked pieces.`;
  if (reason.trim().length < 3) e.reason = "Write a short reason (at least 3 characters).";
  return e;
}

export function approvalTone(s: ProgressEntry["approvalStatus"]): { label: string; tone: Tone } {
  switch (s) {
    case "PENDING":
      return { label: "Waiting for supervisor", tone: "warning" };
    case "APPROVED":
      return { label: "Approved", tone: "success" };
    case "REJECTED":
      return { label: "Rejected", tone: "danger" };
    default:
      return { label: "Recorded", tone: "muted" };
  }
}
