import { notificationTarget, unreadCount } from "../notifications/links";
import { FAQ, TICKET_CATEGORIES, validateTicket } from "./help";

describe("help", () => {
  it("validates tickets like the ERP schema", () => {
    expect(validateTicket("Hi", "short")).toEqual({ subject: expect.any(String), body: expect.any(String) });
    expect(validateTicket("  GPS issue  ", "Punch fails at the gate every day")).toEqual({});
  });

  it("offers employee topics only (no billing)", () => {
    expect(TICKET_CATEGORIES.map((c) => c.value)).not.toContain("BILLING");
    expect(FAQ.length).toBeGreaterThan(3);
  });
});

describe("notifications", () => {
  it("opens attendance corrections in the app, everything else on the web", () => {
    expect(notificationTarget({ relatedModule: "ATTENDANCE_CORRECTION" })).toBe("/attendance");
    expect(notificationTarget({ relatedModule: "LEAVE_REQUEST" })).toBeNull();
    expect(notificationTarget({ relatedModule: null })).toBeNull();
  });

  it("counts unread", () => {
    expect(unreadCount([{ isRead: false }, { isRead: true }, { isRead: false }])).toBe(2);
    expect(unreadCount(undefined)).toBe(0);
  });
});
