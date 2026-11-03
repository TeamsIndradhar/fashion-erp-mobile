# PUR-001 — Purchase Home

| Field | Value |
|---|---|
| Category | Purchase Manager (`07-purchase-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PUR-001` |
| Required permission | `purchase_order.view` |

## Purpose
POs to approve, pending deliveries, this month's purchase. No dedicated Purchase Manager role exists — STORE_MANAGER covers it today.

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
| `GET /api/v1/purchase-orders?status=` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/purchase/pending-purchase-order` | EXISTING (via mobile auth adapter) |
| `Pending GRN status` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- Approve POs
- Pending deliveries

## Validation
- —

## Navigation destinations
- PUR-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

