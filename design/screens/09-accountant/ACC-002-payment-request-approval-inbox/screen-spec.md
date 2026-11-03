# ACC-002 — Payment request approval inbox

| Field | Value |
|---|---|
| Category | Accountant (`09-accountant`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=ACC-002` |
| Required permission | `payment_requests.approve (no self-approval)` |

## Purpose
Approve / reject from cards; own requests excluded (existing rule).

## User types / ERP roles
- roles with payment_requests.approve (current-level approver)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/payment-requests?view=approve` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/payment-requests/{id}/approve` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/payment-requests/{id}/reject` | EXISTING (via mobile auth adapter) |

## Available actions
- Approve
- Reject
- Open details

## Validation
- —

## Navigation destinations
- EMP-018

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

