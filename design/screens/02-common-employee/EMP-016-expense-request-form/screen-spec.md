# EMP-016 — Expense request form

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-016` |
| Required permission | `payment_requests.create` |

## Purpose
Employee raises an expenditure request through the existing Payment Request hub. Exact fields follow the existing request-type schema (to verify in Phase 3).

## User types / ERP roles
- roles with payment_requests.create (MERCHANDISER, PRODUCTION_MANAGER, STORE_MANAGER, ACCOUNTS_*, DISPATCH_MANAGER, SUPER_ADMIN)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `POST /api/v1/payment-requests (existing; request type = Expenditure voucher)` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/record-attachments/PAYMENT_REQUEST/{recordId} (voice note, existing shared attachments API)` | EXISTING (via mobile auth adapter) |

## Available actions
- Take photo of bill
- Record voice note (instead of typing)
- Submit

## Validation
- Amount > 0, 2 decimals
- Purpose required
- Due date ≥ today
- Attachment type/size per server

## Navigation destinations
- EMP-018

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

