# EMP-007 — Punch success

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-007` |
| Required permission | `hrms_attendance.create` |

## Purpose
Shows the server's message verbatim (existing punch() text).

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
| `POST /api/mobile/v1/attendance/punch-challenge` | NEW thin mobile route (designed in docs/05) |
| `POST /api/mobile/v1/attendance/punch (calls existing punch())` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Done

## Validation
- —

## Navigation destinations
- EMP-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

