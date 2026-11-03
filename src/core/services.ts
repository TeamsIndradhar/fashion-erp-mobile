import { createApiClient } from "../api/client";
import { createEndpoints } from "../api/endpoints";
import type { ApiError } from "../api/errors";
import { createSession, type Session } from "../auth/session";
import { createTokenStore } from "../auth/tokenStore";
import { env } from "../config/env";
import { secureKV } from "../device/secureKV";

type EndedListener = (reason: ApiError | null) => void;
const endedListeners = new Set<EndedListener>();

let session: Session | null = null;

export const api = createApiClient({ baseUrl: env.apiBaseUrl, appVersion: env.appVersion, platform: env.platform }, () => session);
export const endpoints = createEndpoints(api);
export const tokenStore = createTokenStore(secureKV);

session = createSession(tokenStore, endpoints.refresh, (reason) => endedListeners.forEach((l) => l(reason)));

export function getSession(): Session {
  return session!;
}

/** AuthProvider subscribes here so a refused refresh anywhere sends the user to Login. */
export function onSessionEnded(listener: EndedListener): () => void {
  endedListeners.add(listener);
  return () => endedListeners.delete(listener);
}
