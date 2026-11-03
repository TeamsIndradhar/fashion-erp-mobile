# DSP-003 — Carton scan / packing

| Field | Value |
|---|---|
| Category | Dispatch Manager (`11-dispatch-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=DSP-003` |
| Required permission | `dispatch.edit + barcodes.scan` |

## Purpose
Scan cartons into the dispatch; running count vs plan.

## User types / ERP roles
- DISPATCH_MANAGER
- WAREHOUSE_USER

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET/POST /api/v1/dispatches/{id}/cartons` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/barcodes/resolve/{code}` | EXISTING (via mobile auth adapter) |

## Available actions
- Scan carton
- Remove

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

