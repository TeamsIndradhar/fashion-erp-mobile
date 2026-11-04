import type { ApiClient } from "./client";
import type {
  AppConfig,
  AppNotification,
  AttendanceOffice,
  AttendanceDay,
  AttendanceMonth,
  AttendanceToday,
  CorrectionInput,
  CorrectionRequest,
  DeviceInfo,
  ExpenseAccountOption,
  LeaveBalance,
  LeaveDuration,
  LeaveRequest,
  LeaveType,
  LoginResponse,
  MeResponse,
  MobileDevice,
  OutdoorRejection,
  PaymentRequest,
  PaymentRequestStatus,
  PunchChallenge,
  PunchResult,
  RecordAttachment,
  RefreshResponse,
  SalaryAdvance,
  SalaryRun,
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

    // ---- Release 2: my requests ----
    leaveTypes: () => api.get<LeaveType[]>("/api/v1/leave-types"),
    leaveBalance: (employeeId: string, leaveTypeId: string, year: number) =>
      api.get<LeaveBalance>(`/api/v1/leave-requests/balance?employeeId=${encodeURIComponent(employeeId)}&leaveTypeId=${encodeURIComponent(leaveTypeId)}&year=${year}`),
    myLeaveRequests: () => api.get<LeaveRequest[]>("/api/v1/leave-requests?mine=true&pageSize=50"),
    applyLeave: (input: { leaveTypeId: string; days: { date: string; duration: LeaveDuration }[]; reason: string }) =>
      api.post<LeaveRequest>("/api/v1/leave-requests", input),

    myCorrections: () => api.get<CorrectionRequest[]>("/api/v1/attendance-corrections?mine=true&pageSize=50"),
    requestCorrection: (input: CorrectionInput) => api.post<CorrectionRequest>("/api/v1/attendance-corrections", input),
    addCorrectionProof: (id: string, file: { uri: string; name: string; type: string }) => {
      const form = new FormData();
      form.append("file", file as unknown as Blob);
      return api.request<unknown>(`/api/v1/attendance-corrections/${encodeURIComponent(id)}/documents`, { method: "POST", body: form, timeoutMs: 45_000 });
    },

    myOutsideReviews: () => api.get<OutdoorRejection[]>("/api/v1/attendance/outdoor-rejections?mine=true"),
    acceptOutsideReview: (id: string) => api.post<OutdoorRejection>(`/api/v1/attendance/outdoor-rejections/${encodeURIComponent(id)}/accept`),
    clarifyOutsideReview: (id: string, reason: string, proof: { uri: string; name: string; type: string } | null) => {
      const form = new FormData();
      form.append("reason", reason);
      if (proof) form.append("proof", proof as unknown as Blob);
      return api.request<OutdoorRejection>(`/api/v1/attendance/outdoor-rejections/${encodeURIComponent(id)}/clarify`, { method: "POST", body: form, timeoutMs: 45_000 });
    },

    salaryHistory: (year?: number) => api.get<{ canSeeAll: boolean; runs: SalaryRun[] }>(`/api/v1/salary/history${year ? `?year=${year}` : ""}`),
    respondToSalary: (lineId: string, response: "APPROVED" | "DISCUSS", remark: string | null) =>
      api.request<{ id: string }>(`/api/v1/salary/history/lines/${encodeURIComponent(lineId)}/response`, { method: "PUT", body: { response, remark } }),
    salarySlipPath: (lineId: string) => `/api/v1/salary/history/slips/${encodeURIComponent(lineId)}/pdf?disposition=inline`,

    salaryAdvances: () => api.get<{ hasEmployee: boolean; advances: SalaryAdvance[] }>("/api/v1/salary/advances"),
    requestAdvance: (input: { amount: number; installments: number; reason: string; requestKey: string }) => api.post<SalaryAdvance>("/api/v1/salary/advances", input),
    cancelAdvance: (id: string) => api.post<SalaryAdvance>(`/api/v1/salary/advances/${encodeURIComponent(id)}/cancel`),

    myExpenseRequests: (status?: PaymentRequestStatus) =>
      api.get<PaymentRequest[]>(`/api/v1/payment-requests?view=mine&group=EXPENDITURE&pageSize=50${status ? `&status=${status}` : ""}`),
    expenseRequest: (id: string) => api.get<PaymentRequest>(`/api/v1/payment-requests/${encodeURIComponent(id)}`),
    expenseAccounts: () => api.get<ExpenseAccountOption[]>("/api/v1/payment-requests/account-options?scope=expense"),
    raiseExpense: (input: { amount: number; payToName: string; accountId: string; paymentDueDate: string; remark: string; idempotencyKey: string }) =>
      api.post<PaymentRequest>("/api/v1/payment-requests", {
        requestType: "VOUCHER_SINGLE",
        amount: input.amount,
        payToName: input.payToName,
        paymentDueDate: input.paymentDueDate,
        remark: input.remark || undefined,
        idempotencyKey: input.idempotencyKey,
        voucher: { accountId: input.accountId, beneficiarySameAsPayTo: true },
      }),
    cancelExpense: (id: string) => api.post<PaymentRequest>(`/api/v1/payment-requests/${encodeURIComponent(id)}/cancel`),
    expenseFiles: (id: string) => api.get<RecordAttachment[]>(`/api/v1/record-attachments/payment-request/${encodeURIComponent(id)}`),
    addExpenseFile: (id: string, file: { uri: string; name: string; type: string }) => {
      const form = new FormData();
      form.append("files", file as unknown as Blob);
      return api.request<RecordAttachment[]>(`/api/v1/record-attachments/payment-request/${encodeURIComponent(id)}`, { method: "POST", body: form, timeoutMs: 45_000 });
    },
  };
}

export type Endpoints = ReturnType<typeof createEndpoints>;
