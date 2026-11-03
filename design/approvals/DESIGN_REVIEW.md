# Design review — Design v1.3 (batches 1 + 2, CR-001, CR-002), 2026-11-03

**Status: READY FOR YOUR REVIEW. Nothing is approved yet. No app code exists.**

## How to review
1. Open `design/prototypes/index.html` in Chrome or Edge (double-click). Left: categories and screens; centre: phone; right: purpose, roles, permission, APIs (E existing / N new mobile route / G backend gap), actions, states. Arrow keys move between screens.
2. Or browse the PNGs: `design/screens/<category>/<ID-slug>/screen.png`, with `screen-spec.md`, `interactions.md`, `states.md` next to each.
3. Small / large phones: `design/screens/responsive/<ID>-360x640.png` and `<ID>-430x932.png` (10 key screens).
4. Write corrections in `CHANGE_REQUESTS.md` (screen ID + change), or tell Claude in chat.
5. Approve per screen / category / batch in `APPROVED_SCREENS.md` (or say "approve batch 1", "approve categories 01–04").

## Scope
- **118 screens, all designed** (batch 1: 82 incl. SHR-005 voice note; batch 2: 36).
- Batch 2 added: leave request, correction request, salary slips, outdoor-rejection accept/clarify; job order (manager), job work, QC (report view), lot timeline, sampling, contractor home; stock ledger, material-request issue (roll picker), FG stock, stock movements, barcode scanner; PO details/approve, goods receipts; SO details + lifecycle, CRM leads, customers, buyer enquiries; payout, invoices, AR/AP aging; company attendance, correction / overtime approvals, employee directory; dispatch details, carton scan; employee summary, users (view only); owner production / inventory / people analytics, alerts.
- **CR-001 / CR-002:** voice notes only where the ERP backend supports them; face check like the web; former gaps redesigned onto existing APIs.

## Consistency audit (Claude, v1.2)

| Check | Result |
|---|---|
| Only shared components (`components.js`) | Pass — all 118 screens |
| Colours only from tokens; gradient only on hero cards | Pass |
| Bottom nav consistent per user type; hidden on forms / full-screen flows | Pass |
| Every screen has ID, permission, API mapping (E/N/G), states, spec files | Pass — 118/118 generated |
| Voice note | Only where the ERP backend already stores voice (EMP-016, EMP-018, ACC-003, SHR-005) — CR-002 |
| Demo data marked | Pass |
| Reference fidelity | Pass — EMP-001 = reference 2, EMP-002 = reference 1 (D-D03 open) |
| 360 × 640 (small Android) | Pass after fixes: Punch In/Out pair no longer overflows; hero, punch button and today's times fit; shortcut row needs a short scroll on home screens |
| 430 × 932 (large) | Pass — layouts stretch, no gaps |
| Text clipping | Long sub-labels use ellipsis; full text available on the detail screens |
| Backend gaps | **0** — all screens use existing ERP APIs/reports or the already-planned mobile adapter routes (`ERP_AUDIT_FOR_DESIGN.md` §8) |
| Face check | Same as the web app (D-012) — EMP-005 |
| Not verified | Real device rendering (fonts, safe areas, Dynamic Island) — happens in Phase 2/7; screen-reader labels are specified but not testable in a static prototype |

## Decisions needed from you
`CHANGE_REQUESTS.md` → "Open design decisions" (D-D03 … D-D09) and `docs/12_DECISION_LOG.md`.
