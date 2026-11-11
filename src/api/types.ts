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

/** POST /api/mobile/v1/security/violation (D-043). */
export interface SecurityViolationInput {
  reasons: ("DEVELOPER_OPTIONS_ON" | "USB_DEBUGGING_ON" | "WIRELESS_DEBUGGING_ON" | "MOCK_LOCATION")[];
  device: {
    installationId: string;
    platform: Platform;
    manufacturer: string | null;
    brand: string | null;
    model: string | null;
    deviceName: string | null;
    osVersion: string | null;
    appVersion: string | null;
    isPhysicalDevice: boolean | null;
  };
  signals: { developerOptions: boolean | null; adbEnabled: boolean | null; adbWifiEnabled: boolean | null; mocked: boolean | null };
  location: { latitude: number; longitude: number } | null;
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
    selfEntryEnabled?: boolean;
  } | null;
  mustChangePassword: boolean;
  permissions: {
    attendance: { view: boolean; punch: boolean; team?: boolean; teamMonth?: boolean };
    /** Older servers do not send these. */
    production?: { view: boolean; approve: boolean };
    pieceRate?: { view: boolean };
    inventory?: { receive: boolean; scan: boolean };
    approvals?: { leave: boolean; correction: boolean; outdoor: boolean; overtime: boolean; paymentRequest?: boolean; purchaseOrder?: boolean; materialRequest?: boolean };
  };
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

