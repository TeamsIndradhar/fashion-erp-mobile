# HR-005 — Outside / flagged punch review

| Field | Value |
|---|---|
| Category | HR Manager (`10-hr-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=HR-005` |
| Required permission | `hrms_attendance_outdoor.approve / reject` |

## Purpose
Existing outdoor approval queue — also where SUSPICIOUS mobile punches land. Shows the risk reasons (new, B-17) so reviewers know why.

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
| `GET /api/v1/attendance/outdoor` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/attendance/outdoor (approve)` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/attendance/outdoor/{sessionId}/reject` | EXISTING (via mobile auth adapter) |
| `risk reasons from hrms_attendance_punch_meta (planned mobile backend, docs/06 B-17)` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Approve (→ REMOTE)
- Reject (times trimmed)
- View selfie / map

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

