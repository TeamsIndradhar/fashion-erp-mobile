# INV-005 — Finished goods stock

| Field | Value |
|---|---|
| Category | Inventory Manager (`06-inventory-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=INV-005` |
| Required permission | `fg_inventory.view` |

## Purpose
FG stock by style, colour, size (size matrix as chips).

## User types / ERP roles
- STORE_MANAGER
- WAREHOUSE_USER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/finished-goods-inventory/stock-list` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/finished-goods-inventory/style-stock/{productId}` | EXISTING (via mobile auth adapter) |

## Available actions
- Search style
- Open style

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

