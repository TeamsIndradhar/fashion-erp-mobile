# EMP-001 — Employee Home

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-001` |
| Required permission | `hrms_attendance.view (attendance card); shortcuts per permission` |

## Purpose
Common home for every employee (reference screenshot 2): identity, one-tap punch, today's times, self-service shortcuts.

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
| `GET /api/mobile/v1/me` | NEW thin mobile route (designed in docs/05) |
| `GET /api/v1/attendance/me/today` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/notifications?unreadOnly=true` | EXISTING (via mobile auth adapter) |

## Available actions
- Tap to Punch → EMP-005 flow
- View details → EMP-011
- Shortcuts
- Bell → EMP-020

## Validation
- —

## Navigation destinations
- EMP-002
- EMP-011
- EMP-014
- EMP-015
- EMP-020
- EMP-022

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

