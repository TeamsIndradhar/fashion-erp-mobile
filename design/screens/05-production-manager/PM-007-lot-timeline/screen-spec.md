# PM-007 — Lot timeline

| Field | Value |
|---|---|
| Category | Production Manager (`05-production-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PM-007` |
| Required permission | `production.view` |

## Purpose
Stage history of one lot (opened from a production order or job order; no lot list API — G-05).

## User types / ERP roles
- PRODUCTION_MANAGER
- QC_MANAGER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/lots/{id}/timeline` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/lots/{id}/genealogy` | EXISTING (via mobile auth adapter) |

## Available actions
- Open stage

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

