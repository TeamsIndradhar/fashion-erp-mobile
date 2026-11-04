# 14 — Mobile Project Status

**Overall:** On `fashion-erp` `main`: Phase 1 mobile auth (`b804bbcf`), mobile punch backend (`18dc32fe`) and **Phase 1b server face check (`2becc954`)**. On this repo: Phase 2 foundation and Phase 3 login/session, profile, devices, attendance screens and the **punch flow** — now usable also where the company requires a face check (the server compares the selfie; no match → punch recorded and sent to review). **Face-match accuracy on real faces is not tested yet** (needs volunteer photos; web punches stay in "monitor" mode until then). App not yet run on a real phone or emulator. D-039: no phase gates, agents push to `main`.

Last updated: 2026-11-03, repo `fashion-erp-mobile` (GitHub `TeamsIndradhar/fashion-erp-mobile`, branch `main`).

## Phase tracker (revision 3 — see `11` table)

| Phase | Name | Status | Gate |
|---|---|---|---|
| 0 | Design & feasibility | 🔄 119 screens designed, release-1 screens (38) approved; Spike A partly done; Spike B desk research done; Spike C protocol ready, visit not done | waiting for user inputs (photos, accounts/phones, factory visit) |
| 1 | Backend authentication (in `fashion-erp`) | ✅ Done — merged to `fashion-erp` `main` (`b804bbcf`); migration `20261103180000_mobile_auth` applied to the **dev DB only** | — (D-039) |
| 1b | Server-side face verification (in `fashion-erp`) | ✅ Built — `2becc954`: face-api + TF.js wasm on the server, descriptor cache table, mobile = enforce (no match → review), web = monitor until the accuracy test (`ATTENDANCE_SERVER_FACE_CHECK`). **Accuracy test still open** | user input (volunteer photos) to switch web to enforce |
| 2 | Mobile foundation | ✅ Done — Expo SDK 58 app, expo-router, theme tokens, shared components, API client, SecureStore token store, single-flight refresh, app-config + Update Required, offline banner, Jest/ESLint/TS | — (D-039) |
| 3 | Common employee features | ✅ All release-1 employee screens built: login, password change, profile, devices, sign out, attendance today/month/day + remark, punch flow with server face check, alerts (EMP-020/021), settings (EMP-024), help & support with tickets (EMP-026), about (EMP-027). Not built: device integrity registration (AUTH-009, needs accounts), optional update sheet (AUTH-012, needs Play build), Hindi strings (Q-11). **Release-2 employee requests built**: My requests hub, leave (EMP-028), correction (EMP-029), outside-punch review (EMP-031), salary slips (EMP-030), salary advance (EMP-019), expense requests list/new/detail (EMP-015…018). Voice notes (CR-001) not built | — |
| 4 | Worker & supervisor | 🔄 Built: worker home entry, my work (WRK-002), job order + enter work + hand back (WRK-003…005, 007), my entries (WRK-006), lot (WRK-008), earnings (WRK-009), self-entry off (WRK-010); supervisor approvals approve/reject/correct (SUP-004/005), team work status (SUP-006). Team attendance today + member month (SUP-002/003) and team approvals (leave, corrections, outside punches + explanations, overtime) built too. Not built: team reports (SUP-007). Designs were READY_FOR_REVIEW, built under D-039 | — |
| 5 | Other authorized modules | 🔄 Approvals inbox built: payment requests approve/reject (ACC-002), purchase order approve (PUR-002/003), damage material request approve/reject (INV-004). HR screens (HR-002…006) covered by team attendance + team approvals. Not built: production manager, inventory, purchase detail lists, sales, accounts payout, dispatch screens | — |
| 6 | Admin & owner dashboards | 🔄 Business dashboard (OWN-001 / ADM-001: Executive Dashboard sections the server allows + "waiting for you" counts = ADM-002), Reports center (ADM-005) and report viewer with date range + Excel/PDF export (ADM-006). Not built: owner analytics pages OWN-002…006 (the viewer opens the same reports), alerts center OWN-007, users & roles ADM-004, employee summary ADM-003 | — |
| 7 | Security & testing | ⬜ | — |
| 8 | Builds & release | 🔄 First internal Android preview APK built on EAS (`vrikshansh-tech-solutions`) | — |

Legend: ⬜ not started · 🔄 in progress · ✅ done · ⏳ waiting for user · ❌ blocked

## Waiting on the user

17 topics were answered on 2026-11-03 (see the "User approvals" table at the top of `12_DECISION_LOG.md`). Still needed:

