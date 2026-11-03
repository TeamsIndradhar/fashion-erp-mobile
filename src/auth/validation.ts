import { strings } from "../config/strings";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(email: string, password: string): { email?: string; password?: string } {
  const errors: { email?: string; password?: string } = {};
  const e = email.trim();
  if (!e) errors.email = strings.login.emailRequired;
  else if (!EMAIL.test(e)) errors.email = strings.login.emailInvalid;
  if (!password) errors.password = strings.login.passwordRequired;
  return errors;
}

/** Mirrors fashion-erp changePasswordSchema (new ≥ 8) plus the screen's confirm/different rules (AUTH-006). */
export function validatePasswordChange(current: string, next: string, confirm: string): { current?: string; next?: string; confirm?: string } {
  const errors: { current?: string; next?: string; confirm?: string } = {};
  if (!current) errors.current = strings.changePassword.required;
  if (next.length < 8) errors.next = strings.changePassword.tooShort;
  else if (next === current) errors.next = strings.changePassword.sameAsCurrent;
  if (confirm !== next) errors.confirm = strings.changePassword.mismatch;
  return errors;
}
