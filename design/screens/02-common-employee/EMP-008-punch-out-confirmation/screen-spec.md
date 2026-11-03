# EMP-008 — Punch Out confirmation

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-008` |
| Required permission | `hrms_attendance.create` |

## Purpose
Same flow for OUT; shows check-in time and hours so far.

## User types / ERP roles
- MERCHANDISER
- PRODUCTION_SUPERVISOR
- PRODUCTION_WORKER
- ACCOUNTS_EXECUTIVE
- WAREHOUSE_USER
- + HRMS_TEAM_APPROVER roles
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `POST /api/mobile/v1/attendance/punch-challenge` | NEW thin mobile route (designed in docs/05) |
| `POST /api/mobile/v1/attendance/punch (calls existing punch())` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Confirm Punch Out
- Back

## Validation
- —

## Navigation destinations
- EMP-007

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

