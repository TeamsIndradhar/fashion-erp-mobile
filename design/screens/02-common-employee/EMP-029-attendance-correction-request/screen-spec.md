# EMP-029 — Attendance correction request

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-029` |
| Required permission | `hrms_attendance_regularization.create` |

## Purpose
Missed punch, missed logout, change login/logout time — also the fallback when indoor GPS fails (Q-13).

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
| `POST /api/v1/attendance-corrections` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/attendance-corrections/{id}/documents (file)` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/attendance-corrections?mine=true` | EXISTING (via mobile auth adapter) |
| `Voice note on correction (audio on documents route unverified)` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- Pick type
- Pick date/time
- Type or record reason
- Attach proof
- Submit

## Validation
- Type, date and time required
- Server checks salary month open and no overlap

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

