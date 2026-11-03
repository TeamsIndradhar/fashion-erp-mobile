import { ApiError } from "../api/errors";
import type { TokenSet } from "../api/types";
import { createSession } from "./session";
import { createTokenStore, type SecureKV } from "./tokenStore";

function memoryKV(): SecureKV & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: async (k) => data.get(k) ?? null,
    setItem: async (k, v) => void data.set(k, v),
    deleteItem: async (k) => void data.delete(k),
  };
}

const tokens = (n: number): TokenSet => ({
  accessToken: `fea_${n}`,
  accessTokenExpiresAt: "2026-11-03T10:15:00.000Z",
  refreshToken: `fer_${n}`,
  refreshTokenExpiresAt: "2026-12-03T10:00:00.000Z",
});

describe("session single-flight refresh", () => {
  it("sends one refresh for many concurrent callers and stores the rotated pair", async () => {
    const store = createTokenStore(memoryKV());
    let resolve!: (t: TokenSet) => void;
    const refreshCall = jest.fn(() => new Promise<TokenSet>((r) => (resolve = r)));
    const session = createSession(store, refreshCall, jest.fn());
    await session.start(tokens(1));

    const calls = [session.refresh(), session.refresh(), session.refresh()];
    await Promise.resolve();
    resolve(tokens(2));
    const results = await Promise.all(calls);

    expect(refreshCall).toHaveBeenCalledTimes(1);
    expect(refreshCall).toHaveBeenCalledWith("fer_1");
    expect(results.every((t) => t.accessToken === "fea_2")).toBe(true);
    expect(await session.accessToken()).toBe("fea_2");
  });

  it("allows a new refresh after the previous one finished", async () => {
    const store = createTokenStore(memoryKV());
    const refreshCall = jest.fn().mockResolvedValueOnce(tokens(2)).mockResolvedValueOnce(tokens(3));
    const session = createSession(store, refreshCall, jest.fn());
    await session.start(tokens(1));
    await session.refresh();
    await session.refresh();
    expect(refreshCall).toHaveBeenNthCalledWith(2, "fer_2");
  });

  it("ends the session when the server refuses the refresh token", async () => {
    const kv = memoryKV();
    const store = createTokenStore(kv);
    const onEnded = jest.fn();
    const refused = new ApiError(401, "AUTH_SESSION_REVOKED", "Signed out.");
    const session = createSession(store, jest.fn().mockRejectedValue(refused), onEnded);
    await session.start(tokens(1));

    await expect(session.refresh()).rejects.toBe(refused);
    expect(onEnded).toHaveBeenCalledWith(refused);
    expect(await session.hasSession()).toBe(false);
    expect(kv.data.size).toBe(0);
  });

  it("keeps the tokens when the phone is offline", async () => {
    const store = createTokenStore(memoryKV());
    const onEnded = jest.fn();
    const session = createSession(store, jest.fn().mockRejectedValue(new ApiError(0, "NETWORK_ERROR", "offline")), onEnded);
    await session.start(tokens(1));

    await expect(session.refresh()).rejects.toMatchObject({ code: "NETWORK_ERROR" });
    expect(onEnded).not.toHaveBeenCalled();
    expect(await session.accessToken()).toBe("fea_1");
  });
});

describe("token store", () => {
  it("drops a corrupt stored value", async () => {
    const kv = memoryKV();
    kv.data.set("fe.session.v1", "{not json");
    const store = createTokenStore(kv);
    expect(await store.load()).toBeNull();
    expect(kv.data.size).toBe(0);
  });

  it("stores only the four token fields", async () => {
    const kv = memoryKV();
    const store = createTokenStore(kv);
    await store.save({ ...tokens(1), extra: "x" } as TokenSet);
    expect(Object.keys(JSON.parse(kv.data.get("fe.session.v1")!)).sort()).toEqual(
      ["accessToken", "accessTokenExpiresAt", "refreshToken", "refreshTokenExpiresAt"].sort()
    );
  });
});
