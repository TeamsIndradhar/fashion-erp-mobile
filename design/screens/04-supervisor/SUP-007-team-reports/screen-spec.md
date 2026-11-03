# SUP-007 — Team reports

| Field | Value |
|---|---|
| Category | Supervisor / Team Leader (`04-supervisor`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SUP-007` |
| Required permission | `reports.view + production.view` |

## Purpose
Existing production reports opened in mobile list form.

## User types / ERP roles
- roles with reports.view + production.view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/production/worker-output-register?period=` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/production/line-wise-production` | EXISTING (via mobile auth adapter) |

## Available actions
- Open report

## Validation
- —

## Navigation destinations
- ADM-006

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

