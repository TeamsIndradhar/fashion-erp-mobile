import { Platform } from "react-native";
import { ApiError } from "../../api/errors";
import type { PunchChallenge, PunchResult, PunchSignals } from "../../api/types";
import type { GpsFix } from "./location";

export interface PunchApi {
  punchChallenge(type: "IN" | "OUT"): Promise<PunchChallenge>;
  punch(form: FormData): Promise<PunchResult>;
}

export interface PunchRequest {
  type: "IN" | "OUT";
  /** Generated once per punch attempt and reused on every retry (idempotency, docs/04 §8). */
  clientPunchId: string;
  fix: GpsFix;
  selfie: { uri: string; name: string; type: string };
  facePhotoId: string | null;
  signals: PunchSignals;
}

export function buildPunchForm(req: PunchRequest, challenge: string): FormData {
  const form = new FormData();
  form.append("type", req.type);
  form.append("challenge", challenge);
  form.append("clientPunchId", req.clientPunchId);
  form.append("latitude", String(req.fix.latitude));
  form.append("longitude", String(req.fix.longitude));
  if (req.fix.accuracy !== null) form.append("accuracy", String(req.fix.accuracy));
  form.append("locationTimestamp", new Date(req.fix.timestamp).toISOString());
  if (req.facePhotoId) form.append("facePhotoId", req.facePhotoId);
  form.append("signals", JSON.stringify(req.signals));
  // React Native's FormData file part.
  let uri = req.selfie.uri;
  if (Platform.OS === "android" && !uri.startsWith("file://") && !uri.startsWith("content://")) {
    uri = `file://${uri}`;
  }
  form.append("selfie", {
    uri,
    name: req.selfie.name || "selfie.jpg",
    type: req.selfie.type || "image/jpeg",
  } as unknown as Blob);
  return form;
}

/**
 * Challenge → punch. A retry after a lost response reuses the same
 * clientPunchId, so the server replays the saved punch instead of making a
 * second one. An expired / used challenge gets one fresh challenge.
 */
export async function submitPunch(api: PunchApi, req: PunchRequest): Promise<PunchResult> {
  const first = await api.punchChallenge(req.type);
  try {
    return await api.punch(buildPunchForm(req, first.challenge));
  } catch (err) {
    if (!(err instanceof ApiError) || err.code !== "CHALLENGE_INVALID") throw err;
    const second = await api.punchChallenge(req.type);
    return api.punch(buildPunchForm(req, second.challenge));
  }
}

export function signalsFromFix(fix: GpsFix): PunchSignals {
  // Only what this build can read; the rest stays null = unknown (D-035 module not built yet).
  return {
    mocked: fix.mocked,
    developerOptions: null,
    adbEnabled: null,
    adbWifiEnabled: null,
    emulatorHeuristic: null,
    rootHeuristic: null,
    jailbreakHeuristic: null,
    debuggerAttached: null,
    locationProvider: null,
  };
}
