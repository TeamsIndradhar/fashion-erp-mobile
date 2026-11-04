import type { AttendanceOffice } from "../../api/types";

const EARTH_RADIUS_M = 6_371_000;

/** Great-circle distance in metres (Haversine). Display only — the server decides (docs/02 §7). */
export function distanceMeters(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Nearest office and whether the fix looks inside its radius (an estimate for the screen). */
export function nearestOffice(fix: { latitude: number; longitude: number }, offices: AttendanceOffice[]) {
  let best: { office: AttendanceOffice; distance: number } | null = null;
  for (const office of offices) {
    const distance = distanceMeters(fix, office);
    if (!best || distance < best.distance) best = { office, distance };
  }
  return best ? { ...best, inside: best.distance <= best.office.radiusMeters } : null;
}
