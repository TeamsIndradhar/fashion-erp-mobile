# 14 — Mobile Project Status

**Overall:** **Phase 0 in progress** (user: "continue next phase", 2026-11-03). Docs moved to this separate repo (`fashion-erp-mobile`, D-002 APPROVED). No app code, no backend change, no migration; nothing installed in either repo.

Last updated: 2026-11-03, repo `fashion-erp-mobile` (local, branch `main`, no remote).

## Phase tracker

| Phase | Name | Status | Gate |
|---|---|---|---|
| — | Documentation (00–14), rev 2 | ✅ Drafted | ⏳ individual decisions still PROPOSED except D-002 |
| 0 | Documentation approval & feasibility (spikes A/B/C) | 🔄 In progress — Spike A partly done (`docs/spikes/face-verification.md`); Spike B, Spike C not started | — |
| 1 | Backend auth (in `fashion-erp`) | ⬜ | — |
| 2 | Mobile project setup | ⬜ | — |
| 3 | Login & secure sessions | ⬜ | — |
| 4 | GPS, permissions & device integrity | ⬜ | — |
| 5 | Check-in / check-out | ⬜ | — |
| 6 | Risk engine & history | ⬜ | — |
| 7 | Android & iOS testing | ⬜ | — |
| 8 | Production release | ⬜ | — |

Legend: ⬜ not started · 🔄 in progress · ✅ done · ⏳ waiting for user · ❌ blocked

## Waiting on the user

1. Review docs 00–14 (rev 2).
2. Approve or change decisions D-001 … D-032 (all PROPOSED; D-012 OPEN).
3. Answer blocking questions (Q-09 partly answered: production URL `https://erp.indradhar.in/`, verified live): Q-01, Q-02, Q-03, Q-04, Q-07, Q-08, Q-09 (rest), Q-10, Q-13, Q-16, **Q-17 (AGENTS.md/GEMINI.md conflict)**, Q-18.
4. Separate security finding outside mobile scope: Q-21 (fixed temporary password).

## Backend work identified (none started)

B-01 `mobile_sessions` · B-02 `mobile_devices` · B-03 mobile-auth module · B-04 bearer adapter + shared live checks + allowlist · B-05 new mobile routes · B-06 `hrms_attendance_punch_meta` · B-07 HMAC challenge · B-08 integrity verifiers · B-09 risk engine + policy columns · B-10 error codes · B-11 per-IP limit · B-12 audit · B-13 revoke on reset/suspend · B-14 cleanup job · B-15 env vars · ~~B-16~~ (dropped, separate repo) · B-17 reviewer reasons in Outdoor screen · B-18 server face match (if chosen) · B-19 `punch()` options param · B-20 device admin (optional) · B-21 `requireFaceOnMobile` (conditional). Details: `06`.

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
