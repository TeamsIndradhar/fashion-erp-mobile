# 14 — Mobile Project Status

**Overall:** Phase 1 (backend mobile auth) **merged into `fashion-erp` `main`** (`b804bbcf`). **Phase 2 (Expo app foundation) done** and the **login/session part of Phase 3 done**, plus read-only attendance screens (today, month, day, day remark). **Punching from the phone is not built yet** — it needs the mobile punch backend (challenge, locations, punch route) in `fashion-erp`, which is next. App not yet run on a real phone or emulator (no Android SDK on this PC; no developer accounts yet). D-039: no phase gates, agents push to `main`.

Last updated: 2026-11-03, repo `fashion-erp-mobile` (GitHub `TeamsIndradhar/fashion-erp-mobile`, branch `main`).

## Phase tracker (revision 3 — see `11` table)

| Phase | Name | Status | Gate |
|---|---|---|---|
| 0 | Design & feasibility | 🔄 119 screens designed, release-1 screens (38) approved; Spike A partly done; Spike B desk research done; Spike C protocol ready, visit not done | waiting for user inputs (photos, accounts/phones, factory visit) |
| 1 | Backend authentication (in `fashion-erp`) | ✅ Done — merged to `fashion-erp` `main` (`b804bbcf`); migration `20261103180000_mobile_auth` applied to the **dev DB only** | — (D-039) |
| 1b | Server-side face verification (in `fashion-erp`) | ⬜ waits for volunteer photos (accuracy test / threshold) | user input |
| 2 | Mobile foundation | ✅ Done — Expo SDK 58 app, expo-router, theme tokens, shared components, API client, SecureStore token store, single-flight refresh, app-config + Update Required, offline banner, Jest/ESLint/TS | — (D-039) |
| 3 | Common employee features | 🔄 Login, forced/voluntary password change, profile, devices, sign out (all) done; attendance today/month/day + remark done (read-only); **punch flow not started** (needs backend) | — |
| 4 | Worker & supervisor | ⬜ | — |
| 5 | Other authorized modules | ⬜ | — |
| 6 | Admin & owner dashboards | ⬜ | — |
| 7 | Security & testing | ⬜ | — |
| 8 | Builds & release | ⬜ needs developer accounts (Q-08) | user input |

Legend: ⬜ not started · 🔄 in progress · ✅ done · ⏳ waiting for user · ❌ blocked

## Waiting on the user

17 topics were answered on 2026-11-03 (see the "User approvals" table at the top of `12_DECISION_LOG.md`). Still needed:

1. ✅ Release-1 screen designs approved (38 screens). Phases now run without gates (D-039).
1a. **Server deploy:** run migration `20261103180000_mobile_auth` on the production/staging DB when `fashion-erp` `main` is deployed (only applied to the dev DB so far).
2. **Inputs for Phase 0 spikes:** 3–5 volunteers' photos (face accuracy test, D-037); developer accounts + test phones (Spike B); factory visit with the filled GPS sheet (Spike C).
3. Remaining questions: Q-07 phone fleet / minimum OS, Q-12 crash reporting, Q-13 weak-GPS fallback (after Spike C), Q-15 selfie retention & privacy notice owner, Q-19 employee ↔ office assignment, Q-20 what flagged employees see, Q-21 fixed temporary password (web ERP), store app name.

## Backend work identified

✅ Done in Phase 1: B-01…B-05 (auth routes), B-10 (auth codes), B-11, B-12 (auth audit), B-13, B-15 (auth env vars), B-24. Next: B-06, B-07, B-19, B-05 (punch routes), B-09 stub.

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
