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
