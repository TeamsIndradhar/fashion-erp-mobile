# OWN-006 — HRMS summary

| Field | Value |
|---|---|
| Category | Company Owner (`13-company-owner`) |
| Status | **NOT_STARTED** (batch 2) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | not designed yet (batch 2) |
| Prototype | `design/prototypes/index.html?screen=OWN-006` |
| Required permission | `hrms_attendance_records.view` |

## Purpose
Present/absent trend, pending leave.

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT
- any role with financial_reports.view + reports.view

## Header and navigation
To be designed.

## Data / API
| Endpoint | Kind |
|---|---|
| `attendance/monthly-attendance-summary` | EXISTING (via mobile auth adapter) |

## Available actions
- —

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

