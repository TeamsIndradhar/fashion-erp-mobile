# SAL-003 — Sales order details

| Field | Value |
|---|---|
| Category | Sales Manager (`08-sales-manager`) |
| Status | **NOT_STARTED** (batch 2) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | not designed yet (batch 2) |
| Prototype | `design/prototypes/index.html?screen=SAL-003` |
| Required permission | `sales_orders.view` |

## Purpose
Lines, size matrix, lifecycle.

## User types / ERP roles
- MERCHANDISER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
To be designed.

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/sales-orders/{id}` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/order-lifecycle/{salesOrderId}` | EXISTING (via mobile auth adapter) |

## Available actions
- —

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

