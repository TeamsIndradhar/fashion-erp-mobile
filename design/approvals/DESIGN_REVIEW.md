# Design review — Batch 1 (Design v1.0, 2026-11-03)

**Status: READY FOR YOUR REVIEW. Nothing is approved yet. No app code exists.**

## How to review
1. Open `design/prototypes/index.html` in Chrome or Edge (double-click). Left: categories and screens; centre: phone; right: purpose, roles, permission, APIs (E / N / G), actions, states. Arrow keys move between screens.
2. Or browse the PNGs: `design/screens/<category>/<ID-slug>/screen.png`, with `screen-spec.md`, `interactions.md`, `states.md` next to each.
3. Write corrections in `CHANGE_REQUESTS.md` (screen ID + what to change), or tell Claude in chat.
4. Approve per screen or per category in `APPROVED_SCREENS.md` (or say "approve batch 1").

## What batch 1 covers (81 screens mocked)
- All authentication screens (11).
- Common employee (27 of 31): home, attendance dashboard, full punch flow incl. permission/GPS/selfie/confirm/success/review/security warning, monthly report, history, day details, remark, my requests, expense request form/history/details, salary advance, notifications, profile, change password, settings, devices, help, about.
- Production worker (10 of 10) and supervisor (7 of 7).
- One home + first list for every manager area (production, inventory, purchase, sales, accounts, HR incl. leave approvals and punch review, dispatch).
- Company admin (4 of 6) and owner (3 of 7) dashboards and analytics.
- Shared: component sheet, All Modules, standard states, module-not-enabled.

## Not in batch 1 (36 screens, NOT_STARTED)
Module detail/forms (PO approve, GRN, material request issue, FG stock, SO details, CRM leads, payout queue, invoices, AR/AP, company attendance, regularization/overtime approvals, employee directory, dispatch details, carton scan), leave form, correction request, salary slips, outdoor-rejection clarify, owner production/inventory/HR analytics and alerts, external-unit home. Listed in `design/screen-inventory/ALL_SCREENS.md`.

## Consistency audit (done by Claude on batch 1)

| Check | Result |
|---|---|
| Only shared components used (generated from `components.js`) | Pass — every screen is built from the same helpers; no per-module styles |
| Colours only from tokens | Pass — single primary; gradient only on hero cards |
| Bottom nav consistent | Pass — same 4–5 tabs per user type; hidden on forms and full-screen flows |
| Every screen has ID, permission, API mapping, states | Pass — 117/117 in the inventory; spec files generated |
| Demo data marked | Pass — "DEMO DATA" tag on every mockup |
| Reference fidelity | Pass with notes — EMP-001 follows reference 2 (round punch); EMP-002 follows reference 1 (In/Out pair) — choose one primary style (D-D03) |
| Text fits at 390 px | Mostly — long labels wrap in a few chips/tiles; must be re-checked at 360 px (small Android) in batch 2 |
| Small-screen (360 × 640) and large (430 × 932) frames | **Not yet exported** — only the 390 × 844 standard frame; to do before implementation approval |
| Dark theme / glassmorphism / random colours | None used |
| Fake APIs | None — 15 screens depend on backend gaps and say so |

## Decisions needed from you (design)
See `design/approvals/CHANGE_REQUESTS.md` → "Open design decisions" and `docs/12_DECISION_LOG.md` (D-D01 … D-D09).
