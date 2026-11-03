# EMP-031 — Outside-punch rejection: accept / clarify

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **NOT_STARTED** (batch 2) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | not designed yet (batch 2) |
| Prototype | `design/prototypes/index.html?screen=EMP-031` |
| Required permission | `hrms_attendance.view` |

## Purpose
Employee side of the outdoor review.

## User types / ERP roles
- HRMS_SELF_SERVICE roles

## Header and navigation
To be designed.

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/attendance/outdoor-rejections?mine=true` | EXISTING (via mobile auth adapter) |
| `POST .../{id}/accept\|clarify` | EXISTING (via mobile auth adapter) |

## Available actions
- —

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