export interface MissingPunchOut {
  sessionId: string;
  /** The day of the punch-in. */
  dateKey: string;
  checkInAt: string;
  locationName: string | null;
  /** Set once a Missed logout request is waiting for approval. */
  requestId: string | null;
  requestedPunchOut: string | null;
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
  /** Earlier punches with no punch-out (newest first); each needs a Missed logout request before the next Punch In. Older servers omit it. */
  missingPunchOuts?: MissingPunchOut[];
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
  /** The day's punch-in has no punch-out and can no longer be punched out. Older servers omit it. */
  punchOutMissing?: boolean;
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

// ---- Production: worker self-entry and supervisor approvals (existing /api/v1 routes; Decimals are strings) ----

export type AssignmentStatus = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "REASSIGNED" | "CANCELLED";

export interface JobOrderBrief {
  id: string;
  jobNumber: string;
  status: string;
  lotId: string;
  plannedQuantity: string;
  completedQuantity: string;
  productionStage: { id: string; name: string; allowsExtraQuantity?: boolean };
  lot: { id: string; lotNumber: string };
}

export interface MyAssignment {
  id: string;
  jobOrderId: string;
  status: AssignmentStatus;
  assignedQuantity: string;
  assignedAt: string;
  jobOrder: JobOrderBrief;
}

export type ApprovalStatus = "NOT_REQUIRED" | "PENDING" | "APPROVED" | "REJECTED";

export interface ProgressEntry {
  id: string;
  jobOrderId: string;
  jobOrderAssignmentId: string | null;
  completedQuantity: string;
  rejectedQuantity: string;
  damagedQuantity: string;
  extraQuantity: string;
  remarks: string | null;
  approvalStatus: ApprovalStatus;
  approvalRemark: string | null;
  createdAt: string;
  recordedByUserId: string;
  employee?: { id: string; fullName: string; employeeCode: string };
  jobOrder?: { id?: string; jobNumber: string; productionStage: { name: string }; lot?: { lotNumber: string } };
}

export interface JobOrderDetail extends JobOrderBrief {
  rejectedQuantity: string;
  damagedQuantity: string;
  extraQuantity: string;
  assignments: { id: string; status: AssignmentStatus; assignedQuantity: string }[];
  progressEntries: ProgressEntry[];
}

export interface LotDetail {
  id: string;
  lotNumber: string;
  quantity: string;
  status: string;
  currentStage: { id: string; name: string } | null;
  productionOrder: { id: string; orderNumber: string; product: { styleName: string } | null } | null;
  variantBreakdown: { id: string; quantity: string; productVariant: { skuCode: string; color: { name: string } | null; size: { name: string } | null } }[];
  jobOrders: {
    id: string;
    jobNumber: string;
    status: string;
    productionStage: { name: string };
    assignments: { id: string; assignedQuantity: string; loggedQuantity: number; remainingQuantity: number }[];
  }[];
}

export interface PieceRateEarning {
  id: string;
  status: string;
  payableQuantity: string;
  rateApplied: string;
  amount: string;
  createdAt: string;
  productionOperation: { name: string } | null;
  jobOrder: { jobNumber: string; productionStage: { name: string } | null; lot: { lotNumber: string } | null } | null;
}

export interface ProductionOrderRow {
  id: string;
  orderNumber: string;
  status: string;
  plannedQuantity: string;
  producedQuantity: number;
  product: { styleName: string; styleCode: string } | null;
}

export interface ProductionOrderDetail extends ProductionOrderRow {
  progress: {
    plannedQuantity: number;
    producedQuantity: number;
    rejectedQuantity: number;
    balanceQuantity: number;
    progressPercent: number;
    lots: { lotId: string; lotNumber: string; plannedQuantity: number; producedQuantity: number; rejectedQuantity: number; status: string }[];
  };
}

export interface ProgressQuantities {
  completedQuantity: number;
  rejectedQuantity: number;
  damagedQuantity: number;
  extraQuantity: number;
}

// ---- Team attendance (existing /api/v1/attendance/team-day, team-month; no pay fields) ----

export type TeamDayStatus = "PRESENT" | "OUTSIDE" | "HALF_DAY" | "ON_LEAVE" | "ABSENT" | "NOT_PUNCHED" | "WEEKLY_OFF" | "HOLIDAY" | "NOT_JOINED";

export interface TeamMember {
  id: string;
  employeeCode: string;
  fullName: string;
  shift: { name: string; startTime: string; endTime: string } | null;
}

export interface TeamDay {
  dateKey: string;
  isToday: boolean;
  cards: { total: number; present: number; outside: number; halfDay: number; onLeave: number; absent: number; notPunched: number; off: number; late: number };
  rows: { employee: TeamMember; status: TeamDayStatus; day: { firstIn: string | null; lastOut: string | null; workedHours: number; isLate: boolean; hasOpenSession: boolean; leaveLabel: string | null } }[];
}

export interface TeamMonth {
  year: number;
  month: number;
  employees: {
    employee: TeamMember;
    days: { dateKey: string; code: string; workedHours: number; isOutside: boolean; isLate: boolean; firstIn: string | null; lastOut: string | null; leaveLabel: string | null; remark: string | null }[];
    summary: AttendanceMonth["summary"];
  }[];
}

// ---- Team approvals (D-D06; existing routes — each checks team scope and blocks self-approval) ----

export interface TeamPerson {
  id: string;
  employeeCode: string;
  fullName: string;
}

export type TeamLeaveRequest = LeaveRequest & { employee: TeamPerson };
export type TeamCorrection = CorrectionRequest & { employee: TeamPerson };

export interface OvertimeRow {
  id: string;
  attendanceDate: string;
  hours: number;
  workedHours: number;
  shiftHours: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason: string | null;
  employee: TeamPerson;
  /** null without salary access. */
  amount: number | null;
}

export interface OutsideSession {
  id: string;
  checkInAt: string;
  checkOutAt: string | null;
  inDistanceMeters: number | null;
  outDistanceMeters: number | null;
  employee: TeamPerson;
  inLocation: { name: string } | null;
  outLocation: { name: string } | null;
  attendanceRecord: { attendanceDate: string } | null;
}

export type TeamOutdoorRejection = OutdoorRejection & { employee: TeamPerson };

// ---- Approvals inbox (Phase 5): payment requests, purchase orders, material requests ----

export interface PaymentRequestForReview extends PaymentRequest {
  requestGroup: string;
  createdByUserId: string;
  currentApprovalLevel: number | null;
  requiredApprovalLevels: number | null;
  createdBy: { id: string; fullName: string } | null;
  supplier: { name: string } | null;
  employee: { fullName: string; employeeCode: string } | null;
  approvals?: { level: number; decision: string; remark: string | null; decidedAt: string; user: { fullName: string } }[];
}

export interface PurchaseOrderRow {
  id: string;
  orderNumber: string;
  orderDate: string;
  expectedDeliveryDate: string | null;
  status: string;
  totalAmount: string;
  currencyCode: string;
  supplier: { id: string; name: string } | null;
  requestedBy: { id: string; fullName: string } | null;
  requestedByUserId: string;
}

export interface PurchaseOrderDetail extends PurchaseOrderRow {
  supplier: { id: string; name: string; code: string | null; phone: string | null; paymentTermsDays: number | null } | null;
  items: {
    id: string;
    orderedQuantity: string;
    unitPrice: string;
    notes: string | null;
    product: { styleName: string; styleCode: string | null } | null;
    uom: { code: string } | null;
    color: { name: string } | null;
    materialRequestItem: { materialRequest: { requestNumber: string } } | null;
  }[];
}

export interface MaterialRequestRow {
  id: string;
  requestNumber: string;
  requestType: string;
  status: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
  requiredDate: string | null;
  purpose: string | null;
  remarks: string | null;
  createdAt: string;
  requestedByUserId: string;
  requestedBy: { id: string; fullName: string } | null;
  warehouse: { name: string } | null;
  department: { name: string } | null;
}

export interface MaterialRequestDetail extends MaterialRequestRow {
  originalMaterialRequest: { id: string; requestNumber: string } | null;
  lines: {
    id: string;
    requestedQuantity: string;
    damageReason: string | null;
    remarks: string | null;
    availableStockQuantity?: number;
    material: { styleName: string; styleCode: string | null } | null;
    uom: { code: string } | null;
    color: { name: string } | null;
  }[];
}

// ---- Reports (existing /api/v1/reports/{category}/{key}; catalog /api/mobile/v1/reports) ----

export interface ReportColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  type?: "text" | "number" | "currency" | "date" | "percent";
}