1. ✅ Release-1 screen designs approved (38 screens). Phases now run without gates (D-039).
1a. **Server deploy:** run migrations `20261103180000_mobile_auth`, `20261104090000_mobile_punch_meta` and `20261104120000_face_descriptors` on the production/staging DB when `fashion-erp` `main` is deployed (only applied to the dev DB so far); set `MOBILE_CHALLENGE_SECRET`; `npm ci` (new deps `@tensorflow/tfjs`, `@tensorflow/tfjs-backend-wasm`); expect ~200 MB more RAM per server process once the first face check runs. Then run `node --experimental-strip-types --no-warnings scripts/grant-own-expense-requests.mjs --apply` (B-23) and the same with `--set supervisor-team-approver --apply` (D-D06), then restart the app.
2. **Inputs for Phase 0 spikes:** 3–5 volunteers' photos (face accuracy test, D-037); developer accounts + test phones (Spike B); factory visit with the filled GPS sheet (Spike C).
3. Remaining questions: Q-07 phone fleet / minimum OS, Q-12 crash reporting, Q-13 weak-GPS fallback (after Spike C), Q-15 selfie retention & privacy notice owner, Q-19 employee ↔ office assignment, Q-20 what flagged employees see, Q-21 fixed temporary password (web ERP), store app name.

## Backend work identified

✅ Done: B-01…B-05 (auth + punch-challenge, locations, punch routes), B-06 `hrms_attendance_punch_meta`, B-07 HMAC challenge, B-09 stub (records signals, always NORMAL), B-10 (auth codes + CHALLENGE_INVALID), B-11, B-12, B-13, B-15 (auth env vars; `MOBILE_CHALLENGE_SECRET` falls back to NEXTAUTH_SECRET — set its own in production), B-19, B-24. B-18 server face check (phase 1b). Next: B-08 (integrity, needs accounts), B-09 real rules, B-17, B-14.

B-01 `mobile_sessions` · B-02 `mobile_devices` · B-03 mobile-auth module · B-04 bearer adapter + shared live checks + allowlist · B-05 new mobile routes · B-06 `hrms_attendance_punch_meta` · B-07 HMAC challenge · B-08 integrity verifiers · B-09 risk engine + policy columns · B-10 error codes · B-11 per-IP limit · B-12 audit · B-13 revoke on reset/suspend · B-14 cleanup job · B-15 env vars · ~~B-16~~ (dropped) · B-17 reviewer reasons in Outdoor screen · **B-18 server-side face verification (approved, D-037)** · B-19 `punch()` options param · B-20 device admin (optional) · ~~B-21~~ (not needed) · ~~B-22~~ (dropped) · **B-23 role permission changes (approved)** · **B-24 AGENTS.md pointer (approved)**. Details: `06`.

## Security weaknesses found in the existing ERP

SW-1 face match client-trusted · SW-2 client-reported GPS/accuracy · SW-3 in-memory lockout · SW-4 storage keys in punch response · SW-5 no punch idempotency · SW-6 fixed temporary password. Details: `01` §9.

## Risks

| Risk | Mitigation |
|---|---|
| Indoor GPS (200–225 m floor variation) blocks genuine employees | Spike C before any threshold decision; fallback options `04` §6 |
| `requireFace=true` blocks mobile punching until Q-01 is decided | decide in Phase 0 |
| False positives from weak signals | corroboration rules, monitor mode, overrides |
| Adapter change in `requireSession()`/proxy affects every route | extraction-only refactor, unchanged tests, browser regression |
| Native integrity modules (Expo) maintenance | Spike B chooses wrapper vs own module |
| Play Integrity quota / App Attest rate limits | quota request; staged rollout |
| Two repositories drifting (API contract vs app types) | contract fixtures exported from `fashion-erp` tests and copied into this repo each backend phase (D-013) |

## Follow-ups (outside current scope)

- Q-21: random temporary passwords in the web ERP.
- Pointer lines in `fashion-erp/AGENTS.md`/`fashion-erp/GEMINI.md` (only if Q-17 approves).

## Handoff log (newest first)

### Handoff — 2026-11-04 — Antigravity — Android Preview APK build generated
**Commits:** `6d7e259` (EAS config, owner `vrikshansh-tech-solutions`, preview APK profile).
**Done:** Project linked to Expo account `@vrikshansh-tech-solutions/fashion-erp-mobile` (Project ID: `30cf7521-b26b-4025-a3fc-9b373ea4f838`). `eas.json` preview profile configured for standalone installable Android APK (`buildType: "apk"`), pointing to live backend `https://erp.indradhar.in`. Cloud build triggered and completed successfully on EAS.
**Build Download Link:** `https://expo.dev/accounts/vrikshansh-tech-solutions/projects/fashion-erp-mobile/builds/b97303d1-cec4-4150-b36d-461c34b19651`
**Verified:** Live backend `/api/mobile/v1/app-config` confirmed 200 OK. TypeScript check passed (`tsc --noEmit`). Test suite 20/20 passed (114 tests passed). Android standalone APK generated and downloadable directly to phones.
**Next step:** Install APK on test phone(s), verify live login, GPS permissions, selfie punch flow, and reports.

