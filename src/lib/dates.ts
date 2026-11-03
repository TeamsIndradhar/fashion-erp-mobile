// Attendance dates are shown in IST like the web (docs/02 §3), whatever the phone's time zone.

const IST_OFFSET_MS = 330 * 60 * 1000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ist(iso: string | Date): Date {
  return new Date(new Date(iso).getTime() + IST_OFFSET_MS);
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "09:15 AM" in IST. */
export function formatTime(iso: string | Date): string {
  const d = ist(iso);
  const h = d.getUTCHours();
  return `${pad(h % 12 || 12)}:${pad(d.getUTCMinutes())} ${h < 12 ? "AM" : "PM"}`;
}

/** "3 Nov 2026, 09:15 AM" in IST. */
export function formatDateTime(iso: string | Date): string {
  const d = ist(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${formatTime(iso)}`;
}

/** Today's IST date key "YYYY-MM-DD" (matches the server's istDateKey()). */
export function istDateKey(now: Date = new Date()): string {
  const d = ist(now);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** "YYYY-MM" for the IST month of `now`, shifted by `delta` months. */
export function istMonthKey(now: Date = new Date(), delta = 0): string {
  const d = ist(now);
  const m = d.getUTCFullYear() * 12 + d.getUTCMonth() + delta;
  return `${Math.floor(m / 12)}-${pad((m % 12) + 1)}`;
}

/** "Tue, 3 Nov" for a "YYYY-MM-DD" key (calendar value, no time zone shift). */
export function formatDateKey(key: string): string {
  const [y, m, day] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, day));
  return `${DAYS[d.getUTCDay()]}, ${day} ${MONTHS[m - 1]}`;
}

/** "November 2026" for "2026-11". */
export function formatMonthKey(key: string): string {
  const [y, m] = key.split("-").map(Number);
  const full = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${full[m - 1]} ${y}`;
}

/** 1.25 → "1h 15m". */
export function formatHours(hours: number | null | undefined): string {
  if (hours === null || hours === undefined || !Number.isFinite(hours)) return "—";
  const total = Math.round(hours * 60);
  return `${Math.floor(total / 60)}h ${pad(total % 60)}m`;
}
