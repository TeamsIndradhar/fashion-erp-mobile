# EMP-015 — My Requests (hub)

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-015` |
| Required permission | `per item: payment_requests.create · hrms_salary_advance.create · hrms_leave.create · hrms_attendance_regularization.create` |

## Purpose
One place for the employee's own requests. Each tile shows only with its permission. Note: workers/supervisors don't hold payment_requests.create by default (decision D-D04).

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
| `GET /api/v1/payment-requests?view=mine` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/salary/advances` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/leave-requests?mine=true` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/attendance-corrections?mine=true` | EXISTING (via mobile auth adapter) |

## Available actions
- New expense request
- New salary advance
- Leave / regularization (batch 2)

## Validation
- —

## Navigation destinations
- EMP-016
- EMP-017
- EMP-019

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

