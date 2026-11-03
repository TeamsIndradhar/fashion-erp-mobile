/** Compares "1.2.3" style versions (missing parts = 0, pre-release suffix ignored). */
export function compareVersions(a: string, b: string): number {
  const pa = a.split("-")[0].split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split("-")[0].split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return 0;
}

export type UpdateState = "required" | "available" | "current";

export function updateState(appVersion: string, cfg: { minAppVersion: string; latestAppVersion: string }): UpdateState {
  if (compareVersions(appVersion, cfg.minAppVersion) < 0) return "required";
  if (compareVersions(appVersion, cfg.latestAppVersion) < 0) return "available";
  return "current";
}
