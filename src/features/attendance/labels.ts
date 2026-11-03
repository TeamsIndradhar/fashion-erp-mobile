import type { AttendanceMonthDay, AttendanceSession } from "../../api/types";
import { colors } from "../../theme/tokens";

export type Tone = "success" | "danger" | "warning" | "info" | "muted";

export const TONE_COLOR: Record<Tone, string> = {
  success: colors.success,
  danger: colors.danger,
  warning: colors.warning,
  info: colors.info,
  muted: colors.textSecondary,
};

/** One status label per day, colour always paired with text (design rule). */
export function dayStatus(d: AttendanceMonthDay): { label: string; tone: Tone } {
  if (d.isFuture) return { label: "Upcoming", tone: "muted" };
  if (d.hasOpenSession) return { label: "Punched in", tone: "success" };
  if (d.isHoliday) return { label: d.holidayName ?? "Holiday", tone: "info" };
  if (d.leaveLabel) return { label: d.leaveLabel, tone: "info" };
  if (d.present > 0) {
    if (d.isOutside) return { label: "Present (outside)", tone: "warning" };
    if (d.isLate) return { label: "Present (late)", tone: "warning" };
    return { label: d.bandLabel ?? "Present", tone: "success" };
  }
  if (d.isWeekend) return { label: "Week off", tone: "muted" };
  if (d.absent > 0) return { label: "Absent", tone: "danger" };
  return { label: d.code || "—", tone: "muted" };
}

const SESSION_STATUS: Record<string, { label: string; tone: Tone }> = {
  PRESENT: { label: "From office", tone: "success" },
  PRESENT_FROM_OUTSIDE: { label: "From outside", tone: "warning" },
  REMOTE: { label: "Remote", tone: "info" },
};

export function sessionStatus(s: AttendanceSession): { label: string; tone: Tone } {
  return SESSION_STATUS[s.status] ?? { label: s.status.replace(/_/g, " ").toLowerCase(), tone: "muted" };
}
