# WRK-006 — My submissions / work history

| Field | Value |
|---|---|
| Category | Production Worker (`03-production-worker`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=WRK-006` |
| Required permission | `production.view` |

## Purpose
Own self-entries with approval status and remark.

## User types / ERP roles
- PRODUCTION_WORKER
- any role with production.view but without view_all (assigned-only scope)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/job-order-progress-entries/mine` | EXISTING (via mobile auth adapter) |

## Available actions
- Filter

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

