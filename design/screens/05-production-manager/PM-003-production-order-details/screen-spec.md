# PM-003 — Production order details

| Field | Value |
|---|---|
| Category | Production Manager (`05-production-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PM-003` |
| Required permission | `production.view; actions per production.edit/approve/cancel` |

## Purpose
Stage-wise progress, lots, job orders; buttons only for permitted actions.

## User types / ERP roles
- PRODUCTION_MANAGER
- QC_MANAGER (QC parts)
- SAMPLING_MANAGER (view)
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/production-orders/{id} (incl. job orders)` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/lots/{id}/timeline` | EXISTING (via mobile auth adapter) |

## Available actions
- Open job order
- Open lot
- Permitted actions only

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

