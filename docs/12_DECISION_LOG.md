# 12 — Decision Log and Open Questions

**Single source of truth for mobile decisions.** If any other document disagrees, this file wins and the other document must be corrected. Every decision is **PROPOSED** until the user approves it; then set **APPROVED (date)**. Technical recommendations are not business policy until approved. Never delete a row — supersede it.

## User approvals — round of 2026-11-03 (answers in chat)

These answers override the PROPOSED status of the rows they mention below.

| Topic | User's answer | Rows now APPROVED / ANSWERED |
|---|---|---|
| Punch style | Keep both: round "Tap to Punch" on Home, Punch In / Out pair on the Attendance screen | D-D03 |
| Expense requests for workers / supervisors / warehouse users | **Yes** — give them `payment_requests.create` (role configuration, B-23) | D-D04 |
| Bottom-nav label | "Alerts" | D-D08 |
| First implementation release | **Login + Attendance** (login, punch with GPS + face + anti-fraud, history, remark, profile, notifications list). Other modules follow in later releases | D-D09 |
| HIGH_RISK punches | Review first (monitor mode, 4–6 weeks pilot), block only later after looking at data | Q-02, D-011, D-032 |
| Devices per employee | 2 active phones, no HR approval for a new device | Q-16, D-024 |
| Login + session | Email + password; access 15 min, refresh 30 days idle, 90 days max | Q-03, Q-04, D-004, D-005 |
| Users without attendance permission | May sign in; they see only what they are allowed; attendance shows "not enabled" | Q-10, D-022 |
| Supervisors' HR rights | **Yes** — team attendance + leave / correction approvals for PRODUCTION_SUPERVISOR (role configuration, B-23) | D-D06 |
| Contractor (EXTERNAL_UNIT_USER) | Later release | D-D05 |
| Admin users / roles on mobile | View only; editing stays on the web | D-D07 |
| `fashion-erp/AGENTS.md` / `GEMINI.md` conflict | Add one pointer line ("for mobile work follow `fashion-erp-mobile/docs/13`") when the first backend phase starts | Q-17, D-020 |
| Hosting | One server for all companies (`https://erp.indradhar.in`) → fixed base URL in the app, no server-address screen | Q-09 |
| Distribution | Public Google Play / App Store listing (one app for all customer companies) | Q-08 (app store name still open) |
| Language | English first, Hindi later (strings kept in one file) | Q-11 |
| Mobile login technique | Existing ERP APIs + thin bearer adapter + route allowlist | Q-18, D-003, D-006 |
| Face check | Same as the web on the phone + server-side match on every punch | Q-01, D-012, D-037 |
| Voice notes | Only where the ERP already stores them | D-D10 |

**Still open:** Q-05 self-service forgot password (not in v1), Q-06 map (later), Q-07 phone fleet / minimum OS, Q-12 crash-reporting vendor, Q-13 weak indoor GPS fallback (after the factory test), Q-14 push notifications (later), Q-15 selfie / location retention and privacy notice owner, Q-19 employee ↔ office assignment, Q-20 what flagged employees see (recommended: neutral message), Q-21 fixed temporary password in the web ERP, store app name, and approval of the design screens themselves.

## Decisions

