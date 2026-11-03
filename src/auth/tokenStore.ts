import type { TokenSet } from "../api/types";

/** Minimal key/value interface so the store can be tested without native code. */
export interface SecureKV {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  deleteItem(key: string): Promise<void>;
}

const KEY = "fe.session.v1";

/**
 * Tokens live only in SecureStore (Keychain / Keystore, this device only — D-014).
 * Never in AsyncStorage, never logged.
 */
export function createTokenStore(kv: SecureKV) {
  let cache: TokenSet | null | undefined;

  return {
    async load(): Promise<TokenSet | null> {
      if (cache !== undefined) return cache;
      const raw = await kv.getItem(KEY);
      if (!raw) return (cache = null);
      try {
        const parsed = JSON.parse(raw) as TokenSet;
        cache = parsed.accessToken && parsed.refreshToken ? parsed : null;
      } catch {
        cache = null;
      }
      if (cache === null) await kv.deleteItem(KEY);
      return cache;
    },
    async save(tokens: TokenSet): Promise<void> {
      const value: TokenSet = {
        accessToken: tokens.accessToken,
        accessTokenExpiresAt: tokens.accessTokenExpiresAt,
        refreshToken: tokens.refreshToken,
        refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
      };
      await kv.setItem(KEY, JSON.stringify(value));
      cache = value;
    },
    async clear(): Promise<void> {
      cache = null;
      await kv.deleteItem(KEY);
    },
  };
}

export type TokenStore = ReturnType<typeof createTokenStore>;
