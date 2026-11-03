# EMP-004 — GPS verification (weak GPS)

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-004` |
| Required permission | `hrms_attendance.create` |

## Purpose
Live accuracy until it reaches the company limit (existing rule; not changed). Tips for indoor factory floors.

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
| `none (device GPS); limit from attendance/me/today rules.gpsAccuracyMeters` | EXISTING (via mobile auth adapter) |

## Available actions
- Try again
- Cancel

## Validation
- —

## Navigation destinations
- EMP-005

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

