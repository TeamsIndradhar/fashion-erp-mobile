# EMP-002 — Attendance Dashboard

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **APPROVED** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-002` |
| Required permission | `hrms_attendance.view; punch needs hrms_attendance.create` |

## Purpose
Full attendance view (reference screenshot 1): live location state, GPS accuracy, checked-in ring, Punch In/Out pair (only the valid one enabled).

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
| `GET /api/v1/attendance/me/today` | EXISTING (via mobile auth adapter) |
| `GET /api/mobile/v1/attendance/locations` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Punch In / Punch Out
- History
- Remark

## Validation
- —

## Navigation destinations
- EMP-003..EMP-009
- EMP-011
- EMP-014

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

