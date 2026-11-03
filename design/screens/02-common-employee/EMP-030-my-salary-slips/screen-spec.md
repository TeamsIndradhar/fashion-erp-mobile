# EMP-030 — My salary slips

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-030` |
| Required permission | `hrms_salary_history.view (own only)` |

## Purpose
Own finalised salary slips; open PDF; respond (accept / discuss) as on the web.

## User types / ERP roles
- HRMS_SELF_SERVICE roles
- HRMS_TEAM_APPROVER roles
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/salary/history?year` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/salary/history/slips/{lineId}/pdf` | EXISTING (via mobile auth adapter) |
| `PUT /api/v1/salary/history/lines/{lineId}/response` | EXISTING (via mobile auth adapter) |

## Available actions
- Open PDF
- Accept
- Discuss (type or record)

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

