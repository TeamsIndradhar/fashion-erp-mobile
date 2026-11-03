# 05 — Mobile API Contract (v1, PROPOSED)

Two groups of endpoints:

- **A. Existing `/api/v1/*` routes reused through the mobile bearer adapter** — no route code changes; shapes below are what the existing services return today.
- **B. New thin routes under `/api/mobile/v1/*`** — only where nothing suitable exists (classification in `01_EXISTING_ERP_AUDIT.md` §6). Each calls existing services.

Nothing here is built. Status of the architecture choice: D-003 (PROPOSED).

## 1. Conventions

| Item | Rule |
|---|---|
| Transport | HTTPS in production. JSON, except punch (`multipart/form-data`) and image downloads. |
| Auth | `Authorization: Bearer <accessToken>` on everything except `GET /api/v1/health`, `GET /api/mobile/v1/app-config`, `POST /api/mobile/v1/auth/login`, `POST /api/mobile/v1/auth/refresh`. |
| Bearer allowlist | A mobile token is accepted **only** on the routes listed in this document. Any other `/api/*` route called with a bearer token returns `403 PERMISSION_DENIED` (enforced in the adapter/proxy, B-04). Web cookie requests are unaffected. |
| Client headers | `X-App-Version` (semver), `X-App-Platform` (`android` / `ios`), `X-Request-Id` (uuid). |
| Success | `{ "data": … }` |
| Error | existing envelope from `toErrorResponse()`: `{ "success": false, "message": "…", "errors"?: { "field": ["…"] }, "error": { "code": "…", "message": "…", "details": {…} \| null } }` |
| Time | ISO-8601 UTC. `YYYY-MM-DD` date keys and `YYYY-MM` months are **IST** calendar values (`istDateKey()`), same as the web. |

### Error codes the app handles

| HTTP | Code | Exists today? | App behaviour |
|---|---|---|---|
| 400 | `VALIDATION_ERROR` | yes | show server `message` / field `errors` |
| 401 | `INVALID_LOGIN` | **new** | login error text (no detail which check failed) |
| 401 | `AUTH_TOKEN_EXPIRED` | **new** | single-flight refresh, replay once |
| 401 | `AUTH_TOKEN_INVALID` | **new** | clear tokens → Login |
| 401 | `AUTH_SESSION_REVOKED` | **new** | clear tokens → Login ("signed out on this device") |
| 403 | `PERMISSION_DENIED` | yes | message; "password was changed" / "no longer active" → Login |
| 403 | `PASSWORD_CHANGE_REQUIRED` | yes | change-password screen |
| 403 | `ACCOUNT_SUSPENDED` | yes | blocking screen |
| 403 | `MODULE_NOT_ENABLED` | yes | "Attendance isn't enabled for your company" |
| 403 | `SUBSCRIPTION_READ_ONLY` | yes | punching disabled, history readable |
| 403 | `DEVICE_NOT_ALLOWED` | **new** | device revoked / not registered / pending HR approval |
| 404 | `NOT_FOUND` | yes | message |
| 409 | `INVALID_STATE_TRANSITION` | yes | message, refetch Today |
| 409 | `CHALLENGE_INVALID` | **new** | expired/used/foreign challenge → get a new one, restart punch |
| 413 | `PAYLOAD_TOO_LARGE` | yes | photo too large (should not happen after resize) |
| 422 | `ATTENDANCE_BLOCKED_BY_RISK` | **new** | HIGH_RISK + company policy BLOCK → Security Warning screen with the server's explanation |
| 426 | `APP_VERSION_UNSUPPORTED` | **new** | Update Required screen |
| 429 | `RATE_LIMITED` | yes | wait message |

The web keeps returning `403 PERMISSION_DENIED "Sign in required."` for missing cookies (D-019).

---

## 2. A — Existing routes reused through the bearer adapter

All exist today; methods and paths verified. Permissions and responses are unchanged.

