# ACC-001 — Accounts Home

| Field | Value |
|---|---|
| Category | Accountant (`09-accountant`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=ACC-001` |
| Required permission | `payment_requests.view (+approve/post); financial_reports.view for AR/AP` |

## Purpose
Payment requests to approve / pay, receivables and payables.

## User types / ERP roles
- ACCOUNTS_MANAGER
- ACCOUNTS_EXECUTIVE (no approve)
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/payment-requests/summary` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/receivables/customer-outstanding` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/payables/supplier-outstanding` | EXISTING (via mobile auth adapter) |

## Available actions
- Approve
- To pay
- Reports

## Validation
- —

## Navigation destinations
- ACC-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