export interface ReportDescriptor {
  title: string;
  subtitle?: string;
  filtersApplied: { label: string; value: string }[];
  columns: ReportColumn[];
  rows: Record<string, unknown>[];
  totals?: Record<string, unknown>;
  generatedAt: string;
  unavailableReason?: string;
}

export interface ReportCategoryGroup {
  category: string;
  label: string;
  description: string;
  canExport: boolean;
  reports: { key: string; title: string }[];
}

// ---- Inventory (existing routes; service routes send numbers, raw Prisma rows send strings) ----

export interface RawStockRow {
  id: string;
  productId: string;
  materialName: string;
  materialCode: string | null;
  materialCategory: string | null;
  unit: string | null;
  totalStock: number;
  availableStock: number;
  rollCount: number;
  colourCount: number;
  breakdownMode: "ROLL" | "COLOUR" | "PLAIN";
  lastUpdated: string | null;
}

export interface RawStockDetail {
  materialId: string;
  materialName: string;
  materialCode: string | null;
  unit: string | null;
  breakdownMode: "ROLL" | "COLOUR" | "PLAIN";
  totalStock: number;
  availableStock: number;
  rollCount: number;
  colourBalances: { colorId: string | null; colorName: string | null; quantity: number; warehouses: { warehouseName: string; quantity: number }[] }[];
  colours: { colorId: string | null; colorName: string | null; rollCount: number; availableQuantity: number; rolls: { id: string; rollNumber: string; lotNumber: string | null; shadeCode: string | null; warehouseName: string | null; locationLabel: string | null; remainingQuantity: number }[] }[];
  warehouses: { warehouseId: string; warehouseName: string; quantity: number; locations: { label: string; quantity: number }[]; unassignedQuantity: number }[];
}

export interface FgStyleRow {
  id: string;
  productId: string;
  styleName: string;
  styleCode: string | null;
  categoryName: string | null;
  saleableStock: number;
  rejectedStock: number;
  totalStock: number;
  colourCount: number;
  sizeCount: number;
  warehouseCount: number;
}

export interface FgStyleDetail {
  saleableStock: number;
  rejectedStock: number;
  colours: { colorId: string | null; colorName: string | null; saleableQuantity: number; rejectedQuantity: number; sizes: { sizeId: string | null; sizeName: string | null; saleableQuantity: number; rejectedQuantity: number; places: { label: string; quantity: number }[] }[] }[];
  warehouses: { warehouseId: string; warehouseName: string; saleableQuantity: number; rejectedQuantity: number; locations: { label: string; quantity: number }[] }[];
}

export interface StockMovementRow {
  id: string;
  movementNumber: string;
  movementType: "TRANSFER" | "ADJUSTMENT" | "RETURN_TO_SUPPLIER";
  status: "POSTED" | "IN_TRANSIT" | "RECEIVED";
  movementDate?: string;
  createdAt: string;
  notes?: string | null;
  warehouse: { id: string; name: string } | null;
  toWarehouse: { id: string; name: string } | null;
  performedBy: { fullName: string } | null;
  _count?: { items: number };
}

export interface StockMovementDetail extends StockMovementRow {
  toWarehouseId: string | null;
  receivedBy: { fullName: string } | null;
  items: { id: string; quantity: string; product: { styleName: string; styleCode: string | null } | null; uom: { code: string } | null; color: { name: string } | null; warehouseLocation: { code: string } | null; toWarehouseLocation: { code: string } | null }[];
}

export interface WarehouseOption {
  id: string;
  name: string;
  code: string | null;
  isActive: boolean;
}

export interface WarehouseLocation {
  id: string;
  code: string;
  isActive: boolean;
}

export interface ResolvedBarcode {
  entityType: "FABRIC_ROLL" | "PRODUCTION_LOT" | "CARTON" | "ITEM" | "SKU" | "PRODUCT_UNIT" | string;
  entityId: string;
  code: string;
  summary: Record<string, unknown> & { kind: string };
}
