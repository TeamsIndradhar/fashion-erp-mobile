import type { MyAssignment, ProgressEntry } from "../../api/types";
import { assignmentProgress, groupAssignments, pieces, usedBy, validateHandBack, validateProgress } from "./work";

const entry = (over: Partial<ProgressEntry>): ProgressEntry => ({
  id: "e",
  jobOrderId: "j",
  jobOrderAssignmentId: "a1",
  completedQuantity: "0.0000",
  rejectedQuantity: "0.0000",
  damagedQuantity: "0.0000",
  extraQuantity: "0.0000",
  remarks: null,
  approvalStatus: "APPROVED",
  approvalRemark: null,
  createdAt: "",
  recordedByUserId: "u",
  ...over,
});

describe("work helpers", () => {
  it("reads ERP decimal strings as pieces", () => {
    expect(pieces("12.0000")).toBe(12);
    expect(pieces(null)).toBe(0);
  });

  it("counts used pieces like the server (completed + rejected + damaged − extra)", () => {
    expect(usedBy(entry({ completedQuantity: "10", rejectedQuantity: "1", damagedQuantity: "1", extraQuantity: "2" }))).toBe(10);
  });

  it("splits an assignment into approved / pending / remaining, ignoring rejected entries", () => {
    const a = { id: "a1", assignedQuantity: "50.0000" };
    const p = assignmentProgress(a, [
      entry({ completedQuantity: "20" }),
      entry({ completedQuantity: "5", approvalStatus: "PENDING" }),
      entry({ completedQuantity: "30", approvalStatus: "REJECTED" }),
      entry({ completedQuantity: "9", jobOrderAssignmentId: "other" }),
    ]);
    expect(p).toEqual({ assigned: 50, approved: 20, pending: 5, remaining: 25 });
  });

  it("groups assignments by status", () => {
    const g = groupAssignments([{ status: "ASSIGNED" }, { status: "IN_PROGRESS" }, { status: "COMPLETED" }] as MyAssignment[]);
    expect(g.map((x) => x.items.length)).toEqual([1, 1, 1]);
  });

  it("validates a progress entry", () => {
    const ok = validateProgress({ completed: "10", rejected: "", damaged: "1", extra: "" }, { remaining: 20, allowsExtra: false });
    expect(ok.quantities).toEqual({ completedQuantity: 10, rejectedQuantity: 0, damagedQuantity: 1, extraQuantity: 0 });
    expect(validateProgress({ completed: "", rejected: "", damaged: "", extra: "" }, { remaining: 5, allowsExtra: false }).errors.form).toBeDefined();
    expect(validateProgress({ completed: "2.5", rejected: "", damaged: "", extra: "" }, { remaining: 5, allowsExtra: false }).errors.completed).toBeDefined();
    expect(validateProgress({ completed: "3", rejected: "", damaged: "", extra: "1" }, { remaining: 5, allowsExtra: false }).errors.extra).toMatch(/does not allow/);
    expect(validateProgress({ completed: "3", rejected: "", damaged: "", extra: "4" }, { remaining: 5, allowsExtra: true }).errors.extra).toMatch(/more than finished/);
    expect(validateProgress({ completed: "9", rejected: "", damaged: "", extra: "" }, { remaining: 5, allowsExtra: false }).errors.form).toMatch(/only 5/);
    expect(validateProgress({ completed: "7", rejected: "", damaged: "", extra: "2" }, { remaining: 5, allowsExtra: true }).quantities).not.toBeNull();
  });

  it("validates hand back", () => {
    expect(validateHandBack("3", "Machine broke", 5)).toEqual({});
    expect(validateHandBack("6", "ok", 5)).toEqual({ quantity: expect.stringMatching(/at most 5/), reason: expect.any(String) });
  });
});