| Id | Decision | Status | Rationale / alternatives | Docs |
|---|---|---|---|---|
| D-001 | React Native + Expo (dev builds, EAS) + TypeScript + expo-router | PROPOSED | team skills; native modules via Expo Modules API. Rejected: Flutter, native ×2, bare RN, PWA | 02 §1 |
| D-002 | App **and its docs** live in a **separate repository** `fashion-erp-mobile` (local `D:/office-data/claude-projects/fashion-erp-mobile`, no GitHub remote yet); `fashion-erp` gets only the backend changes | **APPROVED 2026-11-03 (user)** — supersedes the earlier "`fashion-erp/mobile/` folder" proposal | user: "same repo me nhi rakhna hai"; also removes the need for root tooling excludes (B-16 dropped) and gives the app its own agent instruction files | 02 §2 |
| D-003 | **Thin bearer adapter inside `requireSession()`** + bearer **route allowlist** (proxy); existing `/api/v1` routes reused; new `/api/mobile/v1` routes only for missing functions | PROPOSED (revised 2026-11-03; earlier draft had an all-new namespace) | maximises API reuse; no second auth system; least privilege via allowlist. Rejected: NextAuth cookie in RN; duplicate route set | 03 §2, 05 |
| D-004 | Opaque access token 15 min; opaque rotating refresh 30 d idle / 90 d absolute; SHA-256 hashes in `mobile_sessions`; reuse detection with 30 s grace | PROPOSED — values to validate (Q-04) | instant revocation; no JWT lib/secret. Alt: signed JWT access token | 03 §3 |
| D-005 | Login = email + password via existing `authenticateTenantUser()`; company from user | PROPOSED | same rules/lockout as web | 03 §4.1 |
| D-006 | Live user checks extracted once and shared by cookie and bearer paths | PROPOSED | no drift; unchanged `api-route.test.ts` | 03 §2.1 |
| D-007 | No duplicated business logic; new routes call existing services | PROPOSED | CLAUDE.md reuse rule | 05 §4 |
| D-008 | Online-only punching; server time only | PROPOSED | live proof at punch time | 04 §1 |
| D-009 | Foreground location only; never background | PROPOSED | privacy, store policy | 04 §4 |
| D-010 | Idempotent punch (`clientPunchId`), lookup before challenge check; metadata in new `hrms_attendance_punch_meta` | PROPOSED | safe retries; attendance tables untouched | 04 §8, 06 §4 |
| D-011 | Server-side risk engine: reasons with strengths (INFO/WEAK/STRONG/CRITICAL), levels NORMAL/SUSPICIOUS/HIGH_RISK by corroboration rules; SUSPICIOUS → existing outdoor review; HIGH_RISK → review during pilot, block only if approved | PROPOSED | explainable, configurable; no single weak signal decides | 08 §6 |
| D-012 | Face check on the phone works **the same as the web app**: on-device match against enrolled photos (company threshold + frames), `facePhotoId` sent with the punch | **APPROVED 2026-11-03 (user)**; extended by D-037 | user choice; gives instant feedback | 04 §7, 08 §7 |
| D-037 | **Server-side face verification** on every punch (web **and** mobile) — **built 2026-11-04** (`fashion-erp` `2becc954`; mobile enforce, web monitor until the accuracy test): server computes the selfie's face descriptor and compares it with the employee's stored enrolled-photo descriptors using the ERP's existing `@vladmandic/face-api` (Node wasm backend). Server decides; the phone/browser match stays only for instant feedback. **No match → punch recorded but sent to review** (never silently accepted, not blocked). Accuracy test with 3–5 consenting volunteers before go-live | **APPROVED 2026-11-03 (user)** — test photos to be provided by the user later | closes SW-1; feasibility shown in Spike A (Node 24 + wasm, ~0.2 s model load, 0.1–0.5 s detection, ~365 MB RAM) | 06 B-18, spikes/face-verification.md |
| D-038 | **In-app update** (user request "In-App Update", CR-003): (1) forced update when below `minAppVersion` → AUTH-010, Android uses Google Play in-app update *immediate* flow, iPhone opens the App Store page; (2) optional update when below `latestAppVersion` → AUTH-012 sheet, Android Play in-app update *flexible* flow (download inside the app, "Restart to update"), iPhone opens the App Store; (3) small JS-only fixes by OTA (EAS Update) applied on next launch, same `runtimeVersion` only, never for native changes or before the matching server deploy. Library for Play in-app updates to be chosen in Phase 2 (verify Expo dev-build support); Play in-app update only works for Play-installed builds | PROPOSED (needs user OK) | one consistent update experience; Apple has no in-app update API | 10 §6, design AUTH-010/AUTH-012 |
| D-039 | **No phase gates, push to `main`** (user, 2026-11-03: "continue all steps without any required permission, don't wait for permission in between"). Agents run the phases back to back and commit/push each repo's work to its own `main` (`fashion-erp` and `fashion-erp-mobile`). Supersedes the "stop at the gate" / "never pushed to main by an agent" rule in `11` and `13` for this user. Agents still stop for things only the user can provide (volunteer photos, developer accounts, test phones, factory visit) and list them in `14` | **APPROVED 2026-11-03 (user)** | user instruction | 11, 13, 14 |
| D-040 | Expo **SDK 58** (expo 58.0.23, React Native 0.88.1, React 19.3.0, TypeScript 6.0) — records D-023 | APPROVED (by D-023 rule: latest stable at Phase 2 start) | — | 02 §1 |
| D-041 | Phase 2/3 app dependencies (D-031) — release 2 adds `@react-native-community/datetimepicker`, `expo-file-system`, `expo-sharing`, `expo-image-picker`, `expo-audio` (voice notes, CR-001): `expo-location`, `expo-camera`, `expo-image-manipulator` (punch: GPS fix + mocked flag, selfie, resize), `expo-router`, `expo-secure-store`, `expo-constants`, `expo-linking`, `expo-device` (model/OS for the device row), `expo-crypto` (installation UUID), `expo-build-properties` (cleartext only in dev builds), `expo-splash-screen`, `expo-status-bar`, `react-native-safe-area-context`, `react-native-screens`, `@react-native-community/netinfo`, `@tanstack/react-query`; dev: `jest`, `jest-expo`, `@testing-library/react-native`, `react-test-renderer`, `@types/jest`, `eslint`, `eslint-config-expo`, `react-dom` (peer of jest-expo). Not added yet: Inter font, `expo-linear-gradient` (hero gradient), `zod` | APPROVED (D-039) | all first-party Expo or listed in 02 §1 | 02 §1 |
| D-042 | Icons: `@expo/vector-icons` (Feather set = Lucide-style 2 px outline, per ICONS.md), plus `expo-linear-gradient` (hero gradient, named in D-041 as not added yet). The app has no OTA (no expo-updates), so both reach phones with the next APK build. Used to match the prototype on EMP-001/002/003: shared `Icon`/`IconTile`, `AppHeader`, `InnerHeader`, `EmployeeProfileCard`, `StatusBadge`, `InfoBanner`, `ModuleGrid`, `BottomNavigation`, `StateView`, `DataListCard`; gradient `HeroCard`; `Button` gets `icon` and the BUTTONS.md size (52 px, radius 14); tokens add `infoTint`, `accent`, `accentTint` from the prototype | APPROVED (D-039; user asked for screens identical to the prototype, 2026-11-04) | first-party Expo, named in ICONS.md | design/design-system/ICONS.md |
| D-043 | **Unsafe phone = warning + sign-out** (user, 2026-11-11: "developer mode hone pr logout … mock location on nhi hona chahiye"; "login ho jaye but … bus warning aaye … mobile name, user name … db me save … 10 sec … automatic logout"). After sign-in (and on every return to the app, and on any GPS fix the app reads) a phone with **Developer options, USB debugging or wireless debugging ON, or a mocked GPS fix** sees only a warning screen (no app screens are mounted) for 10 s, then is signed out. The app sends `POST /api/mobile/v1/security/violation` (reasons, user from the token, installation id, manufacturer, brand, model, device name, OS, app version, signals, last location); the server saves a `mobile_security_events` row and revokes the session at once. The server also refuses a punch whose signals say `mocked` or `developerOptions` = true (`DEVICE_NOT_ALLOWED`). Android flags come from the local Expo module `modules/device-signals` (D-035 built); iOS has no readable Developer Mode, only the mocked fix. **Off in development builds** (they need USB debugging) unless `EXPO_PUBLIC_DEVICE_GUARD=1`. Supersedes D-027's "developer options never block alone" for this user. Client-side checks stay bypassable by a modified app (Play Integrity, D-033, is the strong check) | **APPROVED 2026-11-11 (user)** | user instruction | 08 §3, 04 |
| D-044 | **Punch and requests fixes** (user, 2026-11-11: "punch krne ke bad … done ka jiski jarurat nhi hai"; "request create krke ka option nhi hai"; "Haan, teeno fix karo"). (1) Home punch button is always tappable and says why it can't punch (no permission, today not loaded / failed) instead of staying grey. (2) A normal successful punch goes straight back to the previous screen (Android toast with the time) — **EMP-007 "Punch success" screen is no longer shown**; EMP-009 (sent for review) still is. (3) My Requests hub gets a "New request" card with direct buttons (leave, correction, expense, advance — each only with its module), and the Home "My Requests" tile shows for every login (hub explains a missing employee link). (4) Camera denied on the punch screen shows "Allow camera" / "Open settings" instead of hanging on "Checking location…" | **APPROVED 2026-11-11 (user)** | user instruction; changes approved EMP-007 flow | design/screen-inventory |
| D-045 | **My Attendance = module; summaries, leave, monthly dashboard** (user, 2026-11-11: "mera attendance ek large module hai jiska sub module punch in out hai"; rejected outdoor / overtime / attendance regularization summary "with filter date range, pagination (10,20,30)"; "leaves sub modules: apply leave, list with status, show pending leaves"; "dashboard with monthly reports"). App: My Attendance gets a tile grid (Monthly Dashboard, My Report, Overtime, Rejected Outdoor, Regularization, Leave); new screens `app/attendance/{outdoor,overtime,regularizations,dashboard}.tsx`, `app/leave/{index,list}.tsx` sharing `ListFilters` (From/To, status, rows per page 10/20/30, Prev/Next). Backend: optional `from`/`to` (IST days) on `GET /api/v1/leave-requests` (overlap), `attendance-corrections` (attendance date), `attendance/overtime` (date) and `attendance/outdoor-rejections` (original check-in). Leave and regularization page on the server; outdoor and overtime return the whole filtered list (server caps 500 / 1000) and page in the app. Bottom nav: no tab is current on My Attendance when "My Work" means production work. Screens built from existing components; not in `design/approvals` | **APPROVED 2026-11-11 (user)** | user instruction | 05, screen inventory |
| D-013 | API types hand-written in `src/api/types.ts`; contract fixtures from server tests | PROPOSED | app can't import server code | 02 §2 |
| D-014 | Tokens + installation id only in SecureStore (this-device-only) | PROPOSED | Keychain/Keystore | 03 §3 |
| D-015 | No map in v1 | PROPOSED | scope, keys/tiles policy | 07 |
| D-016 | No self-service forgot password in v1 | PROPOSED | ERP has none | 03 §4.6 |
| D-017 | No certificate pinning in v1 | PROPOSED | rotation risk; revisit Phase 7 | 08 §2 |
| D-018 | App version gate (`X-App-Version`, 426) | PROPOSED | force updates safely | 05 |
| D-019 | Bearer token failures return 401 codes; web keeps 403 "Sign in required." | PROPOSED | app must distinguish refresh vs forbidden | 05 §1 |
| D-020 | Conflict between root `fashion-erp/AGENTS.md`/`fashion-erp/GEMINI.md` ("never ask / no approval") and the approval-gated mobile process: agents **stop and report**, never silently override; repository-wide instruction change only with user approval | PROPOSED (revised) | user rule §18 | 13 §1 |
| D-021 | No reverse geocoding in v1 | PROPOSED | no extra vendor | 04 |
| D-022 | No new RBAC module; attendance access = `hrms_attendance.view/create` | PROPOSED (Q-10) | existing role defaults | 03 §6 |
| D-023 | Expo SDK = latest stable at Phase 2 start (record version) | PROPOSED | — | 02 §1 |
| D-024 | Device registration (`mobile_devices`), app-generated installation UUID, no hardware ids; policy max devices + optional HR approval per company | PROPOSED (Q-16) | lost/replace/revoke; privacy-conscious | 03 §5, 06 §3 |
| D-025 | Integrity: Play Integrity (Android) and App Attest (iOS), verified **on the server**; DeviceCheck not in v1 | PROPOSED | official APIs; client results never trusted | 08 §4–5 |
| D-026 | Stateless HMAC punch/registration challenge (120 s), single use via unique `challenge_id` / device row | PROPOSED | replay prevention with minimal storage | 06 §1 |
| D-027 | Client-reported signals (mock flag, developer options, ADB, root/jailbreak/emulator heuristics, accuracy, fix time) are WEAK at most; "clean" values never lower risk; developer options/USB debugging never block alone | PROPOSED | user rule §8; attacker controls the client | 08 §3 |
| D-028 | Existing radius and accuracy rules unchanged; no silent increase; fallback options decided after the factory field test | PROPOSED (Q-13) | user rule §7 | 04 §6 |
| D-029 | Factory field test (Spike C) before any threshold decision | PROPOSED | 200–225 m observation | 09 §5 |
| D-030 | Mobile punch uses a new thin route calling the existing `punch()` (not the web punch route), plus an optional `options` param on `punch()` | PROPOSED | mobile contract needs challenge/integrity/idempotency; web route untouched | 01 §6, 06 §6 |
| D-031 | Every new npm dependency (root or mobile) is logged here with reason; root additions need approval | PROPOSED | supply-chain control | 02 §1 |
| D-032 | Risk policy starts in monitor mode (HIGH_RISK → review) for a pilot period before any BLOCK | PROPOSED (Q-02) | calibrate false positives | 08 §6.3 |
| D-033 | Use **`@expo/app-integrity`** (official Expo; Play Integrity standard request + App Attest) instead of writing our own native module; pin the version; wrap behind `src/device/integrity.ts`; fallback = small custom Expo Module | PROPOSED (Spike B) | official, covers both platforms; risk: alpha since SDK 54, API may change | spikes/integrity.md |
| D-034 | Mock-location signal from `expo-location` `mocked` on both Android and iOS (no custom module) | PROPOSED (Spike B) | documented for both platforms; still client-reported (WEAK) | spikes/integrity.md |
| D-035 | Developer Options / USB debugging / wireless debugging via one small custom Expo Module returning `null` when unreadable; `jail-monkey` only if device tests prove it reliable | PROPOSED (Spike B) | no Expo API exists; wireless-debugging key is undocumented | spikes/integrity.md |
| D-036 | App ID / bundle ID = **`in.indradhar.fashionerp`** (Android `applicationId` and iOS `bundleIdentifier`); dev/preview variants `in.indradhar.fashionerp.dev` / `.preview` | **APPROVED 2026-11-03 (user)** | reverse of company domain `indradhar.in`; cannot change after first upload; used in Play Integrity package check and App Attest rpId (`<TeamID>.in.indradhar.fashionerp`) | 10 §3 |
| D-D01 | One app; dashboards, bottom nav and the Modules list are built from the user's **permission keys + entitlements** (from `GET /me`), never from role names. Categories (employee, worker, supervisor, managers, admin, owner) are design scenarios only | PROPOSED (design brief) | roles are per company and customizable; per-user GRANT/DENY overrides exist | design/screen-inventory |
| D-D02 | Design in batches: batch 1 = 81 screens (auth, common employee, worker, supervisor, every manager home + first list, admin, owner, shared); batch 2 = 36 remaining module screens | PROPOSED | brief allows batches; keeps review manageable | design/approvals/DESIGN_REVIEW.md |
| D-D10 | **Voice notes only where the ERP already stores them** (CR-001 narrowed by CR-002): expense / payment requests and other accounts records with voice support; other remark fields text-only; no backend change | **APPROVED 2026-11-03 (user request)** | users who cannot type | design/approvals/CHANGE_REQUESTS.md |
| D-D03 … D-D09 | Open design questions (punch style, expense permission for workers, external unit, supervisor HR rights, admin view-only, nav label, first implementation scope) | OPEN | see `design/approvals/CHANGE_REQUESTS.md` | design/approvals |

