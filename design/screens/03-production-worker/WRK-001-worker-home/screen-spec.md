# WRK-001 — Worker Home

| Field | Value |
|---|---|
| Category | Production Worker (`03-production-worker`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=WRK-001` |
| Required permission | `production.view (assigned scope) + hrms_attendance.view` |

## Purpose
Common employee home plus today's assigned work. Worker sees only own assignments (existing production-scope rules).

## User types / ERP roles
- PRODUCTION_WORKER
- any role with production.view but without view_all (assigned-only scope)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/mobile/v1/me` | NEW thin mobile route (designed in docs/05) |
| `GET /api/v1/attendance/me/today` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/job-orders/my-assignments` | EXISTING (via mobile auth adapter) |

## Available actions
- Tap to Punch
- Open task
- Submit progress

## Validation
- —

## Navigation destinations
- WRK-002
- WRK-003
- EMP-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

