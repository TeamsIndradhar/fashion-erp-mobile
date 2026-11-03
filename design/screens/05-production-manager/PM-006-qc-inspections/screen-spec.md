# PM-006 — QC inspections

| Field | Value |
|---|---|
| Category | Production Manager (`05-production-manager`) |
| Status | **NOT_STARTED** (batch 2) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | not designed yet (batch 2) |
| Prototype | `design/prototypes/index.html?screen=PM-006` |
| Required permission | `qc.view` |

## Purpose
No QC list API (G-06); report-based view.

## User types / ERP roles
- QC_MANAGER

## Header and navigation
To be designed.

## Data / API
| Endpoint | Kind |
|---|---|
| `QC list API` | BACKEND_GAP — APPROVAL_REQUIRED |
| `GET /api/v1/reports/quality/qc-inspection-register` | EXISTING (via mobile auth adapter) |

## Available actions
- —

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

