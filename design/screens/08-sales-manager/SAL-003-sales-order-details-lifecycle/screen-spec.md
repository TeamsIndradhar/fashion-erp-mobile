# SAL-003 — Sales order details + lifecycle

| Field | Value |
|---|---|
| Category | Sales Manager (`08-sales-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SAL-003` |
| Required permission | `sales_orders.view; lifecycle sections redacted per module` |

## Purpose
Order lines, size matrix and the order → production → dispatch → invoice trail.

## User types / ERP roles
- MERCHANDISER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/sales-orders/{id}` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/order-lifecycle/{salesOrderId}` | EXISTING (via mobile auth adapter) |

## Available actions
- Open production
- Open dispatch

## Validation
- —

## Navigation destinations
- PM-003

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

