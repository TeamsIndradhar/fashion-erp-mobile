# SUP-004 — Pending production approvals

| Field | Value |
|---|---|
| Category | Supervisor / Team Leader (`04-supervisor`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SUP-004` |
| Required permission | `production.approve (branch + stage + team scope)` |

## Purpose
Workers' self entries waiting for approval.

## User types / ERP roles
- PRODUCTION_SUPERVISOR
- PRODUCTION_MANAGER
- SUPER_ADMIN (production.approve)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/job-order-progress-entries/pending` | EXISTING (via mobile auth adapter) |

## Available actions
- Open → SUP-005

## Validation
- —

## Navigation destinations
- SUP-005

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

