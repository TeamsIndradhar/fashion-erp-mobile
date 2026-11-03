# EMP-012 — Attendance history (day list)

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **APPROVED** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-012` |
| Required permission | `hrms_attendance.view` |

## Purpose
Same data as a list: first in – last out, hours, flags.

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
| `GET /api/v1/attendance/me/month?month=YYYY-MM` | EXISTING (via mobile auth adapter) |

## Available actions
- Tap day → EMP-013

## Validation
- —

## Navigation destinations
- EMP-013

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

