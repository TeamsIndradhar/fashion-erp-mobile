# PM-005 — Job work orders (contractor)

| Field | Value |
|---|---|
| Category | Production Manager (`05-production-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PM-005` |
| Required permission | `production.view (+ view_all)` |

## Purpose
External job work: sent, received, overdue.

## User types / ERP roles
- PRODUCTION_MANAGER
- QC_MANAGER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/job-work-orders?contractorId&overdueOnly` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/job-work-orders/receipts/pending` | EXISTING (via mobile auth adapter) |

## Available actions
- Filter overdue
- Open

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