## Open questions — need the user's answer

| Id | Question | Blocks | Recommendation |
|---|---|---|---|
| Q-01 | Face on mobile: selfie-only + review, on-device match, server-side match, or server match + liveness vendor? With `requireFace=true` (default) mobile can't punch until this is decided. | Phase 5 | Spike A; prefer server-side match if feasible, else selfie-only with review |
| Q-02 | Risk outcomes: SUSPICIOUS → review OK? HIGH_RISK → review or block? Pilot length in monitor mode? | Phase 6 | review/review, 4–6 week pilot |
| Q-03 | Login by email only? | Phase 1 | yes |
| Q-04 | Token lifetimes 15 min / 30 d / 90 d OK? | Phase 1 | yes |
| Q-05 | Self-service forgot password needed later? | later | not v1 |
| Q-06 | Map later? | later | later |
| Q-07 | Phone fleet: personal, company-owned, shared? Min OS? Devices without Google Play services? | Phase 0/2 | personal + company, one user per device |
| Q-08 | Distribution (public vs private), app name, bundle id, Apple Team ID. **Partly answered 2026-11-03: the company will create and own the Play Console, Google Cloud, Apple Developer and Expo accounts** (checklist `docs/setup/accounts-checklist.md`; app ID `in.indradhar.fashionerp` **APPROVED** (D-036)). Still open: distribution type, store app name | Phase 2/4 | public listing under the company's org accounts |
| Q-09 | Hosting: single SaaS URL or per-customer servers? Staging URL? Number of server instances? **Partly answered 2026-11-03: production URL = `https://erp.indradhar.in/`** (health check OK, HTTPS + HSTS, behind nginx). Still open: is this the one URL for all customer companies, staging URL, instance count. | Phase 1 | use it as the fixed production base URL if it serves all companies |
| Q-10 | Separate mobile permission? Refuse login without attendance access? | Phase 1 | no; show "not enabled" screen |
| Q-11 | Hindi in v1? | Phase 2 | English, Hindi-ready |
| Q-12 | Crash reporting vendor (logging "Phase E" is on hold) | Phase 7 | decide with Phase E |
| Q-13 | Weak indoor GPS fallback: keep reject, or accept low-accuracy punches as SUSPICIOUS (changes an existing rule)? Add locations per building? | Phase 5 | decide after field test; first fix office points/locations |
| Q-14 | Push notifications later? | later | later |
| Q-15 | Selfie/location/risk-data retention and privacy notice owner (DPDP Act) | Phase 8 | define before release |
| Q-16 | Device policy: max devices per employee (2?), HR approval for new devices?, ownership labels | Phase 1 | 2 devices, approval off by default |
| Q-17 | **Conflict:** `fashion-erp/AGENTS.md`/`fashion-erp/GEMINI.md` say never ask/never seek approval. **Partly resolved:** the new `fashion-erp-mobile` repo has its own `AGENTS.md`/`GEMINI.md`/`CLAUDE.md` with the approval-gated rules. Still open for backend phases run inside `fashion-erp`: may we add a one-line pointer there? | backend phases | yes, a one-line pointer |
| Q-18 | Approve D-003 (bearer adapter on existing routes + allowlist) vs an all-new `/api/mobile/v1` namespace? | Phase 1 | adapter |
| Q-19 | Should employees be limited to their branch's office locations (no such link today)? | Phase 6 | not in v1; review data first |
| Q-20 | What do employees see when flagged — neutral message only, or the reasons? | Phase 6 | neutral message; reasons for reviewers |
| Q-21 | SW-6 (fixed temporary password for new logins) — fix in the web ERP (random temp passwords)? Outside mobile scope. | separate task | yes, as its own task |

