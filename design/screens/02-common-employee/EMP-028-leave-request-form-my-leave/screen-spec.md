# EMP-028 — Leave request form + my leave

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-028` |
| Required permission | `hrms_leave.view / create` |

## Purpose
Apply for leave with day durations (Full, first/second half, quarters) and see balance; own requests below.

## User types / ERP roles
- HRMS_SELF_SERVICE roles
- HRMS_TEAM_APPROVER roles
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/leave-types` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/leave-requests/balance?employeeId&leaveTypeId&year` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/leave-requests` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/leave-requests?mine=true` | EXISTING (via mobile auth adapter) |
| `Voice note on leave request (LEAVE_REQUEST target)` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- Pick leave type
- Pick dates + duration
- Type or record reason
- Submit

## Validation
- Leave type required
- At least one day
- Balance and salary-month lock checked by server

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

