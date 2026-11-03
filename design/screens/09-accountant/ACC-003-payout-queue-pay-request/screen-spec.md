# ACC-003 — Payout queue / pay request

| Field | Value |
|---|---|
| Category | Accountant (`09-accountant`) |
| Status | **NOT_STARTED** (batch 2) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | not designed yet (batch 2) |
| Prototype | `design/prototypes/index.html?screen=ACC-003` |
| Required permission | `payment_requests.post` |

## Purpose
Record payouts (UTR, bank, proof).

## User types / ERP roles
- ACCOUNTS_MANAGER
- ACCOUNTS_EXECUTIVE (no approve)
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
To be designed.

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/payment-requests?view=pay` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/payment-requests/{id}/payouts` | EXISTING (via mobile auth adapter) |

## Available actions
- —

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

