# PM-001 — Production Manager Home

| Field | Value |
|---|---|
| Category | Production Manager (`05-production-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PM-001` |
| Required permission | `production.view (+view_all); reports.view for KPIs` |

## Purpose
Production at a glance: target vs actual, rejection, delayed orders, approvals waiting.

## User types / ERP roles
- PRODUCTION_MANAGER
- QC_MANAGER (QC parts)
- SAMPLING_MANAGER (view)
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/dashboard/executive-dashboard (formatted strings)` | EXISTING (via mobile auth adapter) |
| `Numeric KPI endpoint` | BACKEND_GAP — APPROVAL_REQUIRED |
| `GET /api/v1/job-order-progress-entries/pending` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/production-planning/delayed-production-orders` | EXISTING (via mobile auth adapter) |

## Available actions
- Open orders
- Approvals
- Reports

## Validation
- —

## Navigation destinations
- PM-002
- SUP-004
- ADM-005

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

