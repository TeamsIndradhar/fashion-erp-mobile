# ADM-003 — Employee summary

| Field | Value |
|---|---|
| Category | Company Admin (`12-company-admin`) |
| Status | **NOT_STARTED** (batch 2) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | not designed yet (batch 2) |
| Prototype | `design/prototypes/index.html?screen=ADM-003` |
| Required permission | `masters_core.view + hrms_attendance_team.view` |

## Purpose
Headcount by department, present/absent.

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT (view/approve)
- users with administration_* permissions

## Header and navigation
To be designed.

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/employees` | EXISTING (via mobile auth adapter) |
| `company counts API` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- —

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

