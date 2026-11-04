import { createSession } from "../auth/session";
import { createTokenStore, type SecureKV } from "../auth/tokenStore";
import { createApiClient } from "./client";
import { ApiError } from "./errors";

function memoryKV(): SecureKV {
  const data = new Map<string, string>();
  return { getItem: async (k) => data.get(k) ?? null, setItem: async (k, v) => void data.set(k, v), deleteItem: async (k) => void data.delete(k) };
}

function json(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, text: async () => JSON.stringify(body) } as Response;
}

const TOKENS = { accessToken: "fea_old", accessTokenExpiresAt: "x", refreshToken: "fer_old", refreshTokenExpiresAt: "y" };

async function setup(fetchImpl: jest.Mock) {
  const store = createTokenStore(memoryKV());
  await store.save(TOKENS);
  const onEnded = jest.fn();
  let session: ReturnType<typeof createSession> | null = null;
  const client = createApiClient({ baseUrl: "http://erp.test", appVersion: "1.0.0", platform: "android", fetchImpl, newRequestId: () => "req-1" }, () => session);
  session = createSession(store, (rt) => client.post("/api/mobile/v1/auth/refresh", { refreshToken: rt }, { auth: false }), onEnded);
  return { client, session, onEnded };
}

describe("api client", () => {
  it("sends the bearer and app headers and unwraps { data }", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(json(200, { data: { ok: true } }));
    const { client } = await setup(fetchImpl);
    await expect(client.get("/api/mobile/v1/me")).resolves.toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("http://erp.test/api/mobile/v1/me");
    expect(init.headers).toMatchObject({ Authorization: "Bearer fea_old", "X-App-Version": "1.0.0", "X-App-Platform": "android", "X-Request-Id": "req-1" });
  });

  it("does not send the bearer on public calls", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(json(200, { data: {} }));
    const { client } = await setup(fetchImpl);
    await client.get("/api/mobile/v1/app-config", { auth: false });
    expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it("refreshes once on AUTH_TOKEN_EXPIRED and replays with the new token", async () => {
    const fetchImpl = jest.fn(async (url: string, init: RequestInit) => {
      const auth = (init.headers as Record<string, string>).Authorization;
      if (url.endsWith("/auth/refresh")) return json(200, { data: { ...TOKENS, accessToken: "fea_new", refreshToken: "fer_new" } });
      if (auth === "Bearer fea_old") return json(401, { error: { code: "AUTH_TOKEN_EXPIRED", message: "expired" } });
      return json(200, { data: { me: 1 } });
    });
    const { client } = await setup(fetchImpl);
    const [a, b] = await Promise.all([client.get("/api/mobile/v1/me"), client.get("/api/v1/attendance/me/today")]);
    expect(a).toEqual({ me: 1 });
    expect(b).toEqual({ me: 1 });
    expect(fetchImpl.mock.calls.filter(([u]) => String(u).endsWith("/auth/refresh"))).toHaveLength(1);
  });

  it("ends the session on AUTH_SESSION_REVOKED", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(json(401, { error: { code: "AUTH_SESSION_REVOKED", message: "You were signed out." } }));
    const { client, session, onEnded } = await setup(fetchImpl);
    await expect(client.get("/api/mobile/v1/me")).rejects.toMatchObject({ code: "AUTH_SESSION_REVOKED", message: "You were signed out." });
    expect(onEnded).toHaveBeenCalled();
    expect(await session.hasSession()).toBe(false);
  });

  it("maps the ERP error envelope including field errors", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      json(400, { success: false, message: "Invalid", errors: { newPassword: ["Too short"] }, error: { code: "VALIDATION_ERROR", message: "Invalid", details: null } })
    );
    const { client } = await setup(fetchImpl);
    const err = (await client.post("/api/v1/account/change-password", {}).catch((e) => e)) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.fieldErrors.newPassword).toEqual(["Too short"]);
  });

  it("turns a failed fetch into NETWORK_ERROR and keeps the session", async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new TypeError("Network request failed"));
    const { client, session } = await setup(fetchImpl);
    await expect(client.get("/api/mobile/v1/me")).rejects.toMatchObject({ code: "NETWORK_ERROR" });
    expect(await session.hasSession()).toBe(true);
  });

  it("reports a file that cannot be attached as FILE_UNREADABLE, not as no internet", async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new Error("Unsupported FormDataPart implementation"));
    const { client } = await setup(fetchImpl);
    const err = (await client.get("/api/mobile/v1/me").catch((e) => e)) as ApiError;
    expect(err.code).toBe("FILE_UNREADABLE");
    expect(err.message).not.toContain("internet");
  });

  it("times out slow requests", async () => {
    const fetchImpl = jest.fn(
      (_u: string, init: RequestInit) => new Promise<Response>((_r, reject) => init.signal!.addEventListener("abort", () => reject(new Error("aborted"))))
    );
    const { client } = await setup(fetchImpl);
    await expect(client.request("/api/mobile/v1/me", { timeoutMs: 10 })).rejects.toMatchObject({ code: "TIMEOUT" });
  });

  it("uses 426 APP_VERSION_UNSUPPORTED from the server", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(json(426, { error: { code: "APP_VERSION_UNSUPPORTED", message: "Please update." } }));
    const { client } = await setup(fetchImpl);
    await expect(client.get("/api/mobile/v1/me")).rejects.toMatchObject({ status: 426, code: "APP_VERSION_UNSUPPORTED" });
  });
});
