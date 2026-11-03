# PM-006 — QC inspections (report view)

| Field | Value |
|---|---|
| Category | Production Manager (`05-production-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PM-006` |
| Required permission | `qc.view + reports.view` |

## Purpose
No QC list API exists (G-06); uses the existing QC reports.

## User types / ERP roles
- QC_MANAGER
- PRODUCTION_MANAGER
- MANAGEMENT

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/quality/qc-inspection-register` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/quality/defect-wise-analysis` | EXISTING (via mobile auth adapter) |

## Available actions
- Change period

## Validation
- —

## Navigation destinations
- ADM-006

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

