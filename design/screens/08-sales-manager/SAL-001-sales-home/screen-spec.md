# SAL-001 — Sales Home

| Field | Value |
|---|---|
| Category | Sales Manager (`08-sales-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SAL-001` |
| Required permission | `sales_orders.view; crm.view; sampling.view` |

## Purpose
Orders, enquiries, CRM follow-ups for merchandisers. No dedicated Sales Manager role — MERCHANDISER today.

## User types / ERP roles
- MERCHANDISER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/sales-orders/pending-orders` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/crm/dashboard?range=&widgets=` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/sales-orders` | EXISTING (via mobile auth adapter) |

## Available actions
- Orders
- Leads
- Samples

## Validation
- —

## Navigation destinations
- SAL-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

