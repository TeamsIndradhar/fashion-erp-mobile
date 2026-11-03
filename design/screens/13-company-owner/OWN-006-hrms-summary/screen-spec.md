# OWN-006 — HRMS summary

| Field | Value |
|---|---|
| Category | Company Owner (`13-company-owner`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=OWN-006` |
| Required permission | `hrms_attendance_records.view + reports.view` |

## Purpose
Attendance trend, absenteeism, pending leave.

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT
- users with reports.view + module view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/attendance/monthly-attendance-summary` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/leave-requests?status=PENDING` | EXISTING (via mobile auth adapter) |

## Available actions
- Open report

## Validation
- —

## Navigation destinations
- HR-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

