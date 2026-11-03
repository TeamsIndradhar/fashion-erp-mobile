# HR-001 — HR Home

| Field | Value |
|---|---|
| Category | HR Manager (`10-hr-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=HR-001` |
| Required permission | `hrms_attendance_team.view; hrms_leave.approve; hrms_attendance_outdoor.approve` |

## Purpose
Attendance today, leave and outdoor-punch approvals. No HR Manager role exists — shown for MANAGEMENT / team approvers.

## User types / ERP roles
- MANAGEMENT
- SUPER_ADMIN
- HRMS_TEAM_APPROVER roles (team scope)
- custom HR role (none exists today)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/attendance/summary?date=` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/leave-requests?status=PENDING` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/attendance/outdoor` | EXISTING (via mobile auth adapter) |

## Available actions
- Approvals
- Team attendance

## Validation
- —

## Navigation destinations
- HR-003
- HR-005
- SUP-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

