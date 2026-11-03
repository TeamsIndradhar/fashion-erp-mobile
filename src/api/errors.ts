import type { ApiErrorBody } from "./types";
import { strings } from "../config/strings";

/** Error codes the app reacts to (docs/05 §1). Unknown server codes stay as plain strings. */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_LOGIN"
  | "AUTH_TOKEN_EXPIRED"
  | "AUTH_TOKEN_INVALID"
  | "AUTH_SESSION_REVOKED"
  | "PERMISSION_DENIED"
  | "PASSWORD_CHANGE_REQUIRED"
  | "ACCOUNT_SUSPENDED"
  | "MODULE_NOT_ENABLED"
  | "SUBSCRIPTION_READ_ONLY"
  | "DEVICE_NOT_ALLOWED"
  | "NOT_FOUND"
  | "INVALID_STATE_TRANSITION"
  | "CHALLENGE_INVALID"
  | "PAYLOAD_TOO_LARGE"
  | "ATTENDANCE_BLOCKED_BY_RISK"
  | "APP_VERSION_UNSUPPORTED"
  | "RATE_LIMITED"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "SERVER_ERROR";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode | (string & {}),
    message: string,
    readonly fieldErrors: Record<string, string[]> = {},
    readonly details: Record<string, unknown> | null = null
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** Errors after which the stored session is useless → go to Login. */
  get endsSession(): boolean {
    return this.code === "AUTH_TOKEN_INVALID" || this.code === "AUTH_SESSION_REVOKED" || this.code === "DEVICE_NOT_ALLOWED";
  }
}

const FALLBACK_CODE_BY_STATUS: Record<number, ApiErrorCode> = {
  400: "VALIDATION_ERROR",
  403: "PERMISSION_DENIED",
  404: "NOT_FOUND",
  409: "INVALID_STATE_TRANSITION",
  413: "PAYLOAD_TOO_LARGE",
  426: "APP_VERSION_UNSUPPORTED",
  429: "RATE_LIMITED",
};

/** Maps the ERP error envelope (`toErrorResponse()`) to an ApiError. */
export function toApiError(status: number, body: ApiErrorBody | null): ApiError {
  const code = body?.error?.code ?? FALLBACK_CODE_BY_STATUS[status] ?? (status >= 500 ? "SERVER_ERROR" : "SERVER_ERROR");
  const message = body?.error?.message ?? body?.message ?? (status >= 500 ? strings.errors.server : strings.errors.generic);
  return new ApiError(status, code, message, body?.errors ?? {}, body?.error?.details ?? null);
}
