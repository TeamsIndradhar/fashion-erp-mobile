# EMP-019 — Salary advance request

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-019` |
| Required permission | `hrms_salary_advance.create (all self-service roles)` |

## Purpose
Existing self-service: one open advance at a time; recovered from salary in installments.

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
| `GET/POST /api/v1/salary/advances` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/salary/advances/{id}/cancel` | EXISTING (via mobile auth adapter) |

## Available actions
- Submit
- Cancel pending

## Validation
- Amount > 0
- Only one open advance (server rule)

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

