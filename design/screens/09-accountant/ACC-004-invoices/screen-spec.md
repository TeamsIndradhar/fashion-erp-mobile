# ACC-004 — Invoices

| Field | Value |
|---|---|
| Category | Accountant (`09-accountant`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=ACC-004` |
| Required permission | `invoices.view` |

## Purpose
Sales / purchase / custom invoices with status and balance; PDF.

## User types / ERP roles
- ACCOUNTS_MANAGER
- ACCOUNTS_EXECUTIVE
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/sales-invoices` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/purchase-invoices` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/custom-invoices` | EXISTING (via mobile auth adapter) |

## Available actions
- Filter
- Open PDF

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

