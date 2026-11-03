# ACC-004 — Invoices list

| Field | Value |
|---|---|
| Category | Accountant (`09-accountant`) |
| Status | **NOT_STARTED** (batch 2) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | not designed yet (batch 2) |
| Prototype | `design/prototypes/index.html?screen=ACC-004` |
| Required permission | `invoices.view` |

## Purpose
Sales/purchase invoices.

## User types / ERP roles
- ACCOUNTS_MANAGER
- ACCOUNTS_EXECUTIVE (no approve)
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
To be designed.

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/sales-invoices` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/purchase-invoices` | EXISTING (via mobile auth adapter) |

## Available actions
- —

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

