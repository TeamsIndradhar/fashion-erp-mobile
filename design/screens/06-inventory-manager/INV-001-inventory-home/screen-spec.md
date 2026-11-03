# INV-001 — Inventory Home

| Field | Value |
|---|---|
| Category | Inventory Manager (`06-inventory-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=INV-001` |
| Required permission | `inventory.view / fg_inventory.view / material_request.view` |

## Purpose
Stock alerts, material requests waiting, quick scan.

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
| `GET /api/v1/reports/inventory/low-stock-report` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/inventory/stock-valuation` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/material-requests?status=` | EXISTING (via mobile auth adapter) |

## Available actions
- Stock
- Material requests
- Scanner

## Validation
- —

## Navigation destinations
- INV-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

