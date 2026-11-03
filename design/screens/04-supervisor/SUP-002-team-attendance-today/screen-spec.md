# SUP-002 — Team attendance today

| Field | Value |
|---|---|
| Category | Supervisor / Team Leader (`04-supervisor`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SUP-002` |
| Required permission | `hrms_attendance_team.view` |

## Purpose
Who is in, late, outside, absent today within the HRMS team scope.

## User types / ERP roles
- roles with hrms_attendance_team.view (HRMS_TEAM_APPROVER roles, MANAGEMENT)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/attendance/team-day?date=` | EXISTING (via mobile auth adapter) |

## Available actions
- Filter
- Open member → SUP-003

## Validation
- —

## Navigation destinations
- SUP-003

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

