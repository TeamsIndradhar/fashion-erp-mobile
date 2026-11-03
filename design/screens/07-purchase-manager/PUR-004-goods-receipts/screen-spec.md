# PUR-004 — Goods receipts

| Field | Value |
|---|---|
| Category | Purchase Manager (`07-purchase-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PUR-004` |
| Required permission | `inventory.view` |

## Purpose
GRNs incl. fabric rolls; partial receipts against a PO.

## User types / ERP roles
- STORE_MANAGER
- ACCOUNTS_MANAGER / MANAGEMENT (approve)
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/goods-receipts` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/goods-receipts/{id}` | EXISTING (via mobile auth adapter) |

## Available actions
- Open

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

