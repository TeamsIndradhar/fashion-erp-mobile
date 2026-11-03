# INV-007 — Barcode scanner

| Field | Value |
|---|---|
| Category | Inventory Manager (`06-inventory-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=INV-007` |
| Required permission | `barcodes.scan` |

## Purpose
Scan roll / bundle / carton / unit barcode → open the record it belongs to (existing resolver).

## User types / ERP roles
- roles with barcodes.scan (PRODUCTION_MANAGER/SUPERVISOR, STORE_MANAGER, WAREHOUSE_USER, DISPATCH_MANAGER)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/barcodes/resolve/{code}` | EXISTING (via mobile auth adapter) |

## Available actions
- Scan
- Torch
- Type code

## Validation
- —

## Navigation destinations
- record screen

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