### `GET /api/v1/health` (no auth) — REUSE AS IS
`{ "status": "ok", "database": "ok", "timestamp": "…" }` (503 when DB down).

### `POST /api/v1/account/change-password` — REUSE WITH ADAPTER
Allowed while `mustChangePassword`. Body `{ "currentPassword": "…", "newPassword": "…" }` (`changePasswordSchema`: new ≥ 8 chars). Response `{ "data": { "ok": true } }`. Errors (from `changeOwnPassword()`): wrong current password, temporary password reused, same as current → `400 VALIDATION_ERROR`.
**App rule:** on success, immediately call `POST /api/mobile/v1/auth/login` with the new password (the current mobile session is now older than `passwordChangedAt` and is refused by the live check). No server change needed.

### `GET /api/v1/attendance/me/today` — REUSE WITH ADAPTER (`hrms_attendance.view`)
Returns `getMyAttendanceToday()`:
```json
{ "data": {
  "employee": { "id": "…", "fullName": "…", "employeeCode": "E-0012",
                "shift": { "id": "…", "name": "General", "startTime": "09:30", "endTime": "18:30", "graceMinutes": 15 } },
  "dateKey": "2026-11-03",
  "isPunchedIn": true, "openSessionId": "…",
  "sessions": [ { "id": "…", "checkInAt": "…", "checkOutAt": null, "status": "PRESENT", "source": "SELF_PUNCH",
                  "isLoginFromOffice": true, "isLogoutFromOffice": true, "inLocationName": "Head Office", "outLocationName": null,
                  "inOffice": { "id": "…", "name": "Head Office", "latitude": 0, "longitude": 0, "radiusMeters": 100 }, "outOffice": null,
                  "inDistanceMeters": 23, "outDistanceMeters": null,
                  "inLatitude": 0, "inLongitude": 0, "outLatitude": null, "outLongitude": null,
                  "hasInSelfie": true, "hasOutSelfie": false } ],
  "remark": null, "finalizedHours": 0, "liveHours": 1.25,
  "facePhotoIds": ["…"], "hasLocations": true,
  "rules": { "requireFace": true, "faceMatchThreshold": 0.45, "faceMatchFrames": 3, "gpsAccuracyMeters": 50 }
} }
```
Error: `400 VALIDATION_ERROR` "Your login is not linked to an active employee record…".

### `GET /api/v1/attendance/me/month?month=YYYY-MM` — REUSE WITH ADAPTER (`hrms_attendance.view`)
`getMyMonthReport()` → `{ year, month, employee, summary, days[] }`; each day: `dateKey, weekday, code, isFuture, isHoliday, holidayName, isWeekend, isLate, isOutside, bandLabel, leaveLabel, firstIn, lastOut, hasOpenSession, workedHours, present, leave, absent, sessions[{ id, checkInAt, checkOutAt, hours }], remark`. `summary` = `computeEmployeesMonth()` summary (app renders known keys, ignores unknown).

### `GET /api/v1/attendance/me/day?date=YYYY-MM-DD` — REUSE WITH ADAPTER (`hrms_attendance.view`)
`getMyDay()` — sessions in the Today session shape + remark.

### `PUT /api/v1/attendance/me/remark` — REUSE WITH ADAPTER (`hrms_attendance.create`)
Body `{ "date": "2026-11-02", "remark": "Client visit" }` (`dayRemarkSchema`, max 500; empty clears). Returns `setMyDayRemark()` output. Editable-date rules are the service's.

### `GET /api/v1/attendance/sessions/{id}/selfie/{in|out}` — REUSE WITH ADAPTER
Image bytes, `Cache-Control: private, max-age=300`; scope via `assertHrmsEmployeeInScope()` (own sessions for self-service users).

### `GET /api/v1/attendance/face-photos/file/{photoId}` — REUSE WITH ADAPTER — needed: face match runs on the phone like the web (D-012)

