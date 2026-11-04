import { ApiError } from "../../api/errors";
import type { AttendanceMonthDay, PunchResult } from "../../api/types";
import { distanceMeters, nearestOffice } from "./estimate";
import { dayStatus } from "./labels";
import { buildPunchForm, signalsFromFix, submitPunch, type PunchApi, type PunchRequest } from "./submitPunch";

const fix = { latitude: 12.9716, longitude: 77.5946, accuracy: 18, timestamp: Date.parse("2026-11-04T04:00:00Z"), mocked: false };
const req: PunchRequest = {
  type: "IN",
  clientPunchId: "0b9f1c2e-6c47-4f1a-9d2e-3a4b5c6d7e8f",
  fix,
  selfie: { uri: "file:///selfie.jpg", name: "selfie.jpg", type: "image/jpeg" },
  facePhotoId: null,
  signals: signalsFromFix(fix),
};
const ok = { message: "Time IN marked successfully", replayed: false } as PunchResult;

function fieldsOf(form: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  // React Native's FormData keeps parts in `_parts`; jsdom/undici's has entries().
  const parts: [string, unknown][] = (form as unknown as { _parts?: [string, unknown][] })._parts ?? [...(form as unknown as Iterable<[string, unknown]>)];
  for (const [k, v] of parts) out[k] = v;
  return out;
}

describe("submitPunch", () => {
  it("gets a challenge for the side and sends the punch form", async () => {
    const api: PunchApi = { punchChallenge: jest.fn().mockResolvedValue({ challenge: "c1" }), punch: jest.fn().mockResolvedValue(ok) };
    await expect(submitPunch(api, req)).resolves.toBe(ok);
    expect(api.punchChallenge).toHaveBeenCalledWith("IN");
    const f = fieldsOf((api.punch as jest.Mock).mock.calls[0][0]);
    expect(f).toMatchObject({ type: "IN", challenge: "c1", clientPunchId: req.clientPunchId, latitude: "12.9716", accuracy: "18", locationTimestamp: "2026-11-04T04:00:00.000Z" });
    expect(JSON.parse(f.signals as string)).toMatchObject({ mocked: false, developerOptions: null });
    expect(f.facePhotoId).toBeUndefined();
  });

  it("fetches one fresh challenge when the first expired, keeping the clientPunchId", async () => {
    const punch = jest.fn().mockRejectedValueOnce(new ApiError(409, "CHALLENGE_INVALID", "expired")).mockResolvedValueOnce(ok);
    const api: PunchApi = { punchChallenge: jest.fn().mockResolvedValueOnce({ challenge: "c1" }).mockResolvedValueOnce({ challenge: "c2" }), punch };
    await expect(submitPunch(api, req)).resolves.toBe(ok);
    expect(fieldsOf(punch.mock.calls[1][0])).toMatchObject({ challenge: "c2", clientPunchId: req.clientPunchId });
  });

  it("passes the server's rule messages through", async () => {
    const api: PunchApi = {
      punchChallenge: jest.fn().mockResolvedValue({ challenge: "c1" }),
      punch: jest.fn().mockRejectedValue(new ApiError(409, "INVALID_STATE_TRANSITION", "You are already logged in. Please punch out first.")),
    };
    await expect(submitPunch(api, req)).rejects.toThrow("already logged in");
    expect(api.punchChallenge).toHaveBeenCalledTimes(1);
  });

  it("omits accuracy when the phone did not report it", () => {
    const f = fieldsOf(buildPunchForm({ ...req, fix: { ...fix, accuracy: null } }, "c"));
    expect(f.accuracy).toBeUndefined();
  });
});

describe("office estimate", () => {
  const offices = [
    { id: "a", name: "Head Office", latitude: 12.9716, longitude: 77.5946, radiusMeters: 100 },
    { id: "b", name: "Gurugram", latitude: 28.5124719, longitude: 77.0446586, radiusMeters: 100 },
  ];
  it("measures distance with Haversine", () => {
    expect(Math.round(distanceMeters({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 }))).toBe(111195);
  });
  it("picks the nearest office and says inside / outside", () => {
    expect(nearestOffice({ latitude: 12.9717, longitude: 77.5946 }, offices)).toMatchObject({ office: { id: "a" }, inside: true });
    expect(nearestOffice({ latitude: 12.98, longitude: 77.5946 }, offices)).toMatchObject({ office: { id: "a" }, inside: false });
    expect(nearestOffice(fix, [])).toBeNull();
  });
});

describe("day status label", () => {
  const base: AttendanceMonthDay = {
    dateKey: "2026-11-03", weekday: "Tue", code: "P", isFuture: false, isHoliday: false, holidayName: null, isWeekend: false, isLate: false, isOutside: false,
    bandLabel: null, leaveLabel: null, firstIn: null, lastOut: null, hasOpenSession: false, workedHours: 8, present: 1, leave: 0, absent: 0, sessions: [], remark: null,
  };
  it("pairs every status with text", () => {
    expect(dayStatus(base)).toEqual({ label: "Present", tone: "success" });
    expect(dayStatus({ ...base, isOutside: true })).toEqual({ label: "Present (outside)", tone: "warning" });
    expect(dayStatus({ ...base, present: 0, absent: 1 })).toEqual({ label: "Absent", tone: "danger" });
    expect(dayStatus({ ...base, present: 0, isWeekend: true })).toEqual({ label: "Week off", tone: "muted" });
    expect(dayStatus({ ...base, hasOpenSession: true })).toEqual({ label: "Punched in", tone: "success" });
  });
});
