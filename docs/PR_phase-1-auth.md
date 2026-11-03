**Title:** feat(mobile): Phase 1 — mobile app authentication (bearer adapter)

## What
Backend for the Fashion ERP mobile app's login (Phase 1 of the mobile roadmap). A thin adapter, not a second auth system:

- `requireSession()` also accepts `Authorization: Bearer fea_…` and runs the **same** live user checks as the web (extracted to `assertLiveTenantUser()`); the NextAuth cookie path is unchanged.
- Opaque access token (15 min) + rotating refresh token (30 d idle, 90 d max, 30 s grace; reuse after grace revokes the session). Only SHA-256 hashes are stored.
- New tables `mobile_devices`, `mobile_sessions` (migration `20261103180000_mobile_auth` + rollback SQL); max 2 active phones per user; one active session per device (partial unique index).
- `src/proxy.ts`: a mobile token may only call the app's routes (allowlist in `src/core/auth/mobile-route-allowlist.ts`).
- Routes `/api/mobile/v1`: `app-config`, `auth/login`, `auth/refresh`, `auth/logout`, `auth/logout-all`, `me`, `devices`, `devices/[id]`. `X-App-Version` below the minimum → 426.
- New error codes: `INVALID_LOGIN`, `AUTH_TOKEN_EXPIRED`, `AUTH_TOKEN_INVALID`, `AUTH_SESSION_REVOKED`, `DEVICE_NOT_ALLOWED`, `APP_VERSION_UNSUPPORTED`.
- Admin password reset / user suspension also revoke the user's mobile sessions.
- `AGENTS.md` / `GEMINI.md`: pointer to the mobile repo's approval-gated workflow.

## Why
User-approved mobile app plan (decisions D-003, D-004, D-005, D-006, D-024 in `fashion-erp-mobile/docs/12_DECISION_LOG.md`). Release 1 = login + attendance.

## Verification
- Tests for auth + admin areas: 167/167. Full suite: 3904 passed, 1 failed — `src/components/crm/dashboard/dashboard-components.test.tsx` (passes alone 8/8; timing flake under load, unrelated).
- `tsc --noEmit` clean; ESLint clean on changed files.
- Live dev server, 15/15: login ok / wrong password, `/me`, existing `/api/v1/attendance/me/today` with a bearer token, non-allowlisted API → 403, old app version → 426, garbage token → 401, refresh rotation (old access → 401), devices, logout (access + refresh → 401), web without cookie unchanged ("Sign in required."). Web `/attendance/my` checked in the browser.

## Reviewer notes
- Migration applied to the dev DB only; production needs it via the normal deploy procedure (`docs/DEPLOYMENT_MIGRATIONS.md`).
- New env vars (all optional, defaults shown in `docs/history/mobile.md`): `MOBILE_ACCESS_TOKEN_TTL_SECONDS`, `MOBILE_REFRESH_IDLE_DAYS`, `MOBILE_REFRESH_ABSOLUTE_DAYS`, `MOBILE_REFRESH_GRACE_SECONDS`, `MOBILE_MAX_DEVICES_PER_USER`, `MOBILE_MIN_APP_VERSION`, `MOBILE_LATEST_APP_VERSION`.
- nginx in front of production must pass the `Authorization` header and `X-Forwarded-For` (per-IP login limit).
- A revoked phone can come back with a fresh password sign-in if under the 2-phone limit (deliberate).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
