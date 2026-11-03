# EMP-014 — Add attendance remark

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-014` |
| Required permission | `hrms_attendance.create` |

## Purpose
One remark per day (max 500, existing dayRemarkSchema); empty clears it.

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
| `PUT /api/v1/attendance/me/remark {date, remark}` | EXISTING (via mobile auth adapter) |

## Available actions
- Save
- Clear

## Validation
- Max 500 characters
- Editable dates per existing service rules

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

