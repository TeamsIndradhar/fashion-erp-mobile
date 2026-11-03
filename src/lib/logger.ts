// Dev-only console logger. Crash vendor undecided (Q-12). Never pass tokens, passwords or photos.

const SECRET_KEYS = /token|password|authorization|selfie|photo/i;

function scrub(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(scrub);
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, SECRET_KEYS.test(k) ? "[hidden]" : scrub(v)]));
}

export const logger = {
  info(message: string, data?: unknown) {
    if (__DEV__) console.log(`[fe] ${message}`, data === undefined ? "" : scrub(data));
  },
  warn(message: string, data?: unknown) {
    if (__DEV__) console.warn(`[fe] ${message}`, data === undefined ? "" : scrub(data));
  },
  error(message: string, data?: unknown) {
    if (__DEV__) console.error(`[fe] ${message}`, data === undefined ? "" : scrub(data));
  },
  scrub,
};
