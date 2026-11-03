# WRK-003 — Task / job order details

| Field | Value |
|---|---|
| Category | Production Worker (`03-production-worker`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=WRK-003` |
| Required permission | `production.view (own assignment rows only)` |

## Purpose
Assigned, done, pending-approval and remaining quantity; stage; lot; slips.

## User types / ERP roles
- PRODUCTION_WORKER
- any role with production.view but without view_all (assigned-only scope)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/job-orders/{id}` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/job-orders/{id}/slips` | EXISTING (via mobile auth adapter) |

## Available actions
- Submit progress → WRK-004
- Hand back → WRK-007
- View lot → WRK-008
- Upload slip

## Validation
- —

## Navigation destinations
- WRK-004
- WRK-007
- WRK-008

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

