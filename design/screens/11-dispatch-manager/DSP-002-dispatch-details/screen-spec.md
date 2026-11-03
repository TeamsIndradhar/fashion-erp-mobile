# DSP-002 — Dispatch details

| Field | Value |
|---|---|
| Category | Dispatch Manager (`11-dispatch-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=DSP-002` |
| Required permission | `dispatch.view; actions per dispatch.edit/post` |

## Purpose
Pick → pack → confirm → deliver states; only permitted next action shown.

## User types / ERP roles
- DISPATCH_MANAGER
- WAREHOUSE_USER
- MANAGEMENT

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/dispatches/{id}` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/dispatches/{id}/pack\|confirm\|deliver\|hold\|cancel` | EXISTING (via mobile auth adapter) |

## Available actions
- Confirm dispatch
- Mark delivered
- Hold

## Validation
- —

## Navigation destinations
- DSP-003

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

