import { createSession } from "../../auth/session";
import { createTokenStore, type SecureKV } from "../../auth/tokenStore";
import {
  canCancelAdvance,
  canCancelExpense,
  dateRange,
  decisionStatus,
  formatMoney,
  installmentAmount,
  parseAmount,
  validateAdvance,
  validateExpense,
} from "./requests";

describe("request helpers", () => {
  it("expands date ranges inclusively, capped at 62 days", () => {
    expect(dateRange("2026-11-29", "2026-12-02")).toEqual(["2026-11-29", "2026-11-30", "2026-12-01", "2026-12-02"]);
    expect(dateRange("2026-11-05", "2026-11-04")).toEqual([]);
    expect(dateRange("2026-01-01", "2026-12-31")).toHaveLength(62);
  });

  it("formats money with Indian grouping", () => {
    expect(formatMoney(123456.5)).toBe("₹1,23,456.50");
    expect(formatMoney("999")).toBe("₹999.00");
    expect(formatMoney(12345678)).toBe("₹1,23,45,678.00");
    expect(formatMoney("abc")).toBe("—");
  });

  it("parses amounts like the server rule (> 0, ≤ 2 decimals)", () => {
    expect(parseAmount("1,250.50")).toBe(1250.5);
    expect(parseAmount("0")).toBeNull();
    expect(parseAmount("12.345")).toBeNull();
    expect(parseAmount("-5")).toBeNull();
  });

  it("validates expense and advance forms", () => {
    expect(validateExpense({ amount: "500", payToName: "Ravi", accountId: "a1", dueDate: "2026-11-04", today: "2026-11-04" })).toEqual({});
    expect(Object.keys(validateExpense({ amount: "", payToName: " ", accountId: null, dueDate: "2026-11-01", today: "2026-11-04" })).sort()).toEqual(["accountId", "amount", "dueDate", "payToName"]);
    expect(validateAdvance({ amount: "5000", installments: 3, reason: "Rent" })).toEqual({});
    expect(Object.keys(validateAdvance({ amount: "5000", installments: 25, reason: "x" })).sort()).toEqual(["installments", "reason"]);
  });

  it("rounds instalments up like the server", () => {
    expect(installmentAmount(1000, 3)).toBe(333.34);
  });

  it("allows cancel only before payment", () => {
    expect(canCancelExpense("PENDING_APPROVAL")).toBe(true);
    expect(canCancelExpense("PAID")).toBe(false);
    expect(canCancelAdvance({ status: "RECOVERING" })).toBe(false);
  });

  it("labels decisions with text and tone", () => {
    expect(decisionStatus("PENDING")).toEqual({ label: "Waiting for approval", tone: "warning" });
    expect(decisionStatus("REJECTED").tone).toBe("danger");
  });
});

describe("freshAccessToken", () => {
  const kv = (): SecureKV => {
    const d = new Map<string, string>();
    return { getItem: async (k) => d.get(k) ?? null, setItem: async (k, v) => void d.set(k, v), deleteItem: async (k) => void d.delete(k) };
  };
  const now = Date.parse("2026-11-04T10:00:00Z");

  it("returns the stored token when it is not about to expire", async () => {
    const refresh = jest.fn();
    const s = createSession(createTokenStore(kv()), refresh, jest.fn());
    await s.start({ accessToken: "fea_1", accessTokenExpiresAt: "2026-11-04T10:10:00Z", refreshToken: "fer_1", refreshTokenExpiresAt: "x" });
    await expect(s.freshAccessToken(now)).resolves.toBe("fea_1");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("refreshes first when the token expires within a minute", async () => {
    const refresh = jest.fn().mockResolvedValue({ accessToken: "fea_2", accessTokenExpiresAt: "y", refreshToken: "fer_2", refreshTokenExpiresAt: "z" });
    const s = createSession(createTokenStore(kv()), refresh, jest.fn());
    await s.start({ accessToken: "fea_1", accessTokenExpiresAt: "2026-11-04T10:00:30Z", refreshToken: "fer_1", refreshTokenExpiresAt: "x" });
    await expect(s.freshAccessToken(now)).resolves.toBe("fea_2");
  });
});
