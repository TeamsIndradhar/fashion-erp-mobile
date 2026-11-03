# PUR-002 — Purchase orders (list)

| Field | Value |
|---|---|
| Category | Purchase Manager (`07-purchase-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PUR-002` |
| Required permission | `purchase_order.view; approve button needs purchase_order.approve` |

## Purpose
PO cards with status; approve from detail (batch 2).

## User types / ERP roles
- STORE_MANAGER (purchase_order approve)
- PRODUCTION_MANAGER / WAREHOUSE_USER (create)
- ACCOUNTS_MANAGER / MANAGEMENT (approve)
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/purchase-orders` | EXISTING (via mobile auth adapter) |

## Available actions
- Search
- Filter
- Open

## Validation
- —

## Navigation destinations
- PUR-003

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