## Change history

| Date | Change | By |
|---|---|---|
| 2026-11-03 | D-039 APPROVED (user): no phase gates, agents push to main in both repos; D-040 Expo SDK 58; D-041 Phase 2/3 dependencies | user / Claude Code |
| 2026-11-11 | D-043 APPROVED (user): Developer options / mock location → warning 10 s, sign-out, event saved on the server | user / Claude Code |
| 2026-11-11 | D-044 APPROVED (user): home punch always tappable, no success screen after a normal punch, "New request" buttons | user / Claude Code |
| 2026-11-11 | D-045 APPROVED (user): attendance summaries with date range + 10/20/30 paging, leave module, monthly dashboard | user / Claude Code |
| 2026-11-03 | Initial D-001…D-023, Q-01…Q-15 | Claude Code |
| 2026-11-03 | Approval round: 17 topics answered by the user (see "User approvals" table at the top) | user / Claude Code |
| 2026-11-03 | D-037 APPROVED: server-side face verification on every punch (web + mobile), no match → review; accuracy test with volunteer photos (to be provided) | user / Claude Code |
| 2026-11-03 | User: voice only where backend has it (D-D10 narrowed); face check same as web (D-012 APPROVED, Q-01 answered); other gaps resolved with existing APIs (design v1.3) | user / Claude Code |
| 2026-11-03 | Design phase (role-based UI/UX brief): D-D01, D-D02 proposed; D-D03…D-D09 open; scope widened from "login + attendance" to full-app **design** (implementation scope still per approval) | Claude Code |
| 2026-11-03 | D-036 APPROVED: app ID in.indradhar.fashionerp | user |
| 2026-11-03 | Q-08 partly answered: company creates/owns developer accounts | user |
| 2026-11-03 | Spike B desk research: added D-033, D-034, D-035 (PROPOSED) | Claude Code |
| 2026-11-03 | D-002 APPROVED: app + docs moved to separate repo `fashion-erp-mobile` (user); B-16 dropped; Q-17 partly resolved | user / Claude Code |
| 2026-11-03 | User gave production URL `https://erp.indradhar.in/` (Q-09 partly answered) | user / Claude Code |
| 2026-11-03 | Rev 2 (master blueprint): D-003 revised to adapter + reuse of existing routes; D-011 risk engine; D-020 revised (stop and report); added D-024…D-032, Q-16…Q-21; roadmap renumbered to the user's Phase 0–8 structure | Claude Code |
