/**
 * Contract check against a running ERP (dev server). Skipped unless
 * LIVE_API_BASE_URL, LIVE_EMAIL and LIVE_PASSWORD are set, e.g.
 *   LIVE_API_BASE_URL=http://localhost:3000 LIVE_EMAIL=… LIVE_PASSWORD=… npx jest src/api/live
 * Uses the app's real client, session and endpoints (no mocks).
 */
import { createSession } from "../auth/session";
import { createTokenStore, type SecureKV } from "../auth/tokenStore";
import { createApiClient } from "./client";
import { createEndpoints } from "./endpoints";

const BASE = process.env.LIVE_API_BASE_URL;
const run = BASE && process.env.LIVE_EMAIL && process.env.LIVE_PASSWORD ? describe : describe.skip;

/** jest-expo swaps `fetch` for React Native's mocked networking, so talk to the server with node:http. */
const nodeFetch = ((url: string, init: RequestInit = {}) =>
  new Promise<Response>((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const http = require("node:http") as typeof import("node:http");
    const req = http.request(url, { method: init.method ?? "GET", headers: init.headers as Record<string, string> }, (res) => {
      let text = "";
      res.setEncoding("utf8");
      res.on("data", (c: string) => (text += c));
      res.on("end", () => resolve({ ok: (res.statusCode ?? 0) < 300, status: res.statusCode ?? 0, text: async () => text } as Response));
    });
    req.on("error", reject);
    if (typeof init.body === "string") req.write(init.body);
    req.end();
  })) as unknown as typeof fetch;

/** Text-only multipart for FormData bodies (React Native's `_parts` or the standard entries()), so the shim can send forms. */
const nodeFetchWithForms = ((url: string, init: RequestInit = {}) => {
  const form = init.body as unknown as { _parts?: [string, string][]; entries?: () => Iterable<[string, unknown]> } | undefined;
  const parts = form?._parts ?? (form && typeof form.entries === "function" ? [...form.entries()].map(([k, v]) => [k, String(v)] as [string, string]) : null);
  if (!parts) return nodeFetch(url, init);
  const boundary = "----fe-contract-test";
  const body = parts.map(([k, v]) => `--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`).join("") + `--${boundary}--\r\n`;
  return nodeFetch(url, { ...init, body, headers: { ...(init.headers as Record<string, string>), "Content-Type": `multipart/form-data; boundary=${boundary}` } });
}) as unknown as typeof fetch;

function memoryKV(): SecureKV {
  const data = new Map<string, string>();
  return { getItem: async (k) => data.get(k) ?? null, setItem: async (k, v) => void data.set(k, v), deleteItem: async (k) => void data.delete(k) };
}

run("live ERP contract", () => {
  jest.setTimeout(60_000);
  const store = createTokenStore(memoryKV());
  let session: ReturnType<typeof createSession> | null = null;
  const api = createApiClient({ baseUrl: BASE!, appVersion: "1.0.0", platform: "android", fetchImpl: nodeFetchWithForms }, () => session);
  const ep = createEndpoints(api);
  session = createSession(store, ep.refresh, () => undefined);

  it("signs in, reads me / today / month / offices, gets a challenge, refreshes and signs out", async () => {
    const cfg = await ep.appConfig();
    expect(cfg.minAppVersion).toMatch(/^\d+\.\d+/);

    const login = await ep.login(process.env.LIVE_EMAIL!, process.env.LIVE_PASSWORD!, {
      installationId: "7d0c6a3e-1f2b-4c5d-8e9f-0a1b2c3d4e5f",
      platform: "android",
      model: "Contract test",
      appVersion: "1.0.0",
    });
    expect(login.accessToken).toMatch(/^fea_/);
    await session!.start(login);

    const me = await ep.me();
    expect(me.user.email).toBe(process.env.LIVE_EMAIL);
    expect(typeof me.permissions.attendance.view).toBe("boolean");

    const today = await ep.attendanceToday();
    expect(today.dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Array.isArray(today.sessions)).toBe(true);
    expect(typeof today.rules.gpsAccuracyMeters).toBe("number");

    const month = await ep.attendanceMonth(today.dateKey.slice(0, 7));
    expect(month.days.length).toBeGreaterThan(27);

    const offices = await ep.officeLocations();
    expect(Array.isArray(offices)).toBe(true);

    const challenge = await ep.punchChallenge(today.isPunchedIn ? "OUT" : "IN");
    expect(challenge.challenge.split(".")).toHaveLength(2);

    const alerts = await ep.notifications();
    expect(Array.isArray(alerts)).toBe(true);
    await expect(ep.markAllNotificationsRead()).resolves.toEqual({ ok: true });

    const tickets = await ep.myTickets();
    expect(Array.isArray(tickets.tickets)).toBe(true);
    // Reaches the create route through the bearer allowlist without creating a ticket.
    await expect(ep.raiseTicket({ subject: "Hi", category: "GENERAL", body: "too short" })).rejects.toMatchObject({ status: 400, code: "VALIDATION_ERROR" });

    const devices = await ep.devices();
    expect(devices.some((d) => d.isCurrent)).toBe(true);

    const before = await session!.accessToken();
    await session!.refresh();
    expect(await session!.accessToken()).not.toBe(before);
    await expect(ep.me()).resolves.toBeTruthy();

    // Remove this test phone (also signs it out) so runs never fill the 2-phone limit.
    await ep.removeDevice(devices.find((d) => d.isCurrent)!.id);
    await expect(ep.me()).rejects.toMatchObject({ code: "AUTH_SESSION_REVOKED" });
  });
});
