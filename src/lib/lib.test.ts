import { validateLogin, validatePasswordChange } from "../auth/validation";
import { formatDateKey, formatHours, formatTime, istDateKey, istMonthKey } from "./dates";
import { logger } from "./logger";
import { compareVersions, updateState } from "./version";

describe("versions", () => {
  it("compares semver parts numerically", () => {
    expect(compareVersions("1.10.0", "1.9.9")).toBe(1);
    expect(compareVersions("1.0", "1.0.0")).toBe(0);
    expect(compareVersions("1.0.0-beta", "1.0.1")).toBe(-1);
  });
  it("derives the update state from app-config", () => {
    const cfg = { minAppVersion: "1.2.0", latestAppVersion: "1.4.0" };
    expect(updateState("1.1.9", cfg)).toBe("required");
    expect(updateState("1.3.0", cfg)).toBe("available");
    expect(updateState("1.4.0", cfg)).toBe("current");
  });
});

describe("IST dates", () => {
  it("uses IST regardless of the phone time zone", () => {
    expect(formatTime("2026-11-03T03:45:00.000Z")).toBe("09:15 AM");
    expect(formatTime("2026-11-03T12:30:00.000Z")).toBe("06:00 PM");
    expect(istDateKey(new Date("2026-11-03T19:00:00.000Z"))).toBe("2026-11-04");
  });
  it("shifts month keys across years", () => {
    expect(istMonthKey(new Date("2026-01-10T00:00:00.000Z"), -1)).toBe("2025-12");
    expect(istMonthKey(new Date("2026-11-10T00:00:00.000Z"), 0)).toBe("2026-11");
  });
  it("formats keys and hours", () => {
    expect(formatDateKey("2026-11-03")).toBe("Tue, 3 Nov");
    expect(formatHours(1.25)).toBe("1h 15m");
    expect(formatHours(null)).toBe("—");
  });
});

describe("validation", () => {
  it("checks login fields", () => {
    expect(validateLogin("", "")).toEqual({ email: expect.any(String), password: expect.any(String) });
    expect(validateLogin("bad", "x").email).toBeDefined();
    expect(validateLogin(" a@b.in ", "x")).toEqual({});
  });
  it("checks the password change rules", () => {
    expect(validatePasswordChange("temp1234", "short", "short").next).toBeDefined();
    expect(validatePasswordChange("temp1234", "temp1234", "temp1234").next).toBeDefined();
    expect(validatePasswordChange("temp1234", "newpass12", "newpass13").confirm).toBeDefined();
    expect(validatePasswordChange("temp1234", "newpass12", "newpass12")).toEqual({});
  });
});

describe("logger", () => {
  it("hides secrets", () => {
    expect(logger.scrub({ accessToken: "fea_x", nested: { password: "p", ok: 1 } })).toEqual({ accessToken: "[hidden]", nested: { password: "[hidden]", ok: 1 } });
  });
});

describe("IST time on a day", () => {
  it("builds and reads back an IST instant", () => {
    const { istTimeOnDayOf, istHhmm } = jest.requireActual("./dates") as typeof import("./dates");
    // 03:45Z = 09:15 IST on 4 Nov.
    expect(istTimeOnDayOf("2026-11-04T03:45:00.000Z", "10:30")).toBe("2026-11-04T10:30:00+05:30");
    // 20:00Z on 3 Nov is already 4 Nov in IST.
    expect(istTimeOnDayOf("2026-11-03T20:00:00.000Z", "08:00")).toBe("2026-11-04T08:00:00+05:30");
    expect(istHhmm("2026-11-04T03:45:00.000Z")).toBe("09:15");
    expect(new Date(istTimeOnDayOf("2026-11-04T03:45:00.000Z", "09:15")).toISOString()).toBe("2026-11-04T03:45:00.000Z");
  });
});
