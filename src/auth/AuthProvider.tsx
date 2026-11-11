import * as Device from "expo-device";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AppState } from "react-native";
import { getNativeDeviceSignals } from "../../modules/device-signals";
import { ApiError } from "../api/errors";
import type { AppConfig, MeResponse } from "../api/types";
import { env } from "../config/env";
import { strings } from "../config/strings";
import { endpoints, getSession, onSessionEnded } from "../core/services";
import { checkDeviceSecurity, deviceGuardEnabled, freshFixProbe, onMockedFix, securityDeviceDetails, type SecurityCheck } from "../device/deviceSecurity";
import { getInstallationId } from "../device/installationId";
import { secureKV } from "../device/secureKV";
import { logger } from "../lib/logger";
import { updateState, type UpdateState } from "../lib/version";

export type AuthStatus =
  | "booting"
  | "updateRequired"
  | "signedOut"
  | "mustChangePassword"
  | "signedIn"
  | "suspended"
  | "offline"
  /** D-043: Developer options / mock location — only the warning shows, then sign-out. */
  | "securityBlocked";

interface AuthState {
  status: AuthStatus;
  me: MeResponse | null;
  appConfig: AppConfig | null;
  update: UpdateState;
  /** Why the user landed on Login (session expired, revoked, …). */
  notice: string | null;
  error: ApiError | null;
  /** Why the phone was blocked (status "securityBlocked"). */
  security: SecurityCheck | null;
}

interface AuthApi extends AuthState {
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  signOutEverywhere(): Promise<void>;
  reload(): Promise<void>;
  /** After a successful change-password the old session is refused, so sign in again with the new password. */
  afterPasswordChange(email: string, newPassword: string): Promise<void>;
  /** End of the 10-second security warning: sign out on this phone. */
  finishSecurityLock(): Promise<void>;
}

const Ctx = createContext<AuthApi | null>(null);

function noticeFor(err: ApiError | null): string | null {
  if (!err) return null;
  if (err.code === "AUTH_SESSION_REVOKED") return strings.session.revoked;
  if (err.code === "DEVICE_NOT_ALLOWED") return err.message;
  return strings.session.expired;
}

