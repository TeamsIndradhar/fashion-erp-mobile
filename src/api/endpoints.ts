import type { ApiClient } from "./client";
import type {
  AppConfig,
  AppNotification,
  AttendanceOffice,
  AttendanceDay,
  AttendanceMonth,
  AttendanceToday,
  DeviceInfo,
  LoginResponse,
  MeResponse,
  MobileDevice,
  PunchChallenge,
  PunchResult,
  RefreshResponse,
  SupportTicket,
  TicketCategory,
} from "./types";

/** Typed calls for the routes in docs/05 (release 1 = login + attendance). */
export function createEndpoints(api: ApiClient) {
  return {
    appConfig: () => api.get<AppConfig>("/api/mobile/v1/app-config", { auth: false }),
    login: (email: string, password: string, device: DeviceInfo) =>
      api.post<LoginResponse>("/api/mobile/v1/auth/login", { email, password, device }, { auth: false }),
    refresh: (refreshToken: string) => api.post<RefreshResponse>("/api/mobile/v1/auth/refresh", { refreshToken }, { auth: false }),
    logout: () => api.post<{ ok: true }>("/api/mobile/v1/auth/logout"),
    logoutAll: () => api.post<{ revoked: number }>("/api/mobile/v1/auth/logout-all"),
    me: () => api.get<MeResponse>("/api/mobile/v1/me"),
    devices: () => api.get<MobileDevice[]>("/api/mobile/v1/devices"),
    removeDevice: (id: string) => api.del<{ ok: true }>(`/api/mobile/v1/devices/${encodeURIComponent(id)}`),
    changePassword: (currentPassword: string, newPassword: string) =>
      api.post<{ ok: true }>("/api/v1/account/change-password", { currentPassword, newPassword }),

    punchChallenge: (type: "IN" | "OUT") => api.post<PunchChallenge>("/api/mobile/v1/attendance/punch-challenge", { purpose: "PUNCH", type }),
    officeLocations: () => api.get<AttendanceOffice[]>("/api/mobile/v1/attendance/locations"),
    /** multipart; 45 s like docs/02 §3. */
    punch: (form: FormData) => api.request<PunchResult>("/api/mobile/v1/attendance/punch", { method: "POST", body: form, timeoutMs: 45_000 }),

    attendanceToday: () => api.get<AttendanceToday>("/api/v1/attendance/me/today"),
    attendanceMonth: (month: string) => api.get<AttendanceMonth>(`/api/v1/attendance/me/month?month=${encodeURIComponent(month)}`),
    attendanceDay: (date: string) => api.get<AttendanceDay>(`/api/v1/attendance/me/day?date=${encodeURIComponent(date)}`),
    notifications: () => api.get<AppNotification[]>("/api/v1/notifications"),
    markNotificationRead: (id: string) => api.request<{ id: string }>(`/api/v1/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" }),
    markAllNotificationsRead: () => api.post<{ ok: true }>("/api/v1/notifications/mark-all-read"),

    myTickets: () => api.get<{ tickets: SupportTicket[] }>("/api/v1/support-tickets"),
    raiseTicket: (input: { subject: string; category: TicketCategory; body: string }) => {
      const form = new FormData();
      form.append("subject", input.subject);
      form.append("category", input.category);
      form.append("body", input.body);
      return api.request<SupportTicket>("/api/v1/support-tickets", { method: "POST", body: form });
    },

    setDayRemark: (date: string, remark: string) =>
      api.request<{ dateKey: string; remark: string | null; remarkAt: string | null }>("/api/v1/attendance/me/remark", {
        method: "PUT",
        body: { date, remark },
      }),
  };
}

export type Endpoints = ReturnType<typeof createEndpoints>;
