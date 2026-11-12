import { notificationTarget, unreadCount } from "../notifications/links";
import { FAQ, TICKET_CATEGORIES, ticketAuthor, validateTicket } from "./help";

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

describe("tickets with voice notes and the company desk (D-048)", () => {
  it("a voice note can replace the written description", () => {
    expect(validateTicket("App crash", "", true)).toEqual({});
    expect(validateTicket("App crash", "", false).body).toMatch(/voice note/);
  });
  it("names the author as the user sees it", () => {
    expect(ticketAuthor({ authorType: "PLATFORM", authorUserId: null, authorUser: null }, "u1")).toBe("Support team");
    expect(ticketAuthor({ authorType: "CUSTOMER", authorUserId: "u1", authorUser: { fullName: "Asha" } }, "u1")).toBe("You");
    expect(ticketAuthor({ authorType: "CUSTOMER", authorUserId: "u2", authorUser: { fullName: "HR Desk" } }, "u1")).toBe("HR Desk");
  });
});
