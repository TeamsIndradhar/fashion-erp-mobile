import type { TeamDay, TeamDayStatus } from "../../api/types";
import { sortAndFilterTeam } from "./team";

const row = (name: string, status: TeamDayStatus, isLate = false): TeamDay["rows"][number] => ({
  employee: { id: name, employeeCode: name, fullName: name, shift: null },
  status,
  day: { firstIn: null, lastOut: null, workedHours: 0, isLate, hasOpenSession: false, leaveLabel: null },
});

describe("team attendance list", () => {
  const rows = [row("Zara", "PRESENT"), row("Amit", "PRESENT", true), row("Bina", "ABSENT"), row("Chetan", "NOT_JOINED"), row("Dev", "ON_LEAVE"), row("Esha", "NOT_PUNCHED")];

  it("puts people needing attention first and hides not-joined", () => {
    expect(sortAndFilterTeam(rows, "ALL").map((r) => r.employee.fullName)).toEqual(["Bina", "Esha", "Amit", "Zara", "Dev"]);
  });

  it("filters", () => {
    expect(sortAndFilterTeam(rows, "IN").map((r) => r.employee.fullName)).toEqual(["Amit", "Zara"]);
    expect(sortAndFilterTeam(rows, "NOT_IN").map((r) => r.employee.fullName)).toEqual(["Bina", "Esha"]);
    expect(sortAndFilterTeam(rows, "LATE").map((r) => r.employee.fullName)).toEqual(["Amit"]);
    expect(sortAndFilterTeam(rows, "LEAVE").map((r) => r.employee.fullName)).toEqual(["Dev"]);
  });
});
