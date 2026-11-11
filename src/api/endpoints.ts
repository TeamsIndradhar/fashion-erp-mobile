import type { ApiClient } from "./client";
import { appendFile } from "./formFile";
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
  FgStyleDetail,
  FgStyleRow,
  JobOrderDetail,
  LeaveBalance,
  LeaveDuration,
  LeaveRequest,
  LeaveType,
  LoginResponse,
  MaterialRequestDetail,
  MaterialRequestRow,
  LotDetail,
  MeResponse,
  MobileDevice,
  MyAssignment,
  OutdoorRejection,
  OutsideSession,
  OvertimeRow,
  PaymentRequest,
  PaymentRequestForReview,
  PaymentRequestStatus,
  PieceRateEarning,
  ProductionOrderDetail,
  ProductionOrderRow,
  ProgressEntry,
  ProgressQuantities,
  PurchaseOrderDetail,
  PurchaseOrderRow,
  PunchChallenge,
  PunchResult,
  RecordAttachment,
  RawStockDetail,
  RawStockRow,
  RefreshResponse,
  ResolvedBarcode,
  ReportCategoryGroup,
  ReportDescriptor,
  SalaryAdvance,
  SecurityViolationInput,
  StockMovementDetail,
  StockMovementRow,
  SalaryRun,
  SupportTicket,
  TeamCorrection,
  TeamDay,
  TeamLeaveRequest,
  TeamMonth,
  TeamOutdoorRejection,
  TicketCategory,
  WarehouseLocation,
  WarehouseOption,
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
    reportSecurityViolation: (body: SecurityViolationInput) => api.post<{ id: string; signedOut: true }>("/api/mobile/v1/security/violation", body),
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
    /** D-045 summaries: `query` = from, to, status, page, pageSize (summaries.rangeQuery). */
    myLeavePage: (query: string) => api.getPage<LeaveRequest>(`/api/v1/leave-requests?mine=true&${query}`),
    myCorrectionsPage: (query: string) => api.getPage<CorrectionRequest>(`/api/v1/attendance-corrections?mine=true&${query}`),
    myOutdoorRejections: (query: string) => api.get<OutdoorRejection[]>(`/api/v1/attendance/outdoor-rejections?mine=true&${query}`),
    myOvertime: (query: string) => api.get<OvertimeRow[]>(`/api/v1/attendance/overtime?mine=true&${query}`),
    applyLeave: (input: { leaveTypeId: string; days: { date: string; duration: LeaveDuration }[]; reason: string }) =>
      api.post<LeaveRequest>("/api/v1/leave-requests", input),

    myCorrections: () => api.get<CorrectionRequest[]>("/api/v1/attendance-corrections?mine=true&pageSize=50"),
    requestCorrection: (input: CorrectionInput) => api.post<CorrectionRequest>("/api/v1/attendance-corrections", input),
    addCorrectionProof: (id: string, file: { uri: string; name: string; type: string }) => {
      const form = new FormData();
      appendFile(form, "file", file);
      return api.request<unknown>(`/api/v1/attendance-corrections/${encodeURIComponent(id)}/documents`, { method: "POST", body: form, timeoutMs: 45_000 });
    },

    myOutsideReviews: () => api.get<OutdoorRejection[]>("/api/v1/attendance/outdoor-rejections?mine=true"),
    acceptOutsideReview: (id: string) => api.post<OutdoorRejection>(`/api/v1/attendance/outdoor-rejections/${encodeURIComponent(id)}/accept`),
    clarifyOutsideReview: (id: string, reason: string, proof: { uri: string; name: string; type: string } | null) => {
      const form = new FormData();
      form.append("reason", reason);
      if (proof) appendFile(form, "proof", proof);
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
    // ---- Worker (03) / supervisor (04) ----
    myAssignments: () => api.get<MyAssignment[]>("/api/v1/job-orders/my-assignments"),
    jobOrder: (id: string) => api.get<JobOrderDetail>(`/api/v1/job-orders/${encodeURIComponent(id)}`),
    lot: (id: string) => api.get<LotDetail>(`/api/v1/lots/${encodeURIComponent(id)}`),
    submitProgress: (jobOrderId: string, q: ProgressQuantities & { remarks: string }) =>
      api.post<ProgressEntry>(`/api/v1/job-orders/${encodeURIComponent(jobOrderId)}/self-progress`, q),
    myEntries: () => api.get<ProgressEntry[]>("/api/v1/job-order-progress-entries/mine"),
    handBack: (assignmentId: string, quantity: number, reason: string) =>
      api.post<{ id: string }>(`/api/v1/job-order-assignments/${encodeURIComponent(assignmentId)}/handback`, { quantity, reason }),
    myEarnings: () => api.get<PieceRateEarning[]>("/api/v1/piece-rate-earnings"),

    pendingEntries: () => api.get<ProgressEntry[]>("/api/v1/job-order-progress-entries/pending"),
    approveEntry: (id: string, approvalRemark: string) =>
      api.post<ProgressEntry>(`/api/v1/job-order-progress-entries/${encodeURIComponent(id)}/approve`, { approvalRemark }),
    rejectEntry: (id: string, approvalRemark: string) =>
      api.post<ProgressEntry>(`/api/v1/job-order-progress-entries/${encodeURIComponent(id)}/reject`, { approvalRemark }),
    correctEntry: (id: string, q: ProgressQuantities & { remarks?: string }) =>
      api.request<ProgressEntry>(`/api/v1/job-order-progress-entries/${encodeURIComponent(id)}`, { method: "PATCH", body: q }),
    // Team approvals (D-D06)
    teamLeave: () => api.get<TeamLeaveRequest[]>("/api/v1/leave-requests?status=PENDING&pageSize=100"),
    approveLeave: (id: string) => api.post<unknown>(`/api/v1/leave-requests/${encodeURIComponent(id)}/approve`),
    rejectLeave: (id: string, reason: string) => api.post<unknown>(`/api/v1/leave-requests/${encodeURIComponent(id)}/reject`, { reason }),
    teamCorrections: () => api.get<TeamCorrection[]>("/api/v1/attendance-corrections?status=PENDING&pageSize=100"),
    approveCorrection: (id: string) => api.post<unknown>(`/api/v1/attendance-corrections/${encodeURIComponent(id)}/approve`),
    rejectCorrection: (id: string, reason: string) => api.post<unknown>(`/api/v1/attendance-corrections/${encodeURIComponent(id)}/reject`, { reason }),
    teamOvertime: () => api.get<OvertimeRow[]>("/api/v1/attendance/overtime?status=PENDING"),
    approveOvertime: (id: string) => api.post<unknown>(`/api/v1/attendance/overtime/${encodeURIComponent(id)}/approve`),
    rejectOvertime: (id: string, reason: string) => api.post<unknown>(`/api/v1/attendance/overtime/${encodeURIComponent(id)}/reject`, { reason }),
    teamOutside: () => api.get<OutsideSession[]>("/api/v1/attendance/outdoor"),
    approveOutside: (sessionIds: string[]) => api.post<unknown>("/api/v1/attendance/outdoor", { sessionIds }),
    rejectOutside: (sessionId: string, input: { reason: string; trimmedCheckInAt: string; trimmedCheckOutAt: string }) =>
      api.post<unknown>(`/api/v1/attendance/outdoor/${encodeURIComponent(sessionId)}/reject`, input),
    teamClarifications: () => api.get<TeamOutdoorRejection[]>("/api/v1/attendance/outdoor-rejections?status=IN_PROCESS"),
    decideClarification: (id: string, decision: "approve" | "reject") =>
      api.post<unknown>(`/api/v1/attendance/outdoor-rejections/${encodeURIComponent(id)}/${decision}`),

    // Inventory (06)
    rawStock: (search: string, warehouseId?: string) =>
      api.get<RawStockRow[]>(`/api/v1/inventory/stock-balances?pageSize=50${search ? `&search=${encodeURIComponent(search)}` : ""}${warehouseId ? `&warehouseId=${warehouseId}` : ""}`),
    rawStockDetail: (productId: string) => api.get<RawStockDetail>(`/api/v1/inventory/stock-balances/${encodeURIComponent(productId)}`),
    fgStock: (search: string, warehouseId?: string) =>
      api.get<FgStyleRow[]>(`/api/v1/finished-goods-inventory/style-stock?pageSize=50${search ? `&search=${encodeURIComponent(search)}` : ""}${warehouseId ? `&warehouseId=${warehouseId}` : ""}`),
    fgStockDetail: (productId: string) => api.get<FgStyleDetail>(`/api/v1/finished-goods-inventory/style-stock/${encodeURIComponent(productId)}`),
    movements: (status?: string) => api.get<StockMovementRow[]>(`/api/v1/stock-movements?pageSize=50${status ? `&status=${status}` : ""}`),
    movement: (id: string) => api.get<StockMovementDetail>(`/api/v1/stock-movements/${encodeURIComponent(id)}`),
    receiveMovement: (id: string, items: { itemId: string; toWarehouseLocationId: string }[]) =>
      api.post<StockMovementDetail>(`/api/v1/stock-movements/${encodeURIComponent(id)}/receive`, { items }),
    warehouses: () => api.get<WarehouseOption[]>("/api/v1/warehouses?pageSize=100"),
    warehouseLocations: (warehouseId: string) => api.get<WarehouseLocation[]>(`/api/v1/warehouses/${encodeURIComponent(warehouseId)}/locations`),
    resolveBarcode: (code: string) => api.get<ResolvedBarcode>(`/api/v1/barcodes/resolve/${encodeURIComponent(code)}`),

    // Reports (ADM-005/006, OWN-001)
    reportCatalog: () => api.get<ReportCategoryGroup[]>("/api/mobile/v1/reports"),
    report: (category: string, key: string, filters: Record<string, string> = {}) => {
      const qs = new URLSearchParams(filters).toString();
      return api.get<{ descriptor: ReportDescriptor }>(`/api/v1/reports/${encodeURIComponent(category)}/${encodeURIComponent(key)}${qs ? `?${qs}` : ""}`, { timeoutMs: 45_000 });
    },
    reportExportPath: (category: string, key: string, format: "xlsx" | "pdf", filters: Record<string, string> = {}) => {
      const qs = new URLSearchParams(filters).toString();
      return `/api/v1/reports/${encodeURIComponent(category)}/${encodeURIComponent(key)}/export/${format}${qs ? `?${qs}` : ""}`;
    },

    // Approvals inbox (Phase 5)
    paymentRequestsToApprove: () => api.get<PaymentRequestForReview[]>("/api/v1/payment-requests?view=approve&pageSize=100&sortBy=createdAt&sortOrder=asc"),
    paymentRequestForReview: (id: string) => api.get<PaymentRequestForReview>(`/api/v1/payment-requests/${encodeURIComponent(id)}`),
    approvePaymentRequest: (id: string, remark: string) =>
      api.post<PaymentRequestForReview>(`/api/v1/payment-requests/${encodeURIComponent(id)}/approve`, remark ? { remark } : {}),
    rejectPaymentRequest: (id: string, rejectionReason: string) =>
      api.post<PaymentRequestForReview>(`/api/v1/payment-requests/${encodeURIComponent(id)}/reject`, { rejectionReason }),
    purchaseOrdersToApprove: () => api.get<PurchaseOrderRow[]>("/api/v1/purchase-orders?status=DRAFT&pageSize=100"),
    purchaseOrder: (id: string) => api.get<PurchaseOrderDetail>(`/api/v1/purchase-orders/${encodeURIComponent(id)}`),
    approvePurchaseOrder: (id: string) => api.post<unknown>(`/api/v1/purchase-orders/${encodeURIComponent(id)}/approve`),
    materialRequestsToApprove: () => api.get<MaterialRequestRow[]>("/api/v1/material-requests?approvalStatus=PENDING&pageSize=100"),
    materialRequest: (id: string) => api.get<MaterialRequestDetail>(`/api/v1/material-requests/${encodeURIComponent(id)}`),
    decideMaterialRequest: (id: string, decision: "approve" | "reject", approvalRemark: string) =>
      api.post<unknown>(`/api/v1/material-requests/${encodeURIComponent(id)}/${decision}`, { approvalRemark: approvalRemark || null }),

    teamDay: (date: string) => api.get<TeamDay>(`/api/v1/attendance/team-day?date=${encodeURIComponent(date)}`),
    teamMonth: (month: string) => api.get<TeamMonth>(`/api/v1/attendance/team-month?month=${encodeURIComponent(month)}&view=team`),
    productionOrders: () => api.get<ProductionOrderRow[]>("/api/v1/production-orders?pageSize=50&status=IN_PROGRESS"),
    productionOrder: (id: string) => api.get<ProductionOrderDetail>(`/api/v1/production-orders/${encodeURIComponent(id)}`),

    addExpenseFile: (id: string, file: { uri: string; name: string; type: string }) => {
      const form = new FormData();
      appendFile(form, "files", file);
      return api.request<RecordAttachment[]>(`/api/v1/record-attachments/payment-request/${encodeURIComponent(id)}`, { method: "POST", body: form, timeoutMs: 45_000 });
    },
  };
}

export type Endpoints = ReturnType<typeof createEndpoints>;
