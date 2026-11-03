# HR-004 — Correction (regularization) approvals

| Field | Value |
|---|---|
| Category | HR Manager (`10-hr-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=HR-004` |
| Required permission | `hrms_attendance_regularization.approve / reject` |

## Purpose
Approve / reject corrections with documents and voice reason (if added, G-14).

## User types / ERP roles
- MANAGEMENT
- SUPER_ADMIN
- HRMS_TEAM_APPROVER roles (team scope)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/attendance-corrections?status=PENDING` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/attendance-corrections/{id}/approve\|reject` | EXISTING (via mobile auth adapter) |

## Available actions
- Approve
- Reject

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

