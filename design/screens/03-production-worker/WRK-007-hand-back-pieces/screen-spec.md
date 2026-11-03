# WRK-007 — Hand back pieces

| Field | Value |
|---|---|
| Category | Production Worker (`03-production-worker`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=WRK-007` |
| Required permission | `production.view (own assignment)` |

## Purpose
Return unworked pieces (lowers assigned qty; logged pieces can't be handed back — server rule).

## User types / ERP roles
- PRODUCTION_WORKER
- any role with production.view but without view_all (assigned-only scope)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `POST /api/v1/job-order-assignments/{id}/handback {quantity, reason}` | EXISTING (via mobile auth adapter) |

## Available actions
- Hand back

## Validation
- Quantity integer > 0 and ≤ unworked
- Reason required

## Navigation destinations
- WRK-003

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