---

## 3. B — New mobile routes (`/api/mobile/v1/*`)

### `GET /app-config` (no auth)
```json
{ "data": { "minAppVersion": "1.0.0", "latestAppVersion": "1.0.0", "serverTime": "…",
            "integrity": { "androidPlayIntegrity": true, "iosAppAttest": true },
            "privacyNoticeUrl": "…" } }
```

### `POST /auth/login` (no auth) — adapter over `authenticateTenantUser()`
```json
{ "email": "ravi@company.com", "password": "…",
  "device": { "installationId": "uuid generated by the app", "platform": "android", "model": "Redmi Note 12", "osVersion": "14", "appVersion": "1.0.0" } }
```
200:
```json
{ "data": { "accessToken": "fea_…", "accessTokenExpiresAt": "…", "refreshToken": "fer_…", "refreshTokenExpiresAt": "…",
            "mustChangePassword": false,
            "device": { "id": "…", "status": "ACTIVE", "needsAttestation": true },
            "user": { "id": "…", "fullName": "…", "email": "…" }, "company": { "id": "…", "name": "…" } } }
```
Errors: `400`, `401 INVALID_LOGIN` (also covers lockout, inactive user/company, support proxy — same text as web), `403 DEVICE_NOT_ALLOWED` (device revoked or over the device limit, per policy Q-16), `426`, `429`.

### `POST /auth/refresh` (no auth) — `{ "refreshToken": "fer_…" }` → new pair. Errors `401 AUTH_TOKEN_INVALID`, `401 AUTH_SESSION_REVOKED` (reuse detected), live-check 403s, `429`.

### `POST /auth/logout` — revoke this session → `{ "data": { "ok": true } }` (idempotent).
### `POST /auth/logout-all` — revoke all of the user's mobile sessions → `{ "data": { "revoked": 3 } }`.

### `GET /me` (allowed while `mustChangePassword`)
```json
{ "data": {
  "user": { "id": "…", "fullName": "…", "email": "…", "phone": "…" },
  "company": { "id": "…", "name": "…" },
  "employee": { "id": "…", "employeeCode": "E-0012", "fullName": "…", "branchName": "…", "departmentName": "…", "designationName": "…",
                "shift": { "name": "General", "startTime": "09:30", "endTime": "18:30", "graceMinutes": 15 } },
  "mustChangePassword": false,
  "permissions": { "attendance": { "view": true, "punch": true } },
  "modulesEnabled": { "hrms": true },
  "device": { "id": "…", "status": "ACTIVE", "integrityStatus": "VERIFIED" }
} }
```
`employee` is `null` when not linked. Source: `getLinkedEmployee()`, `PermissionService.can`, `EntitlementService`, device row.

### `GET /devices` / `DELETE /devices/{id}`
List the user's devices (model, platform, last seen, status, current) / revoke one (also revokes its sessions). Own devices only.

### `POST /devices/register` — integrity registration
Called once after login on a new install (and when the server says `needsAttestation`).
- **iOS**: `{ "challenge": "<from punch-challenge with purpose REGISTER>", "keyId": "…", "attestationObject": "<base64 App Attest attestation>" }`
- **Android**: `{ "challenge": "…", "integrityToken": "<Play Integrity token whose requestHash = SHA-256(challenge)>" }`
Response `{ "data": { "device": { "status": "ACTIVE", "integrityStatus": "VERIFIED" | "FAILED" | "UNAVAILABLE" } } }`. A failed verification does not by itself block login; it feeds the risk engine (`08` §6).

### `POST /attendance/punch-challenge` (`hrms_attendance.create`)
Body `{ "purpose": "PUNCH" | "REGISTER", "type": "IN" | "OUT" }` →
```json
{ "data": { "challenge": "base64url(signed payload)", "challengeId": "uuid", "expiresAt": "…(+120 s)" } }
```
Stateless HMAC-signed payload `{ challengeId, mobileSessionId, purpose, type, exp }` (D-026). Single use is enforced when it is consumed (unique `challengeId` in `hrms_attendance_punch_meta`).