### Handoff — 2026-11-04 — Claude Code — Business dashboard and reports
**Commits:** `fashion-erp` `main` `4f73dbad` — **web-wide fix**: Executive Dashboard / Daily MIS sections need view on their own modules (finance needed accounts + financial_reports; before, anyone with reports.view saw AR / AP / expenses), in the view route and all exports; `GET /api/mobile/v1/reports` catalog; reports view/export allowlisted GET-only. App: `app/dashboard.tsx` (sections as metric tiles, waiting-approvals counts linking to the inboxes), `app/reports/index.tsx` (search, categories by permission), `app/reports/[category]/[key].tsx` (optional date range, overview reports as sections, other reports as cards with totals, first 200 rows, Excel/PDF export through the share sheet when allowed); Home "Business dashboard".
**Verified (executed):** ERP full suite 3981 passed / 0 failed (incl. new redaction tests), tsc, ESLint; app tsc, eslint, jest 57/57; live contract: catalog, executive dashboard, first catalog report, POST to a report refused; web Executive Dashboard shows all 7 sections for Super Admin.
**Not verified:** a limited role seeing a redacted dashboard live (no such dev login); export files opened on a phone.
**Report filters:** only date range is offered on the phone; reports with other filters use their defaults.

### Handoff — 2026-11-04 — Claude Code — Phase 5 first slice: approvals inbox
**Commits:** `fashion-erp` `main` `3c68a06e` — method-aware bearer allowlist (PO / MR list + detail are GET-only for phones); decide routes for payment requests, PO approve, MR approve/reject; **web-wide fixes**: no self-reject of payment requests, branch scope on PO approve and MR decisions; MR list `approvalStatus=PENDING`; `/me` approval flags. App: `app/approvals/index.tsx` — tabs by permission; payment requests (amount, payee, type, level "1 of 2", earlier decisions, bills/voice files, approve with remark / reject with reason), purchase orders (lines × price, approve with confirm; own order can't be approved; hold/cancel on web), material requests (damage reason, stock, approve/reject); Home "Approvals" and "Production approvals" renamed.
**Verified (executed):** ERP full suite 3977 passed / 0 failed, tsc, ESLint; app tsc, eslint, jest 54/54; live contract: inbox reads (no own payment requests in the inbox, MR list only PENDING), phone token gets 403 on PO create and MR edit.
**Not verified:** an approve/reject actually sent from the app (dev data / approver logins); file preview of bills on a device.

### Handoff — 2026-11-04 — Claude Code — Supervisors approve team HR requests (D-D06 in full)
**Commits:** `fashion-erp` `main` `2c9e9fdb` — PRODUCTION_SUPERVISOR gets HRMS_TEAM_APPROVER (user: "Yes, give approvals"); overtime rate/amount only with salary access or for your own; grant set `supervisor-team-approver` (dev DB 27 grants); `/me` `permissions.approvals`; allowlist for team approve/reject routes. App: `app/team/reviews.tsx` — tabs by permission (Leave, Corrections, Outside punches, Explanations, Overtime), approve / reject with reason, outside punch reject = pick the times to count (IST), own requests shown as "someone else must decide"; Home "Team approvals"; `istTimeOnDayOf` / `istHhmm` helpers.
**Verified (executed):** ERP hrms + auth 310 tests (incl. new overtime pay-visibility tests), tsc, ESLint; app tsc, eslint, jest 51/51; live contract reads every team review list and checks overtime carries no pay field; web Overtime page renders (dev has no overtime rows, so the hidden-amount dash was not seen live).
**Not verified:** an actual approve/reject from the app by a supervisor login (no dev supervisor with a usable password); outside-punch trimming across midnight.
**Behaviour change on the web:** manager-level team approvers without salary setup/generate access now see "—" instead of overtime amounts.

### Handoff — 2026-11-04 — Claude Code — Team attendance for supervisors
**Commits:** `fashion-erp` `main` `2c314a67` — team-day / team-month send no pay fields (`teamEmployeeView`); PRODUCTION_SUPERVISOR gets `hrms_attendance_team` + `hrms_attendance_records` view (view part of D-D06, user said "Yes, do it" 2026-11-04); grant script `--set supervisor-team-attendance`; `/me` `attendance.team` / `teamMonth`; allowlist. App: `app/team/attendance.tsx` (SUP-002: day picker, cards, attention-first list, filters), `app/team/member/[id].tsx` (SUP-003: month summary + days with remarks), Home "Team attendance".
**Verified (executed):** ERP hrms 213 + auth/mobile tests, tsc, ESLint clean; app tsc, eslint, jest 50/50; live contract asserts no pay field on any person in both APIs; web Team Attendance and Monthly Records pages render the same in the browser, no console errors.
**Not granted (needs the user):** the approve/reject half of D-D06 (leave, regularization, outdoor, overtime approvals for supervisors).
**Dev DB side effects:** 2 role grants on "QA Masters Entitlement Test" / PRODUCTION_SUPERVISOR.

### Handoff — 2026-11-04 — Claude Code — Worker & supervisor screens, voice notes
**Commits:** `fashion-erp` `main` `8288fdc4` (`/me` production + piece-rate permissions and `selfEntryEnabled`; bearer allowlist for worker and supervisor routes; earnings fix for unlinked users). App: `app/work/` (index, `[jobOrderId]` with enter work + hand back, history, `lot/[id]`, earnings), `app/team/` (approvals, orders), Home entries ("My work" / "Approvals (n waiting)" / "Team work status"), `src/features/work/work.ts` (server capacity rule mirrored for display), `VoiceNoteField` (expo-audio, m4a) on the expense form (CR-001).
**Design status:** WRK-* and SUP-* screens are READY_FOR_REVIEW, not APPROVED — built under D-039; the user may still ask for changes.
**Verified (executed):** app `tsc`, `eslint`, jest 48/48; ERP tests 448/448 in auth/mobile-auth/production; live contract (admin): `/me` new fields, my-assignments (self-entry off answer handled), production orders + detail progress, pending entries, earnings.
**Not verified:** a worker actually submitting / handing back and a supervisor approving through the app (no dev worker login with a usable password); voice recording on a device.
**Server gaps noted (not changed):** self-progress has no idempotency key — the app locks the button and tells the user to check "My entries" after a network error; `my-assignments` sends rate fields regardless of `workersCanViewOwnRate` (app hides them); `team-day` returns members' salary fields — fix before opening team attendance to supervisors.
**Next:** decide D-D06 for supervisors (team attendance) — needs a server change to drop salary fields from `team-day` first.

### Handoff — 2026-11-04 — Claude Code — B-23 done
**Commit:** `fashion-erp` `main` `abda2355` — `OWN_EXPENSE_REQUESTS` (`payment_requests` view + create) on PRODUCTION_WORKER, PRODUCTION_SUPERVISOR, WAREHOUSE_USER for new companies; `scripts/grant-own-expense-requests.mjs` for existing ones (dry run default, `--apply`, additive). User confirmed in chat 2026-11-04 ("Yes, make B-23").
**Verified (executed):** dry run → apply on the dev DB (3 companies, 9 roles, 18 grants) → re-run shows 0 (idempotent); SQL confirms all three roles hold both keys (5 users); RBAC + payment-request tests 204/204; `tsc` clean; ESLint clean. Not verified: a real worker signing in to the app (dev worker logins have no usable password).
**Effect in the app:** those users now see the "Expense requests" tile; they see only requests they raised.
**Still open from B-23's row:** HRMS_TEAM_APPROVER for supervisors (D-D06) — with the supervisor screens.

### Handoff — 2026-11-04 — Claude Code — Release 2: employee requests
**Commits:** `fashion-erp` `main` `9105769c` (bearer allowlist for the employee side of leave, corrections, outside reviews, salary history/advances, payment requests + attachments; approve/reject/pay refused). App: `app/requests/` — hub (tiles by `viewableModules`), `leave`, `correction`, `outside`, `salary`, `advance`, `expenses/{index,new,[id]}`; components `PickerField` (native date/time), `Chips`, `StatusPill`; `src/features/requests/requests.ts` (labels, validations mirroring the server, date ranges, Indian money format); `src/lib/download.ts` (salary-slip PDF / bill file → cache → share sheet; token refreshed first). New deps (D-041 addendum): `@react-native-community/datetimepicker`, `expo-file-system`, `expo-sharing`, `expo-image-picker`.
**Verified (executed):** app `tsc`, `eslint`, jest 42/42, Android bundle exports (3 MB); ERP auth tests 80/80; live contract with the real client against the dev server — all release-2 reads, and with `LIVE_WRITES=1`: expense create → idempotent retry returns the same request → cancel, advance ask/cancel, leave and correction payloads reach the server's own validation messages.
**Not done (at the time):** B-23 — done later the same day, see the handoff above. Voice notes on EMP-016/018 (CR-001, needs `expo-audio`). Leave-type regularizations (leave not taken / emergency leave) stay on the web. Nothing run on a device.
**Dev DB side effects:** one cancelled expense request (12.50, "Contract test") and possibly one cancelled salary advance for admin@indradhar.com; test devices created and removed.

### Handoff — 2026-11-04 — Claude Code — Alerts, settings, help, about
**Commits:** `fashion-erp` `main` `59397e42` (bearer allowlist + `GET/POST /api/v1/support-tickets`). App: `app/notifications/index.tsx` (EMP-020: list, unread dot, mark all read, pull to refresh), `app/notifications/[id].tsx` (EMP-021: marks read; opens Attendance for `ATTENDANCE_CORRECTION`, otherwise "open on the website"), `app/settings.tsx` (EMP-024: language English, phone permission settings, links), `app/help.tsx` + `src/features/help/help.ts` (EMP-026: 6 FAQ, my tickets, raise ticket with topic chips — billing left out for employees), `app/about.tsx` (EMP-027: version, server, supported versions, privacy text, licences). Home shows "Alerts (n new)"; Profile links Settings / Help / About.
**Verified (executed):** app `tsc`, `eslint`, jest 33/33; live contract with the real client against the dev server incl. notifications list, mark all read, tickets list, ticket create route (validation 400, no ticket created). ERP auth tests 85/85.
**Not verified:** screens on a device. Push notifications are still a backend gap (G-10) — alerts appear only when the app is opened.
**Dev DB side effects:** the contract run marked admin@indradhar.com's notifications as read; it created and removed one test device.
**Privacy notice link:** placeholder text until Q-15 (who owns the notice, retention) is answered.

### Handoff — 2026-11-04 — Claude Code — Phase 1b server face check
**Commits:** `fashion-erp` `main` `2becc954` (face engine + service, `hrms_employee_face_descriptors` + rollback, `punch()` `faceCheck` option, mobile = enforce, web = monitor by `ATTENDANCE_SERVER_FACE_CHECK`, `serverExternalPackages`, new deps `@tensorflow/tfjs` + `@tensorflow/tfjs-backend-wasm` 4.22.0 as approved with D-037). App: punch screen no longer refuses when the company requires a face; it shows a selfie hint and a "no face photo enrolled" stop; sends no `facePhotoId`.
**Verified (executed):** vitest — face service 7, punch 15 incl. 9 new face cases, mobile service 13; full suite 3935 passed, 0 failed; `tsc` (only the generated `LayoutProps` noise) and ESLint clean. Live in the Next dev server: engine loads inside Next (wasm, ~1.9 s first punch), descriptor of the enrolled photo computed and cached, selfie without a face → `FACE_NO_FACE` → recorded, sent to review, app message "face could not be confirmed"; with the photo file missing → `FACE_UNAVAILABLE` → also review (fail-safe). App `tsc`, `eslint`, jest 29/29.
**Not verified:** a real face match (the dev enrolled "face photo" is a plain green square); false-accept / false-reject rates at threshold 0.45 — needs the volunteers' photos; behaviour on the production server's CPU/RAM.
**Dev DB side effects:** two more admin punch sessions on 2026-11-04 (both sent to review), one descriptor row (empty, photo has no face). The OUT test selfie was written to the `happy-napier-55f9e2` worktree's `uploads` (temporary FILE_STORAGE_ROOT, reverted).
**Next step:** user provides volunteer photos → accuracy run → set threshold → `ATTENDANCE_SERVER_FACE_CHECK=enforce` for web. Meanwhile: notifications (EMP-020/021), settings/help/about screens, then Phase 7 device testing once a phone / Android SDK is available.

### Handoff — 2026-11-04 — Claude Code — Mobile punch (backend + app)
**Commits:** `fashion-erp` `main` `18dc32fe` (punch-challenge, locations, idempotent punch, `hrms_attendance_punch_meta`, `punch()` options param, CHALLENGE_INVALID; migration `20261104090000_mobile_punch_meta` applied to the dev DB). `fashion-erp-mobile` `main` (this commit).
**App:** `app/attendance/punch.tsx` (EMP-003…009: location permission, GPS accuracy loop to the company's `gpsAccuracyMeters`, front-camera selfie resized to 720 px JPEG, office distance estimate, confirm, result incl. "sent for review"); `src/features/attendance/{location,estimate,submitPunch}.ts` — one `clientPunchId` per attempt reused on retry, one fresh challenge on CHALLENGE_INVALID, fix older than 60 s re-acquired; Punch In / Punch Out buttons on the attendance dashboard. Signals sent: only `mocked` (others null = unknown, D-035 module not built).
**Face:** if `rules.requireFace` the punch screen explains that face check from the phone is not ready and sends nothing (no fake `facePhotoId`). The dev company has require-face **on**, so on this server the app cannot punch until phase 1b.
**Verified (executed):** backend — vitest 98/98 in the touched areas, full suite 3917 passed / 1 failed (CRM dashboard UI test; passes alone 8/8 — same timing flake as Phase 1); `tsc` clean except the generated-type `LayoutProps` (no `.next` in the worktree); ESLint clean on changed files; live dev-server punch flow 13/13 (auth, side binding, single use, replay, duplicate IN, low-GPS message, outside OUT → review, web punch refused for bearer). App — `tsc`, `eslint`, jest 29/29, live contract test with the app's real client against the dev server (login → me → today → month → offices → challenge → devices → refresh rotation → remove device → revoked), Android bundle exports.
**Not verified:** the punch screen itself on a device (camera/GPS need a real phone or emulator); multipart selfie upload from React Native (covered only by the server-side live test with Node FormData).
**Dev DB side effects:** one admin attendance session on 2026-11-04 (IN at Test Head Office, OUT from outside → review); two `hrms_attendance_punch_meta` rows; admin's two earlier test devices revoked ("Test device cleanup").
**Next step:** phase 1b server face check (B-18) — implementation can start with the company's existing `faceMatchThreshold`; volunteer photos are still needed to confirm the threshold before go-live.

### Handoff — 2026-11-03 — Claude Code — Phase 2 done + Phase 3 login/session + attendance read-only
**Branch / commit:** `fashion-erp-mobile` `main` (pushed, D-039). `fashion-erp`: Phase 1 merged to `main` (`b804bbcf`).
**Done:** Expo SDK 58 project at the repo root (`app/` expo-router screens, `src/`): theme tokens from the design system; components (AppText, Button, TextField, Screen, Card, HeroCard, Banner, ListRow, OfflineBanner); `api/client.ts` (bearer, X-App-Version/Platform/Request-Id, 15 s timeout, ERP error envelope → `ApiError`, one replay after refresh); `auth/session.ts` single-flight refresh; `auth/tokenStore.ts` (SecureStore, this device only); installation UUID; app-config + Update Required (AUTH-010); screens: splash (AUTH-001), login (AUTH-002/003/004/005/007 notices), set own password (AUTH-006 / EMP-023, re-login after change), suspended (AUTH-011), home (EMP-001), profile + sign out / sign out all phones (EMP-022 / AUTH-008), my devices (EMP-025), attendance dashboard + month list (EMP-002/011/012, read-only), day details + remark (EMP-013/014). `app.config.ts` variants (dev/preview/prod ids per D-036, permissions per docs/10, blocked background location / QUERY_ALL_PACKAGES / storage), `eas.json`. D-039/D-040/D-041 logged.
**Verified (executed):** `tsc --noEmit` clean; `eslint .` clean; `jest` 22/22 (single-flight refresh, token store, client headers/refresh-replay/revoked/timeout/offline/426, IST dates, versions, validation, log scrubbing); `expo export --platform android` bundles (2.8 MB Hermes); `expo config` resolves dev/prod ids.
**Not verified:** never run on an Android emulator, Android phone or iPhone (no Android SDK on this PC, no Apple/Expo accounts); not tested against the live ERP server from a phone. Hero gradient is a solid colour (expo-linear-gradient not added); Inter font not bundled (system font).
**Not built:** punching from the phone (EMP-003…010) — needs backend B-05 punch routes, B-06, B-07, B-19 first; notifications (EMP-020/021); help/about/settings (EMP-024/026/027); device registration/integrity (AUTH-009, needs accounts); optional update sheet AUTH-012.
**Next step:** backend punch slice in `fashion-erp` (punch-challenge, locations, idempotent punch route calling `punch()`), then the app's punch flow (location, camera, face).

### Handoff — 2026-11-03 — Claude Code — Phase 1 done (backend mobile auth) + in-app update design
**Branch / commit:** fashion-erp `mobile/phase-1-auth` @ `be1b197e` (30 files; not pushed, not merged). Migration `20261103180000_mobile_auth` applied to the dev DB (prisma migrate resolve) + rollback SQL.
**Done:** bearer adapter in `requireSession()` (+ shared `assertLiveTenantUser()`), `mobile_devices` / `mobile_sessions`, tokens (15 min / 30 d / 90 d, rotation, reuse revoke), proxy allowlist, 8 routes under `/api/mobile/v1` (app-config, auth/login, refresh, logout, logout-all, me, devices, devices/[id]), 6 error codes, per-IP limit, revoke on admin reset / suspend, AGENTS.md + GEMINI.md pointer (B-24), `docs/history/mobile.md`. Not in Phase 1 (by plan): B-23 role permission changes (release 2), integrity/punch routes (later phases).
**Verified (executed):** unit tests 167/167 for auth + admin areas; full suite 3904 passed, 1 failed (CRM dashboard UI test — passes alone, 8/8; timing flake under load, unrelated); `tsc` clean; ESLint clean on changed files; live dev-server flow 15/15 (login ok/wrong, /me, existing attendance API with bearer, non-allowlisted API 403, old version 426, garbage token 401, refresh rotation, old access 401, devices, logout → access + refresh 401, web without cookie unchanged); web /attendance/my works in the browser.
**Side effects:** the live check created one test device + (logged-out) session for admin@indradhar.com in the dev DB; the worktree now has its own `node_modules` (npm ci) and a local `.env` copy (both git-ignored).
**In-app update (user message):** designed AUTH-012 (optional update sheet), D-038 PROPOSED (Play immediate/flexible, App Store link on iPhone, OTA for JS fixes), B-25 proposed (per-platform app-config), docs 10 §5a.
**Next step:** user reviews Phase 1 (and decides merge/push), approves D-038 / AUTH-012; then Phase 2 (Expo app foundation) and, when photos arrive, Phase 1b (server face check).

### Handoff — 2026-11-03 — Claude Code — Release-1 designs approved
**Done:** user approved the 38 release-1 screens; `design/prototypes/approvals.js` lists them; prototype shows APPROVED; `SCREEN_APPROVAL_STATUS.md` and `APPROVED_SCREENS.md` updated.
**Phase 1 readiness:** its blocking questions (Q-03, Q-04, Q-09, Q-10, Q-16, Q-18) are answered and its screens approved. Phase 0 spikes A/B/C still wait for user inputs (photos, accounts/phones, factory visit) — they block phase 1b (face) and the anti-fraud parts of phase 3, not Phase 1.
**Next step:** user go-ahead to start Phase 1.

### Handoff — 2026-11-03 — Claude Code — D-037 server-side face verification added to plan
**User decisions:** fix SW-1 with a server-side face match on every punch (web + mobile) — APPROVED; user will provide 3–5 volunteers' photos later for the accuracy test.
**Done:** D-037 in decision log (D-012 row corrected); B-18 re-enabled with details in `06`; roadmap: new phase 1b + Spike A accuracy test task; docs 01/04/08 and audit §8 updated; EMP-005 and HR-005 designs updated ("server re-checks", "Face not matched (server)") and re-exported.
**Waiting on the user:** volunteer photos (3 enrolment + 4–5 selfies each, different light) → accuracy test → threshold → phase 1b.

### Handoff — 2026-11-03 — Claude Code — CR-002 (design v1.3)
**User decisions:** voice note only where the ERP backend already supports it; face check same as the web; "decide the rest".
**Done:** voice removed from 9 screens (kept on EMP-016, EMP-018, ACC-003, SHR-005); EMP-005 face step = web method (D-012 APPROVED, Q-01 answered, B-18 not needed, spike A superseded); all other gaps redesigned onto existing APIs/reports (`design/screen-inventory/ERP_AUDIT_FOR_DESIGN.md` §8) → **0 screens with backend gaps**; B-22 dropped; docs 01/04/05/06/08/12 updated; 19 screens + responsive re-exported.
**Remaining backend work:** only the already-planned mobile adapter/attendance items in `docs/06`.

### Handoff — 2026-11-03 — Claude Code — Design batch 2 + phone sizes (v1.2)
**Done:** all 36 batch-2 screens designed (`design/prototypes/screens-batch2.js`; routes verified in `fashion-erp/src/app/api/v1`); 118/118 screens designed; small/large phone exports for 10 key screens (`design/screens/responsive/`, tool `design/tools/export-responsive.cjs`); small-screen fixes (button pair overflow, compact hero); design v1.2; review doc updated.
**Not done:** user review/approval; real-device rendering checks (Phase 2/7).
**Next step:** user reviews; change requests → revise; approvals recorded in `design/approvals/APPROVED_SCREENS.md`.

### Handoff — 2026-11-03 — Claude Code — CR-001 voice notes
**Done:** user asked for a voice-recording option next to every upload/remark (users who cannot type). Added `VoiceNote` / `RemarkField` components; applied to EMP-014, EMP-016, EMP-018, EMP-019, WRK-004, WRK-007, SUP-005; new SHR-005; design v1.1; D-D10 approved. Backend: existing for payment requests; gap G-14 / B-22 for production entries, attendance remark, leave, corrections, outdoor clarification, approval remarks. Microphone permission added to docs 08 and 10.
**Not done:** batch-2 screens will apply the same rule when designed.

### Handoff — 2026-11-03 — Claude Code — Phase 0, design batch 1
**Goal:** role-based UI/UX design blueprint (user brief "Design first, coding later").
**Done:** ERP audit for design (`design/screen-inventory/ERP_AUDIT_FOR_DESIGN.md`: 15 roles, 59 modules, 14 actions, 13 packages, ~75 web pages, APIs, 13 gaps); design system (9 docs, colours sampled from the reference screenshots); 7 user flows; 117-screen inventory with permission + API mapping; 81 screen mockups (PNG + spec + interactions + states) in 14 categories; clickable prototype; approvals docs; roadmap revision 3.
**Verified (executed):** PNG export via headless Chrome; spot-checked EMP-001, EMP-002, AUTH-002 renders (fixed two layout issues); doc generator run (117 screens).
**Not done:** batch 2 (36 screens); 360 × 640 and 430 × 932 frame exports; Spikes A/B/C field work.
**Questions for the user:** D-D03…D-D09 (`design/approvals/CHANGE_REQUESTS.md`), plus earlier Q-01…Q-21.
**Next step:** user reviews batch 1 → change requests → revise → approval; then batch 2.

### Handoff — 2026-11-03 — Claude Code — Phase 0, accounts
**Done:** user decided the company creates and owns the developer accounts (Q-08 partly answered); wrote `docs/setup/accounts-checklist.md` (D-U-N-S, Play Console, Google Cloud + service account, Apple Developer + App Attest App ID, Expo org, test phones, list of non-secret ids to send back).
**Waiting on the company:** accounts (app ID `in.indradhar.fashionerp` approved, D-036) + test phones → then Spike B device tests.

### Handoff — 2026-11-03 — Claude Code — Phase 0, Spike B (desk research)
**Branch / commit:** `fashion-erp-mobile` `main`
**Goal:** feasibility of app integrity and device signals from documentation.
**Done:** `docs/spikes/integrity.md`; D-033 (`@expo/app-integrity`), D-034 (`expo-location` `mocked` on both platforms), D-035 (custom module for developer/ADB settings) — all PROPOSED; updated `02` dependency table, `04` §11, `08` §4–5.
**Verified (executed):** web research only (sources listed in the report). **No device test run.**
**Not done:** all device tests in `docs/spikes/integrity.md` §6 — need Play Console + Google Cloud project + service account, Apple Developer account, test phones.
**Questions for the user:** who owns / will create the Google Play Console, Google Cloud and Apple Developer accounts (Q-08); `@expo/app-integrity` is alpha — OK to plan on it (D-033)?
**Next step:** Spike C field-test sheet; device tests once accounts and phones are available.
**Read first:** `docs/spikes/integrity.md`, `docs/12`.

### Handoff — 2026-11-03 — Claude Code — Phase 0 (start) + repo move
**Branch / commit:** `fashion-erp-mobile` `main` (initial commit); in `fashion-erp`, branch `docs/mobile-app` gets a commit removing `mobile/docs` (moved here).
**Goal:** move app + docs to a separate repo (user decision), start Phase 0.
**Done:** new local repo with docs, README, AGENTS/CLAUDE/GEMINI pointer files, .gitignore; ERP-repo paths in docs prefixed `fashion-erp/`; D-002 APPROVED, B-16 dropped, Q-17 partly resolved; Spike A partial (face-api Node wasm build runs on Node 24, timings, missing deps).
**Verified (executed):** throwaway benchmark in the session scratchpad (outside both repos) — results in `docs/spikes/face-verification.md`.
**Not done:** Spike A accuracy test (needs consented face photos), Spike B (integrity, needs accounts/devices), Spike C (factory field test, needs site visit).
**Decisions proposed/changed:** D-002 APPROVED.
**Questions for the user:** consented test photos for Spike A; Q-01…Q-21 still open.
**Next step:** Spike B desk research (Play Integrity / App Attest Expo options) and Spike C protocol sheet; Spike A accuracy run once photos are provided.
**Read first:** `docs/14`, `docs/12`, `docs/spikes/face-verification.md`.

### Handoff — 2026-11-03 — Claude Code — Documentation rev 2
**Branch / commit:** `docs/mobile-app` (rev 2 commit on top of `97aa1313`; not pushed)
**Goal:** incorporate the master blueprint prompt: API classification, adapter auth, device registration, anti-fake attendance, new phase structure.
**Done:** rewrote 00–14 in `docs/`.
**Verified (executed):** 15 files present; referenced repo paths checked with a script (all existing-file references resolve; unresolved ones are proposed new files, globs or app-relative paths); decision/question ids cross-checked; `git status` shows only `docs/` changes. No tests run (no code).
**Not done:** spikes A/B/C (need devices, accounts, factory access); no platform API was exercised — Android/iOS feasibility statements come from public documentation and are marked "verify".
**Decisions proposed/changed:** D-003, D-011, D-020 revised; D-024…D-032 added.
**Questions for the user:** Q-01 … Q-21.
**Conflicts found:** `fashion-erp/AGENTS.md`/`fashion-erp/GEMINI.md` vs approval-gated process (Q-17).
**Next step:** after approval, Phase 0 spikes.
**Read first:** `14`, `12`, `11`, `13`, `01`, `fashion-erp/CLAUDE.md`.

### Handoff — 2026-11-03 — Claude Code — Documentation rev 1
**Branch / commit:** `docs/mobile-app` @ `97aa1313`
**Done:** first versions of 00–14 (superseded by rev 2).
