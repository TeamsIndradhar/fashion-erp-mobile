# EMP-013 — Attendance day details

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **APPROVED** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-013` |
| Required permission | `hrms_attendance.view` |

## Purpose
Every session of the day with office, distance, accuracy, selfies, status, remark.

## User types / ERP roles
- MERCHANDISER
- PRODUCTION_SUPERVISOR
- PRODUCTION_WORKER
- ACCOUNTS_EXECUTIVE
- WAREHOUSE_USER
- + HRMS_TEAM_APPROVER roles
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/attendance/me/day?date=YYYY-MM-DD` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/attendance/sessions/{id}/selfie/{in\|out}` | EXISTING (via mobile auth adapter) |

## Available actions
- View selfie
- Edit remark → EMP-014

## Validation
- —

## Navigation destinations
- EMP-014

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

