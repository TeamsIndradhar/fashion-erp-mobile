// Hand-written from docs/05_API_CONTRACT.md and fashion-erp src/modules/mobile-auth (D-013).
// The app never imports ERP code.

export type Platform = "android" | "ios";

export interface ApiErrorBody {
  success?: false;
  message?: string;
  errors?: Record<string, string[]>;
  error?: { code: string; message: string; details?: Record<string, unknown> | null };
}

export interface AppConfig {
  minAppVersion: string;
  latestAppVersion: string;
  serverTime: string;
  integrity: { androidPlayIntegrity: boolean; iosAppAttest: boolean };
}

export interface TokenSet {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface DeviceInfo {
  installationId: string;
  platform: Platform;
  model?: string;
  osVersion?: string;
  appVersion?: string;
}

export interface LoginResponse extends TokenSet {
  mustChangePassword: boolean;
  user: { id: string; fullName: string; email: string };
  company: { id: string; name: string } | null;
  device: { id: string; status: string; integrityStatus: string };
}

export type RefreshResponse = TokenSet & { mustChangePassword?: boolean };

export interface MeResponse {
  user: { id: string; fullName: string; email: string; phone: string | null };
  company: { id: string; name: string } | null;
  employee: {
    id: string;
    employeeCode: string;
    fullName: string;
    branchName: string | null;
    departmentName: string | null;
    designationName: string | null;
    shift: { id: string; name: string; startTime: string; endTime: string; graceMinutes: number } | null;
  } | null;
  mustChangePassword: boolean;
  permissions: { attendance: { view: boolean; punch: boolean } };
  modulesEnabled: { hrms: boolean };
  viewableModules: string[];
  device: { id: string; status: string; integrityStatus: string; model: string | null; platform: string } | null;
}

export interface MobileDevice {
  id: string;
  platform: string;
  model: string | null;
  osVersion: string | null;
  appVersion: string | null;
  status: string;
  lastSeenAt: string | null;
  createdAt: string;
  isCurrent?: boolean;
}

// ---- Attendance (existing /api/v1/attendance/me/* routes, reused through the bearer adapter) ----

export interface AttendanceOffice {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

/** toMySessionView() shape. */
export interface AttendanceSession {
  id: string;
  checkInAt: string;
  checkOutAt: string | null;
  status: string;
  source: string;
  isLoginFromOffice: boolean;
  isLogoutFromOffice: boolean | null;
  inLocationName: string | null;
  outLocationName: string | null;
  inOffice: AttendanceOffice | null;
  outOffice: AttendanceOffice | null;
  inDistanceMeters: number | null;
  outDistanceMeters: number | null;
  hasInSelfie: boolean;
  hasOutSelfie: boolean;
}

export interface AttendanceToday {
  employee: {
    id: string;
    fullName: string;
    employeeCode: string;
    shift: { id: string; name: string; startTime: string; endTime: string; graceMinutes: number } | null;
  };
  dateKey: string;
  isPunchedIn: boolean;
  openSessionId: string | null;
  sessions: AttendanceSession[];
  remark: string | null;
  finalizedHours: number;
  liveHours: number;
  facePhotoIds: string[];
  hasLocations: boolean;
  rules: { requireFace: boolean; faceMatchThreshold: number; faceMatchFrames: number; gpsAccuracyMeters: number };
}

export interface AttendanceMonthDay {
  dateKey: string;
  weekday: string;
  code: string;
  isFuture: boolean;
  isHoliday: boolean;
  holidayName: string | null;
  isWeekend: boolean;
  isLate: boolean;
  isOutside: boolean;
  bandLabel: string | null;
  leaveLabel: string | null;
  firstIn: string | null;
  lastOut: string | null;
  hasOpenSession: boolean;
  workedHours: number;
  present: number;
  leave: number;
  absent: number;
  sessions: { id: string; checkInAt: string; checkOutAt: string | null; hours: number | null }[];
  remark: string | null;
}

export interface AttendanceMonth {
  year: number;
  month: number;
  employee: { id: string; fullName: string; employeeCode: string };
  /** computeEmployeesMonth() summary — render known keys, ignore the rest. */
  summary: Partial<Record<"presentDays" | "absentDays" | "paidLeaveDays" | "unpaidLeaveDays" | "lateDays" | "outsideDays" | "totalHours" | "workingDays" | "holidayDays", number>>;
  days: AttendanceMonthDay[];
}

export interface AttendanceDay {
  dateKey: string;
  isFuture: boolean;
  sessions: AttendanceSession[];
  workedHours: number;
  remark: string | null;
  remarkAt: string | null;
}

// ---- Mobile punch (/api/mobile/v1/attendance/*) ----

export interface PunchChallenge {
  challenge: string;
  challengeId: string;
  expiresAt: string;
}

/** Client-reported device signals: true / false / null (unknown). Untrusted on the server. */
export interface PunchSignals {
  mocked: boolean | null;
  developerOptions: boolean | null;
  adbEnabled: boolean | null;
  adbWifiEnabled: boolean | null;
  emulatorHeuristic: boolean | null;
  rootHeuristic: boolean | null;
  jailbreakHeuristic: boolean | null;
  debuggerAttached: boolean | null;
  locationProvider: string | null;
}

export interface PunchResult {
  message: string;
  session: AttendanceSession;
  fromOffice: boolean;
  locationName: string | null;
  distanceMeters: number | null;
  review: { riskLevel: string; needsReview: boolean; employeeMessage: string | null };
  replayed: boolean;
}

// ---- Notifications (existing /api/v1/notifications) ----

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  relatedModule: string | null;
  relatedRecordId: string | null;
  isRead: boolean;
  createdAt: string;
}

// ---- Support tickets (existing /api/v1/support-tickets, list + create only on mobile) ----

export type TicketCategory = "GENERAL" | "BUG" | "BILLING" | "ACCOUNT" | "DATA" | "FEATURE_REQUEST";

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_ON_CUSTOMER" | "RESOLVED" | "CLOSED";
  category: TicketCategory;
  createdAt: string;
  lastMessageAt: string | null;
}

