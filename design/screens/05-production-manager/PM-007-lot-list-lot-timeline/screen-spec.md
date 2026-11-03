# PM-007 — Lot list / lot timeline

| Field | Value |
|---|---|
| Category | Production Manager (`05-production-manager`) |
| Status | **NOT_STARTED** (batch 2) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | not designed yet (batch 2) |
| Prototype | `design/prototypes/index.html?screen=PM-007` |
| Required permission | `production.view` |

## Purpose
No lot list API (G-05).

## User types / ERP roles
- PRODUCTION_MANAGER
- QC_MANAGER (QC parts)
- SAMPLING_MANAGER (view)
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
To be designed.

## Data / API
| Endpoint | Kind |
|---|---|
| `Lot list API` | BACKEND_GAP — APPROVAL_REQUIRED |
| `GET /api/v1/lots/{id}/timeline` | EXISTING (via mobile auth adapter) |

## Available actions
- —

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

