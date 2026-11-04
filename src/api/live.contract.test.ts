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

    // Release 2 reads (no writes): each route is reachable with the bearer token and has the expected shape.
    const types = await ep.leaveTypes();
    expect(Array.isArray(types)).toBe(true);
    if (types[0] && me.employee) expect(typeof (await ep.leaveBalance(me.employee.id, types[0].id, 2026)).remainingDays).toBe("number");
    expect(Array.isArray(await ep.myLeaveRequests())).toBe(true);
    expect(Array.isArray(await ep.myCorrections())).toBe(true);
    expect(Array.isArray(await ep.myOutsideReviews())).toBe(true);
    expect(Array.isArray((await ep.salaryHistory()).runs)).toBe(true);
    expect(Array.isArray((await ep.salaryAdvances()).advances)).toBe(true);
    if (me.viewableModules.includes("payment_requests")) {
      const expenses = await ep.myExpenseRequests();
      expect(Array.isArray(expenses)).toBe(true);
      expect(Array.isArray(await ep.expenseAccounts())).toBe(true);
      if (expenses[0]) {
        expect((await ep.expenseRequest(expenses[0].id)).id).toBe(expenses[0].id);
        expect(Array.isArray(await ep.expenseFiles(expenses[0].id))).toBe(true);
      }
    }
    // LIVE_WRITES=1: create and cancel an expense request and a salary advance (dev data only),
    // and check leave / correction payloads reach the server's own validation.
    if (process.env.LIVE_WRITES === "1") {
      const accounts = await ep.expenseAccounts();
      if (accounts[0] && me.viewableModules.includes("payment_requests")) {
        const key = `contract-${Date.now()}`;
        const exp = await ep.raiseExpense({ amount: 12.5, payToName: "Contract test", accountId: accounts[0].id, paymentDueDate: "2030-01-01", remark: "mobile contract test", idempotencyKey: key });
        expect(exp.status).toBe("PENDING_APPROVAL");
        const again = await ep.raiseExpense({ amount: 12.5, payToName: "Contract test", accountId: accounts[0].id, paymentDueDate: "2030-01-01", remark: "mobile contract test", idempotencyKey: key });
        expect(again.id).toBe(exp.id); // idempotent retry
        expect((await ep.cancelExpense(exp.id)).status).toBe("CANCELLED");
      }
      if (me.employee) {
        const adv = await ep.requestAdvance({ amount: 100, installments: 2, reason: "Contract test", requestKey: `contract-${Date.now()}` }).catch((e) => e);
        if (adv?.id) expect((await ep.cancelAdvance(adv.id)).status).toBe("CANCELLED");
        else expect(adv).toMatchObject({ code: "INVALID_STATE_TRANSITION" }); // already has an open advance
      }
      await expect(ep.applyLeave({ leaveTypeId: types[0]?.id ?? "00000000-0000-0000-0000-000000000000", days: [], reason: "" })).rejects.toMatchObject({ status: 400, message: expect.stringContaining("at least one date") });
      await expect(ep.requestCorrection({ type: "MISSED_PUNCH", attendanceDate: "2026-11-01", checkIn: "09:00", reason: "x" })).rejects.toMatchObject({ status: 400, message: expect.stringContaining("Both login and logout") });
    }

    // Worker / supervisor reads (03, 04).
    expect(typeof me.permissions.production?.view).toBe("boolean");
    const assignments = await ep.myAssignments().catch((e) => e);
    // Self-entry off / not linked are real answers, not failures.
    if (Array.isArray(assignments)) {
      if (assignments[0]) expect((await ep.jobOrder(assignments[0].jobOrderId)).jobNumber).toBeTruthy();
    } else expect(["PERMISSION_DENIED", "VALIDATION_ERROR"]).toContain(assignments.code);
    if (me.permissions.pieceRate?.view) expect(Array.isArray(await ep.myEarnings())).toBe(true);
    if (me.permissions.production?.approve) expect(Array.isArray(await ep.pendingEntries())).toBe(true);
    if (me.permissions.production?.view) {
      const orders = await ep.productionOrders();
      expect(Array.isArray(orders)).toBe(true);
      if (orders[0]) expect(typeof (await ep.productionOrder(orders[0].id)).progress.progressPercent).toBe("number");
    }

    // Team attendance (SUP-002/003): reachable, and no pay fields on any person.
    const PAY = ["fixedMonthlySalary", "travelAllowance", "dearnessAllowance", "overtimeRatePerHour"];
    if (me.permissions.attendance.team) {
      const td = await ep.teamDay(today.dateKey);
      expect(typeof td.cards.total).toBe("number");
      for (const r of td.rows) expect(Object.keys(r.employee).filter((k) => PAY.includes(k))).toEqual([]);
    }
    if (me.permissions.attendance.teamMonth) {
      const tm = await ep.teamMonth(today.dateKey.slice(0, 7));
      for (const e of tm.employees) expect(Object.keys(e.employee).filter((k) => PAY.includes(k))).toEqual([]);
    }

    // Team approval lists (D-D06) — reads only; overtime carries no pay without salary access.
    const ap = me.permissions.approvals;
    if (ap?.leave) for (const r of await ep.teamLeave()) expect(r.employee.fullName).toBeTruthy();
    if (ap?.correction) expect(Array.isArray(await ep.teamCorrections())).toBe(true);
    if (ap?.outdoor) {
      expect(Array.isArray(await ep.teamOutside())).toBe(true);
      expect(Array.isArray(await ep.teamClarifications())).toBe(true);
    }
    if (ap?.overtime) for (const o of await ep.teamOvertime()) expect(o).not.toHaveProperty("employee.attendanceProfile");

    // Approvals inbox (Phase 5) — reads only, plus read-only paths refuse writes.
    if (ap?.paymentRequest) for (const r of await ep.paymentRequestsToApprove()) expect(r.createdByUserId).not.toBe(me.user.id);
    if (ap?.purchaseOrder) {
      const pos = await ep.purchaseOrdersToApprove();
      if (pos[0]) expect(Array.isArray((await ep.purchaseOrder(pos[0].id)).items)).toBe(true);
    }
    if (ap?.materialRequest) for (const m of await ep.materialRequestsToApprove()) expect(m.approvalStatus).toBe("PENDING");
    await expect(api.post("/api/v1/purchase-orders", {})).rejects.toMatchObject({ status: 403 });
    await expect(api.request("/api/v1/material-requests/00000000-0000-0000-0000-000000000000", { method: "PATCH", body: {} })).rejects.toMatchObject({ status: 403 });

    // Reports (ADM-005/006, OWN-001): catalog, executive dashboard, first listed report.
    const catalog = await ep.reportCatalog();
    expect(Array.isArray(catalog)).toBe(true);
    if (me.viewableModules.includes("reports")) {
      const exec = await ep.report("dashboard", "executive-dashboard");
      expect(Array.isArray(exec.descriptor.rows)).toBe(true);
      for (const r of exec.descriptor.rows) expect(typeof r.section).toBe("string");
      const first = catalog.find((g) => g.category !== "dashboard" && g.category !== "mis");
      if (first) expect(Array.isArray((await ep.report(first.category, first.reports[0].key)).descriptor.columns)).toBe(true);
    }
    await expect(api.post("/api/v1/reports/dashboard/executive-dashboard", {})).rejects.toMatchObject({ status: 403 });

    // Routes outside the mobile allowlist stay refused for a mobile token.
    await expect(api.post("/api/v1/leave-requests/carry-forward", { fromYear: 2025 })).rejects.toMatchObject({ status: 403 });
    await expect(api.post("/api/v1/attendance/outdoor-rejections/00000000-0000-0000-0000-000000000000/cancel")).rejects.toMatchObject({ status: 403 });

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
