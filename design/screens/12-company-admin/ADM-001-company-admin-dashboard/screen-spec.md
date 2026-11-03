# ADM-001 — Company Admin Dashboard

| Field | Value |
|---|---|
| Category | Company Admin (`12-company-admin`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=ADM-001` |
| Required permission | `dashboard.view; each card needs its own module permission` |

## Purpose
Operational overview. Financial cards appear only with finance/report permissions — not automatically for admins.

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT (view/approve)
- users with administration_* permissions

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/mobile/v1/me (permission keys)` | NEW thin mobile route (designed in docs/05) |
| `Company counts (employees, users, customers) — server-rendered only` | BACKEND_GAP — APPROVAL_REQUIRED |
| `Cross-module pending approvals` | BACKEND_GAP — APPROVAL_REQUIRED |
| `GET /api/v1/reports/mis/daily-mis?date=` | EXISTING (via mobile auth adapter) |

## Available actions
- Approvals
- Modules
- Reports

## Validation
- —

## Navigation destinations
- ADM-002
- SHR-002
- ADM-005

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

