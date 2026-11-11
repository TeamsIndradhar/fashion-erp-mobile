import { checkDeviceSecurity, deviceGuardEnabled, onMockedFix, reasonsFor, reportMockedFix } from "./deviceSecurity";

describe("device security guard (D-043)", () => {
  it("is on for preview / production, off for development unless forced", () => {
    expect(deviceGuardEnabled("preview", undefined)).toBe(true);
    expect(deviceGuardEnabled("production", undefined)).toBe(true);
    expect(deviceGuardEnabled("development", undefined)).toBe(false);
    expect(deviceGuardEnabled("development", "1")).toBe(true);
    expect(deviceGuardEnabled("production", "0")).toBe(false);
  });

  it("only positive signals count; unknown (null) never blocks", () => {
    expect(reasonsFor({ developerOptions: null, adbEnabled: null, adbWifiEnabled: null, mocked: null })).toEqual([]);
    expect(reasonsFor({ developerOptions: false, adbEnabled: false, adbWifiEnabled: false, mocked: false })).toEqual([]);
    expect(reasonsFor({ developerOptions: true, adbEnabled: true, adbWifiEnabled: null, mocked: true })).toEqual(["DEVELOPER_OPTIONS_ON", "USB_DEBUGGING_ON", "MOCK_LOCATION"]);
  });

  it("combines native flags with the location probe", async () => {
    const check = await checkDeviceSecurity(
      () => ({ developerOptions: true, adbEnabled: false, adbWifiEnabled: null }),
      async () => ({ mocked: false, location: { latitude: 28.6, longitude: 77.2 } })
    );
    expect(check).toEqual({
      reasons: ["DEVELOPER_OPTIONS_ON"],
      signals: { developerOptions: true, adbEnabled: false, adbWifiEnabled: null, mocked: false },
      location: { latitude: 28.6, longitude: 77.2 },
    });
  });

  it("flags a mocked fix even when the native module is missing (iOS / old build)", async () => {
    const check = await checkDeviceSecurity(
      () => null,
      async () => ({ mocked: true, location: null })
    );
    expect(check.reasons).toEqual(["MOCK_LOCATION"]);
  });

  it("tells listeners about a mocked fix", () => {
    const seen: unknown[] = [];
    const off = onMockedFix((l) => seen.push(l));
    reportMockedFix({ latitude: 1, longitude: 2 });
    off();
    reportMockedFix({ latitude: 3, longitude: 4 });
    expect(seen).toEqual([{ latitude: 1, longitude: 2 }]);
  });
});
