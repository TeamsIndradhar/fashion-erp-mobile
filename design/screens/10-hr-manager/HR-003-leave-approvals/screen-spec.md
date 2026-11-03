# HR-003 — Leave approvals

| Field | Value |
|---|---|
| Category | HR Manager (`10-hr-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=HR-003` |
| Required permission | `hrms_leave.approve / reject (team scope, no self-approval)` |

## Purpose
Approve / reject leave from cards; salary-month lock enforced by server.

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
| `GET /api/v1/leave-requests?status=PENDING` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/leave-requests/{id}/approve\|reject` | EXISTING (via mobile auth adapter) |

## Available actions
- Approve
- Reject

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

