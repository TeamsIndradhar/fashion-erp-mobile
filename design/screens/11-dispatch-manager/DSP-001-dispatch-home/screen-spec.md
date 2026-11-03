# DSP-001 — Dispatch Home

| Field | Value |
|---|---|
| Category | Dispatch Manager (`11-dispatch-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=DSP-001` |
| Required permission | `dispatch.view` |

## Purpose
Ready to dispatch, in transit, today's dispatches, scanner.

## User types / ERP roles
- DISPATCH_MANAGER
- WAREHOUSE_USER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/dispatches` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/dispatch/pending-dispatch` | EXISTING (via mobile auth adapter) |

## Available actions
- Dispatches
- Scanner

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

