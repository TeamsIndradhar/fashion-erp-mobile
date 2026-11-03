# SUP-006 — Team work status

| Field | Value |
|---|---|
| Category | Supervisor / Team Leader (`04-supervisor`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SUP-006` |
| Required permission | `production.view (view_all or team)` |

## Purpose
Team's job orders by stage and progress. A team job-order list API does not exist (gap G-05/G-08).

## User types / ERP roles
- PRODUCTION_SUPERVISOR
- PRODUCTION_MANAGER
- SUPER_ADMIN (production.approve)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/production-orders (scoped)` | EXISTING (via mobile auth adapter) |
| `Team job-order list / team pending counts` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- Open job order

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