// ---- Leave (existing /api/v1/leave-*) ----

export type LeaveDuration = "FULL" | "F_HALF" | "S_HALF" | "QR1" | "QR2" | "QR3" | "QR4";

export interface LeaveType {
  id: string;
  name: string;
  annualDays: string;
  isActive: boolean;
}

export interface LeaveBalance {
  annualDays: number;
  usedDays: number;
  remainingDays: number;
  carriedInDays: number;
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
  leaveType: { id: string; name: string };
  days: { id: string; leaveDate: string; durationType: LeaveDuration; fraction: string }[];
}

// ---- Attendance regularization (existing /api/v1/attendance-corrections) ----

export type CorrectionType = "MISSED_PUNCH" | "MISSED_LOGOUT" | "CHANGE_LOGIN" | "CHANGE_LOGOUT" | "LEAVE_NOT_TAKEN" | "EMERGENCY_LEAVE";

export interface CorrectionInput {
  type: CorrectionType;
  attendanceDate?: string;
  sessionId?: string;
  checkIn?: string;
  checkOut?: string;
  reason: string;
}

export interface CorrectionRequest {
  id: string;
  type: CorrectionType;
  attendanceDate: string;
  requestedPunchIn: string | null;
  requestedPunchOut: string | null;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
}

// ---- Outside punch reviews (existing /api/v1/attendance/outdoor-rejections) ----

export interface OutdoorRejection {
  id: string;
  sessionId: string;
  originalCheckIn: string;
  originalCheckOut: string | null;
  trimmedCheckIn: string;
  trimmedCheckOut: string | null;
  rejectedReason: string | null;
  status: "PENDING" | "IN_PROCESS" | "APPROVED" | "REJECTED";
  clarificationReason: string | null;
  clarifiedAt: string | null;
  hasProof: boolean;
  session: { id: string; attendanceRecord: { attendanceDate: string } | null } | null;
}

// ---- Salary (existing /api/v1/salary/history, /api/v1/salary/advances) ----

export interface SalaryLine {
  id: string;
  employeeCode: string;
  employeeName: string;
  paidDays: number;
  calendarDays: number;
  gross: number;
  deductions: number;
  arrears: number;
  net: number;
  isMine: boolean;
  employeeResponse: "APPROVED" | "DISCUSS" | null;
  employeeRemark: string | null;
  employeeRespondedAt: string | null;
}

export interface SalaryRun {
  id: string;
  year: number;
  month: number;
  status: "APPROVED" | "FINALISED";
  lines: SalaryLine[];
}

export interface SalaryAdvance {
  id: string;
  amount: number;
  installments: number;
  installmentAmount: number;
  reason: string;
  createdAt: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "CANCELLED" | "RECOVERING" | "RECOVERED";
  recovered: number;
  remaining: number;
  paymentRequest: { id: string; requestNumber: string; status: string; rejectionReason: string | null } | null;
}

// ---- Expense requests (existing /api/v1/payment-requests, type VOUCHER_SINGLE) ----

export type PaymentRequestStatus = "PENDING_APPROVAL" | "APPROVED" | "PARTIALLY_PAID" | "PAID" | "REJECTED" | "CANCELLED";

export interface PaymentRequest {
  id: string;
  requestNumber: string;
  requestType: string;
  status: PaymentRequestStatus;
  /** Prisma Decimal → string. */
  amount: string;
  paidAmount: string;
  payToName: string | null;
  paymentDueDate: string | null;
  remark: string | null;
  rejectionReason: string | null;
  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  cancelledAt: string | null;
  isOverdue?: boolean;
  typeDataJson: { purposeName?: string; expenseAccountName?: string } | null;
}

export interface ExpenseAccountOption {
  id: string;
  code: string;
  name: string;
}

export interface RecordAttachment {
  id: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}