async function deviceInfo() {
  return {
    installationId: await getInstallationId(secureKV),
    platform: env.platform,
    model: [Device.manufacturer, Device.modelName].filter(Boolean).join(" ").slice(0, 120) || undefined,
    osVersion: Device.osVersion?.slice(0, 40) ?? undefined,
    appVersion: env.appVersion,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "booting", me: null, appConfig: null, update: "current", notice: null, error: null, security: null });
  const booted = useRef(false);
  const statusRef = useRef<AuthStatus>("booting");
  useEffect(() => {
    statusRef.current = state.status;
  }, [state.status]);

  /** Shows only the warning at once, then saves who / which phone on the server (which also revokes the session). */
  const blockForSecurity = useCallback(async (check: SecurityCheck) => {
    if (statusRef.current === "securityBlocked") return;
    statusRef.current = "securityBlocked";
    setState((s) => ({ ...s, status: "securityBlocked", security: check }));
    try {
      await endpoints.reportSecurityViolation({
        reasons: check.reasons,
        device: { installationId: await getInstallationId(secureKV), ...securityDeviceDetails() },
        signals: check.signals,
        location: check.location,
      });
    } catch (err) {
      logger.warn("security violation report failed", { code: err instanceof ApiError ? err.code : "unknown" });
    }
  }, []);

  /** After /me: a fast check before anything shows, then a fresh GPS fix in the background (fake GPS). */
  const guardDevice = useCallback(async (): Promise<boolean> => {
    if (!deviceGuardEnabled()) return false;
    const check = await checkDeviceSecurity();
    if (check.reasons.length > 0) {
      void blockForSecurity(check);
      return true;
    }
    void checkDeviceSecurity(getNativeDeviceSignals, freshFixProbe).then((c) => {
      if (c.reasons.length > 0 && (statusRef.current === "signedIn" || statusRef.current === "mustChangePassword")) void blockForSecurity(c);
    });
    return false;
  }, [blockForSecurity]);

  const loadMe = useCallback(async () => {
    try {
      const me = await endpoints.me();
      if (await guardDevice()) return setState((s) => ({ ...s, me, error: null, notice: null }));
      setState((s) => ({ ...s, me, error: null, notice: null, status: me.mustChangePassword ? "mustChangePassword" : "signedIn" }));
    } catch (err) {
      const e = err instanceof ApiError ? err : new ApiError(0, "SERVER_ERROR", strings.errors.generic);
      if (e.code === "PASSWORD_CHANGE_REQUIRED") return setState((s) => ({ ...s, status: "mustChangePassword", error: null }));
      if (e.code === "ACCOUNT_SUSPENDED") return setState((s) => ({ ...s, status: "suspended", error: e }));
      if (e.code === "APP_VERSION_UNSUPPORTED") return setState((s) => ({ ...s, status: "updateRequired", update: "required" }));
      if (e.code === "NETWORK_ERROR" || e.code === "TIMEOUT" || e.status >= 500) return setState((s) => ({ ...s, status: "offline", error: e }));
      // 401s already ended the session through onSessionEnded; anything else → Login with the message.
      await getSession().end(null);
      setState((s) => ({ ...s, status: "signedOut", me: null, error: e, notice: e.message }));
    }
  }, [guardDevice]);

  const boot = useCallback(async () => {
    let appConfig: AppConfig | null = null;
    try {
      appConfig = await endpoints.appConfig();
    } catch (err) {
      logger.warn("app-config failed", { code: err instanceof ApiError ? err.code : "unknown" });
    }
    const update = appConfig ? updateState(env.appVersion, appConfig) : "current";
    if (update === "required") return setState((s) => ({ ...s, appConfig, update, status: "updateRequired" }));
    setState((s) => ({ ...s, appConfig, update }));
    if (!(await getSession().hasSession())) return setState((s) => ({ ...s, status: "signedOut" }));
    await loadMe();
  }, [loadMe]);

  useEffect(() => {
    // While the security warning is up it stays up for its 10 s, even if the server already ended the session.
    const off = onSessionEnded((reason) =>
      setState((s) => (s.status === "securityBlocked" ? s : { ...s, status: "signedOut", me: null, notice: noticeFor(reason), error: reason }))
    );
    if (!booted.current) {
      booted.current = true;
      void boot();
    }
    return off;
  }, [boot]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await endpoints.login(email.trim(), password, await deviceInfo());
      await getSession().start(res);
      await loadMe();
    },
    [loadMe]
  );

  const signOut = useCallback(async () => {
    try {
      await endpoints.logout();
    } catch (err) {
      logger.warn("logout call failed; signing out locally", { code: err instanceof ApiError ? err.code : "unknown" });
    }
    await getSession().end(null);
  }, []);

  const signOutEverywhere = useCallback(async () => {
    await endpoints.logoutAll();
    await getSession().end(null);
  }, []);

  const afterPasswordChange = useCallback(
    async (email: string, newPassword: string) => {
      await getSession().end(null);
      await signIn(email, newPassword);
    },
    [signIn]
  );

  // Re-check when the app comes back to the screen (Developer options turned on later),
  // and lock as soon as any GPS fix the app reads is mocked.
  useEffect(() => {
    if (!deviceGuardEnabled()) return;
    const signedIn = () => statusRef.current === "signedIn" || statusRef.current === "mustChangePassword";
    const sub = AppState.addEventListener("change", (next) => {
      if (next !== "active" || !signedIn()) return;
      void checkDeviceSecurity().then((c) => {
        if (c.reasons.length > 0 && signedIn()) void blockForSecurity(c);
      });
    });
    const offMock = onMockedFix((location) => {
      if (!signedIn()) return;
      const n = getNativeDeviceSignals();
      const signals = { developerOptions: n?.developerOptions ?? null, adbEnabled: n?.adbEnabled ?? null, adbWifiEnabled: n?.adbWifiEnabled ?? null, mocked: true };
      void blockForSecurity({ reasons: ["MOCK_LOCATION"], signals, location });
    });
    return () => {
      sub.remove();
      offMock();
    };
  }, [blockForSecurity]);

  const finishSecurityLock = useCallback(async () => {
    try {
      await endpoints.logout();
    } catch {
      // The server usually revoked the session already when it saved the violation.
    }
    await getSession().end(null);
    statusRef.current = "signedOut";
    setState((s) => ({ ...s, status: "signedOut", me: null, security: null, error: null, notice: strings.security.loginNotice }));
  }, []);

  const value = useMemo<AuthApi>(
    () => ({ ...state, signIn, signOut, signOutEverywhere, reload: boot, afterPasswordChange, finishSecurityLock }),
    [state, signIn, signOut, signOutEverywhere, boot, afterPasswordChange, finishSecurityLock]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
