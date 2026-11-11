import * as Location from "expo-location";
import { reportMockedFix } from "../../device/deviceSecurity";

export interface GpsFix {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
  mocked: boolean | null;
}

export type PermissionState = "granted" | "denied" | "blocked";

/** Current foreground permission without showing the OS prompt (EMP-003 explains first). */
export async function getLocationPermission(): Promise<PermissionState> {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.granted) return "granted";
  return current.canAskAgain ? "denied" : "blocked";
}

/** Whether the phone's location services (GPS) are switched on. */
export async function locationServicesOn(): Promise<boolean> {
  try {
    return await Location.hasServicesEnabledAsync();
  } catch {
    return true;
  }
}

/** Foreground "while using" location only — never background (docs/10 §3). */
export async function ensureLocationPermission(): Promise<PermissionState> {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.granted) return "granted";
  if (!current.canAskAgain) return "blocked";
  const asked = await Location.requestForegroundPermissionsAsync();
  if (asked.granted) return "granted";
  return asked.canAskAgain ? "denied" : "blocked";
}

function toFix(l: Location.LocationObject): GpsFix {
  return {
    latitude: l.coords.latitude,
    longitude: l.coords.longitude,
    accuracy: l.coords.accuracy ?? null,
    timestamp: l.timestamp,
    mocked: typeof l.mocked === "boolean" ? l.mocked : null,
  };
}

/**
 * Watches GPS until a fix is within `targetAccuracy` metres or `timeoutMs`
 * passes, reporting each fix; resolves with the best one seen (or null).
 * The accuracy rule itself is the server's (`gpsAccuracyMeters`).
 */
export async function acquireFix(targetAccuracy: number, timeoutMs: number, onFix: (fix: GpsFix) => void): Promise<GpsFix | null> {
  let best: GpsFix | null = null;
  let sub: Location.LocationSubscription | null = null;
  return new Promise<GpsFix | null>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      sub?.remove();
      resolve(best);
    };
    const timer = setTimeout(finish, timeoutMs);
    Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 0 }, (l) => {
      const fix = toFix(l);
      // D-043: a fake GPS fix locks the app (warning, then sign-out).
      if (fix.mocked === true) reportMockedFix({ latitude: fix.latitude, longitude: fix.longitude });
      if (!best || (fix.accuracy ?? Infinity) <= (best.accuracy ?? Infinity)) best = fix;
      onFix(fix);
      if (fix.accuracy !== null && fix.accuracy <= targetAccuracy) finish();
    })
      .then((s) => {
        sub = s;
        if (done) s.remove();
      })
      .catch(finish);
  });
}

/** A fix older than this is refreshed before sending (stale-fix rule, docs/04). */
export const MAX_FIX_AGE_MS = 60_000;