### `GET /attendance/locations` (`hrms_attendance.view`)
`{ "data": [ { "id": "…", "name": "Head Office", "latitude": 28.61, "longitude": 77.2, "radiusMeters": 100 } ] }` — active only, projected from `listAttendanceLocations()`. Used for the client-side **estimate** only.

### `POST /attendance/punch` (`hrms_attendance.create`) — `multipart/form-data`

| Field | Required | Trust | Notes |
|---|---|---|---|
| `type` (`IN`/`OUT`) | yes | — | must match the challenge |
| `challenge` | yes | server-verified (HMAC, expiry, session, single use) | replay protection |
| `clientPunchId` (uuid) | yes | — | idempotency |
| `latitude`, `longitude`, `accuracy` | yes | client-reported | fed to `punch()` unchanged |
| `locationTimestamp` | yes | client-reported | stale-fix signal |
| `selfie` (JPEG) | yes | server checks type/size/magic bytes | |
| `facePhotoId` | when `requireFace` (matched on the phone like the web, D-012) | client-reported (SW-1, accepted) | |
| `integrityToken` (Android) / `assertion` (iOS) | yes when available | **server-verified** | bound to SHA-256(challenge + clientPunchId + type) |
| `signals` (JSON) | yes | **client-reported, untrusted** | `{ mocked, developerOptions, adbEnabled, adbWifiEnabled, emulatorHeuristic, rootHeuristic, jailbreakHeuristic, debuggerAttached, locationProvider }` — each `true/false/null` (null = unknown/unsupported) |
| `address` | no | client | empty in v1 |

200:
```json
{ "data": { "message": "Time IN marked successfully",
            "session": { "…": "toMySessionView() shape — no storage keys" },
            "fromOffice": true, "locationName": "Head Office", "distanceMeters": 23,
            "review": { "riskLevel": "NORMAL", "needsReview": false, "employeeMessage": null },
            "replayed": false } }
```
When SUSPICIOUS: `fromOffice` may be true but `session.status = "PRESENT_FROM_OUTSIDE"` and `review = { "riskLevel": "SUSPICIOUS", "needsReview": true, "employeeMessage": "Your punch was recorded and sent to your manager for review." }`. What reasons are shown to the employee is Q-20.

Errors: everything `punch()` throws today (low accuracy, no selfie, face, no offices, already in / no open session) with the **same messages**; plus `409 CHALLENGE_INVALID`, `403 DEVICE_NOT_ALLOWED`, `422 ATTENDANCE_BLOCKED_BY_RISK`.

Repeat with the same `clientPunchId` (same user) → stored result with `"replayed": true`, no second punch.

---

## 4. Endpoint ↔ service map

| Endpoint | Existing code reused | New code |
|---|---|---|
| `/api/v1/*` routes in §2 | everything (route + service) | bearer adapter only |
| `POST /auth/login` | `authenticateTenantUser()`, lockout | session/device create, audit |
| `POST /auth/refresh` | shared live checks | rotation, reuse detection |
| `GET /me` | `getLinkedEmployee()`, `PermissionService.can`, `EntitlementService` | projection |
| `POST /devices/register` | — | Play Integrity / App Attest verification |
| `POST /attendance/punch-challenge` | — | HMAC challenge |
| `GET /attendance/locations` | `listAttendanceLocations()` | projection |
| `POST /attendance/punch` | `punch()`, `toMySessionView()`, `evaluateGeofence()` (inside `punch()`) | idempotency, challenge, integrity verification, signals, risk engine, `options` param |

## 5. Versioning

Additive only inside v1; renames/removals need v2. The app ignores unknown fields. `MOBILE_MIN_APP_VERSION` forces updates ahead of breaking changes.
