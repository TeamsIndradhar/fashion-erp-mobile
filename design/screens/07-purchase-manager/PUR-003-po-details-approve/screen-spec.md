# PUR-003 — PO details + approve

| Field | Value |
|---|---|
| Category | Purchase Manager (`07-purchase-manager`) |
| Status | **NOT_STARTED** (batch 2) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | not designed yet (batch 2) |
| Prototype | `design/prototypes/index.html?screen=PUR-003` |
| Required permission | `purchase_order.view/approve` |

## Purpose
Lines, received qty, approve/reject.

## User types / ERP roles
- STORE_MANAGER (purchase_order approve)
- PRODUCTION_MANAGER / WAREHOUSE_USER (create)
- ACCOUNTS_MANAGER / MANAGEMENT (approve)
- SUPER_ADMIN

## Header and navigation
To be designed.

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/purchase-orders/{id}` | EXISTING (via mobile auth adapter) |
| `PO approve route (to map)` | EXISTING (via mobile auth adapter) |

## Available actions
- —

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

