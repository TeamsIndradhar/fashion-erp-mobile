import type { SupportTicket, TicketCategory } from "../../api/types";

export const FAQ: { q: string; a: string }[] = [
  {
    q: "GPS is too weak — what do I do?",
    a: "Move near a window or step outside for a few seconds, turn on Location (GPS) in the phone's quick settings, and try again. Your company decides how accurate the location must be.",
  },
  {
    q: "My punch says “sent for review”.",
    a: "The punch was saved. It was outside the office area or your face could not be confirmed from the selfie, so your manager will check it. You don't need to punch again.",
  },
  {
    q: "The app says my face photo is missing.",
    a: "HR has to add your face photos in the ERP (Attendance → Face photos) before you can punch with a face check.",
  },
  {
    q: "I punched but the screen showed an error.",
    a: "Tap “Try again” on the same screen — the app sends the same punch, so it is never saved twice. Then check Attendance → Today.",
  },
  {
    q: "I changed my phone.",
    a: "Sign in on the new phone. You can use the app on 2 phones; remove an old one in Profile → My devices.",
  },
  {
    q: "I forgot my password.",
    a: "Ask HR or your ERP admin to reset it. You will get a temporary password and the app will ask you to set your own.",
  },
];

// Same values and labels as the ERP (support-ticket.schema.ts).
export const TICKET_CATEGORIES: { value: TicketCategory; label: string }[] = [
  { value: "GENERAL", label: "General question" },
  { value: "BUG", label: "Something isn't working" },
  { value: "ACCOUNT", label: "Account & login" },
  { value: "DATA", label: "Data correction" },
  { value: "FEATURE_REQUEST", label: "Feature request" },
];

export const TICKET_STATUS_LABEL: Record<SupportTicket["status"], string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  WAITING_ON_CUSTOMER: "Waiting on you",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

/** Mirrors createTicketSchema: subject 5–200, body 10–10000 characters. */
export function validateTicket(subject: string, body: string): { subject?: string; body?: string } {
  const e: { subject?: string; body?: string } = {};
  if (subject.trim().length < 5) e.subject = "Subject must be at least 5 characters.";
  if (body.trim().length < 10) e.body = "Describe the problem (at least 10 characters).";
  return e;
}
