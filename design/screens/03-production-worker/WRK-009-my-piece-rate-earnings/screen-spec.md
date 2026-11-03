# WRK-009 — My piece-rate earnings

| Field | Value |
|---|---|
| Category | Production Worker (`03-production-worker`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=WRK-009` |
| Required permission | `piece_rate.view + ProductionSettings.workersCanViewOwnRate` |

## Purpose
Own earnings only, and only if the company allows workers to see rates; otherwise hidden.

## User types / ERP roles
- PRODUCTION_WORKER
- any role with production.view but without view_all (assigned-only scope)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/piece-rate-earnings` | EXISTING (via mobile auth adapter) |

## Available actions
- Filter month

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

