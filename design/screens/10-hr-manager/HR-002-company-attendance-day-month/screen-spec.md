# HR-002 — Company attendance (day / month)

| Field | Value |
|---|---|
| Category | HR Manager (`10-hr-manager`) |
| Status | **NOT_STARTED** (batch 2) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | not designed yet (batch 2) |
| Prototype | `design/prototypes/index.html?screen=HR-002` |
| Required permission | `hrms_attendance_team.view / records.view` |

## Purpose
All employees with view_all.

## User types / ERP roles
- MANAGEMENT
- SUPER_ADMIN
- HRMS_TEAM_APPROVER roles (team scope)
- custom HR role (none exists today)

## Header and navigation
To be designed.

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/attendance/team-day` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/attendance/team-month` | EXISTING (via mobile auth adapter) |

## Available actions
- —

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

