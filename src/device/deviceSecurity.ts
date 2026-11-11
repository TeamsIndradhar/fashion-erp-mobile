import * as Device from "expo-device";
import * as Location from "expo-location";
import { getNativeDeviceSignals, type NativeDeviceSignals } from "../../modules/device-signals";
import { env } from "../config/env";

/**
 * D-043 (user, 2026-11-11): a phone with Developer options / USB debugging on,
 * or a mock (fake GPS) location, may sign in but sees nothing of the app — only
 * a warning for 10 s, then it is signed out. The server keeps a row with the
 * user and phone details (POST /api/mobile/v1/security/violation).
 *
 * Client-side only: a modified app can skip this. The server also refuses a
 * punch that reports mocked / developerOptions (fashion-erp mobile-attendance).
 */

export type SecurityReason = "DEVELOPER_OPTIONS_ON" | "USB_DEBUGGING_ON" | "WIRELESS_DEBUGGING_ON" | "MOCK_LOCATION";

export interface SecuritySignals {
  developerOptions: boolean | null;
  adbEnabled: boolean | null;
  adbWifiEnabled: boolean | null;
  mocked: boolean | null;
}

export interface SecurityCheck {
  reasons: SecurityReason[];
  signals: SecuritySignals;
  location: { latitude: number; longitude: number } | null;
}

/**
 * Development builds need USB debugging to run at all, so the guard is off
 * there unless EXPO_PUBLIC_DEVICE_GUARD=1. Preview and production always check.
 */
export function deviceGuardEnabled(variant: string = env.appVariant, flag: string | undefined = process.env.EXPO_PUBLIC_DEVICE_GUARD): boolean {
  if (flag === "0") return false;
  return variant !== "development" || flag === "1";
}

export function reasonsFor(s: SecuritySignals): SecurityReason[] {
  const r: SecurityReason[] = [];
  if (s.developerOptions === true) r.push("DEVELOPER_OPTIONS_ON");
  if (s.adbEnabled === true) r.push("USB_DEBUGGING_ON");
  if (s.adbWifiEnabled === true) r.push("WIRELESS_DEBUGGING_ON");
  if (s.mocked === true) r.push("MOCK_LOCATION");
  return r;
}

type FixProbe = { mocked: boolean | null; location: { latitude: number; longitude: number } | null };

/** Mock flag of the last known fix, only when location is already allowed (never shows the OS prompt). */
async function lastFixProbe(): Promise<FixProbe> {
  try {
    const perm = await Location.getForegroundPermissionsAsync();
    if (!perm.granted) return { mocked: null, location: null };
    const l = await Location.getLastKnownPositionAsync({ maxAge: 10 * 60_000 });
    if (!l) return { mocked: null, location: null };
    return { mocked: typeof l.mocked === "boolean" ? l.mocked : null, location: { latitude: l.coords.latitude, longitude: l.coords.longitude } };
  } catch {
    return { mocked: null, location: null };
  }
}

/** Fresh fix (bounded by `timeoutMs`), only when location is already allowed and on. */
export async function freshFixProbe(timeoutMs = 8000): Promise<FixProbe> {
  try {
    const perm = await Location.getForegroundPermissionsAsync();
    if (!perm.granted || !(await Location.hasServicesEnabledAsync())) return { mocked: null, location: null };
    const fix = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
    ]);
    if (!fix) return { mocked: null, location: null };
    return { mocked: typeof fix.mocked === "boolean" ? fix.mocked : null, location: { latitude: fix.coords.latitude, longitude: fix.coords.longitude } };
  } catch {
    return { mocked: null, location: null };
  }
}

/** Fast check (no GPS wait): native flags + the last known fix. */
export async function checkDeviceSecurity(native: () => NativeDeviceSignals | null = getNativeDeviceSignals, probe: () => Promise<FixProbe> = lastFixProbe): Promise<SecurityCheck> {
  const n = native();
  const p = await probe();
  const signals: SecuritySignals = {
    developerOptions: n?.developerOptions ?? null,
    adbEnabled: n?.adbEnabled ?? null,
    adbWifiEnabled: n?.adbWifiEnabled ?? null,
    mocked: p.mocked,
  };
  return { reasons: reasonsFor(signals), signals, location: p.location };
}

/** Phone details saved with the violation (who signed in from which phone). */
export function securityDeviceDetails() {
  const cut = (v: string | null | undefined, max: number) => (v ? v.slice(0, max) : null);
  return {
    platform: env.platform,
    manufacturer: cut(Device.manufacturer, 80),
    brand: cut(Device.brand, 80),
    model: cut(Device.modelName, 120),
    deviceName: cut(Device.deviceName, 120),
    osVersion: cut(Device.osVersion, 40),
    appVersion: env.appVersion,
    isPhysicalDevice: Device.isDevice,
  };
}

// Any GPS fix the app reads anywhere (Home, punch) that comes back mocked
// locks the app at once. location.ts calls reportMockedFix(); AuthProvider listens.
type MockListener = (location: { latitude: number; longitude: number }) => void;
const mockListeners = new Set<MockListener>();

export function onMockedFix(listener: MockListener): () => void {
  mockListeners.add(listener);
  return () => mockListeners.delete(listener);
}

export function reportMockedFix(location: { latitude: number; longitude: number }) {
  mockListeners.forEach((l) => l(location));
}
