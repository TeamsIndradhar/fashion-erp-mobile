# EMP-031 — Outside punch rejected — accept or clarify

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-031` |
| Required permission | `hrms_attendance.view` |

## Purpose
Employee side of the existing outdoor review: accept the trimmed time, or clarify with reason and proof.

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
| `GET /api/v1/attendance/outdoor-rejections?mine=true` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/attendance/outdoor-rejections/{id}/accept` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/attendance/outdoor-rejections/{id}/clarify (reason + proof image/PDF)` | EXISTING (via mobile auth adapter) |
| `Voice clarification` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- Accept
- Clarify (type or record + proof)

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

