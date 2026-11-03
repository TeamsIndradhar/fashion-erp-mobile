import { ApiError } from "../api/errors";
import type { RefreshResponse, TokenSet } from "../api/types";
import type { TokenStore } from "./tokenStore";

export type RefreshCall = (refreshToken: string) => Promise<RefreshResponse>;

/**
 * Owns the stored tokens and the single-flight refresh: when several requests
 * hit AUTH_TOKEN_EXPIRED at once, only one POST auth/refresh goes out and all
 * of them wait for it (a second refresh with the rotated token would revoke the
 * session — server treats refresh-token reuse as a leak).
 */
export function createSession(store: TokenStore, refreshCall: RefreshCall, onEnded: (reason: ApiError | null) => void) {
  let inFlight: Promise<TokenSet> | null = null;

  async function end(reason: ApiError | null) {
    await store.clear();
    onEnded(reason);
  }

  return {
    async accessToken(): Promise<string | null> {
      return (await store.load())?.accessToken ?? null;
    },

    async hasSession(): Promise<boolean> {
      return (await store.load()) !== null;
    },

    async start(tokens: TokenSet): Promise<void> {
      await store.save(tokens);
    },

    /** Refreshes once for all concurrent callers. Rejects (and ends the session) when the server refuses. */
    refresh(): Promise<TokenSet> {
      if (inFlight) return inFlight;
      inFlight = (async () => {
        try {
          const current = await store.load();
          if (!current) throw new ApiError(401, "AUTH_TOKEN_INVALID", "No session.");
          const next = await refreshCall(current.refreshToken);
          const tokens: TokenSet = {
            accessToken: next.accessToken,
            accessTokenExpiresAt: next.accessTokenExpiresAt,
            refreshToken: next.refreshToken,
            refreshTokenExpiresAt: next.refreshTokenExpiresAt,
          };
          await store.save(tokens);
          return tokens;
        } catch (err) {
          // Offline / timeout keeps the tokens: the refresh token is still valid.
          if (err instanceof ApiError && (err.status === 401 || err.code === "DEVICE_NOT_ALLOWED")) await end(err);
          throw err;
        } finally {
          inFlight = null;
        }
      })();
      return inFlight;
    },

    /** Local sign-out (the server call is made by the caller first, best effort). */
    end,
  };
}

export type Session = ReturnType<typeof createSession>;
