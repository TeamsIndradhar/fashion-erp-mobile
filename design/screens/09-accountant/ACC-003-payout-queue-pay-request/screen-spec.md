# ACC-003 — Payout queue / pay request

| Field | Value |
|---|---|
| Category | Accountant (`09-accountant`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=ACC-003` |
| Required permission | `payment_requests.post` |

## Purpose
Approved requests to pay; record payout with bank, mode, UTR and proof.

## User types / ERP roles
- ACCOUNTS_MANAGER
- ACCOUNTS_EXECUTIVE (post)
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/payment-requests?view=pay` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/payment-requests/{id}/payouts` | EXISTING (via mobile auth adapter) |

## Available actions
- Pay (full/partial)
- Attach proof

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

