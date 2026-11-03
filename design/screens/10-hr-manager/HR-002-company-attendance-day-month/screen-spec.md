# HR-002 — Company attendance (day / month)

| Field | Value |
|---|---|
| Category | HR Manager (`10-hr-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=HR-002` |
| Required permission | `hrms_attendance_team.view / hrms_attendance_records.view (+view_all)` |

## Purpose
All employees in scope by department with present/late/absent.

## User types / ERP roles
- MANAGEMENT
- SUPER_ADMIN
- HRMS_TEAM_APPROVER roles (team scope)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/attendance/team-day?date` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/attendance/team-month?month&view=all` | EXISTING (via mobile auth adapter) |

## Available actions
- Day / month
- Filter department

## Validation
- —

## Navigation destinations
- SUP-003

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

