# SUP-001 — Supervisor Home

| Field | Value |
|---|---|
| Category | Supervisor / Team Leader (`04-supervisor`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SUP-001` |
| Required permission | `production.approve (approvals card); hrms_attendance_team.view (team attendance card, not held by PRODUCTION_SUPERVISOR by default)` |

## Purpose
Own attendance + team work + approvals waiting. Cards appear only with permission.

## User types / ERP roles
- PRODUCTION_SUPERVISOR
- PRODUCTION_MANAGER
- SUPER_ADMIN (production.approve)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/mobile/v1/me` | NEW thin mobile route (designed in docs/05) |
| `GET /api/v1/job-order-progress-entries/pending` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/attendance/summary?date=` | EXISTING (via mobile auth adapter) |
| `Team dashboard counts (team size, active JOs) — server-rendered only` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- Punch
- Approvals → SUP-004
- Team → SUP-002/006

## Validation
- —

## Navigation destinations
- SUP-002
- SUP-004
- SUP-006

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

