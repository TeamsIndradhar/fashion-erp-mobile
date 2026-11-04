import type { TeamDay, TeamDayStatus } from "../../api/types";
import type { Tone } from "../attendance/labels";

export const TEAM_STATUS: Record<TeamDayStatus, { label: string; tone: Tone; order: number }> = {
  ABSENT: { label: "Absent", tone: "danger", order: 0 },
  NOT_PUNCHED: { label: "Not punched", tone: "warning", order: 1 },
  OUTSIDE: { label: "Outside", tone: "warning", order: 2 },
  HALF_DAY: { label: "Half day", tone: "warning", order: 3 },
  PRESENT: { label: "Present", tone: "success", order: 4 },
  ON_LEAVE: { label: "On leave", tone: "info", order: 5 },
  WEEKLY_OFF: { label: "Week off", tone: "muted", order: 6 },
  HOLIDAY: { label: "Holiday", tone: "muted", order: 7 },
  NOT_JOINED: { label: "Not joined", tone: "muted", order: 8 },
};

export type TeamFilter = "ALL" | "IN" | "NOT_IN" | "LATE" | "LEAVE";

/** People who need attention first (absent / not punched / outside), then the rest by name. */
export function sortAndFilterTeam(rows: TeamDay["rows"], filter: TeamFilter): TeamDay["rows"] {
  const keep = rows.filter((r) => {
    if (r.status === "NOT_JOINED") return false;
    switch (filter) {
      case "IN":
        return r.status === "PRESENT" || r.status === "OUTSIDE" || r.status === "HALF_DAY";
      case "NOT_IN":
        return r.status === "ABSENT" || r.status === "NOT_PUNCHED";
      case "LATE":
        return r.day.isLate;
      case "LEAVE":
        return r.status === "ON_LEAVE";
      default:
        return true;
    }
  });
  return [...keep].sort((a, b) => TEAM_STATUS[a.status].order - TEAM_STATUS[b.status].order || a.employee.fullName.localeCompare(b.employee.fullName));
}
