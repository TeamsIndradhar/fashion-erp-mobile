# ADM-003 — Employee summary

| Field | Value |
|---|---|
| Category | Company Admin (`12-company-admin`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=ADM-003` |
| Required permission | `masters_core.view + hrms_attendance_team.view` |

## Purpose
Headcount, joiners/leavers, attendance today.

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/employees` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/attendance/summary?date` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/hr/department-wise-employees` | EXISTING (via mobile auth adapter) |

## Available actions
- Open directory

## Validation
- —

## Navigation destinations
- HR-007
- HR-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

