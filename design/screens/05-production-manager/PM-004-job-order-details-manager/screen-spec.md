# PM-004 — Job order details (manager)

| Field | Value |
|---|---|
| Category | Production Manager (`05-production-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PM-004` |
| Required permission | `production.view; assign needs production.edit` |

## Purpose
Workers assigned, progress per worker, pending entries, slips; assign a worker (with permission).

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
| `GET /api/v1/job-orders/{id}` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/job-orders/{id}/assignments` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/job-orders/{id}/slips` | EXISTING (via mobile auth adapter) |

## Available actions
- Assign worker
- Open entry
- View slips

## Validation
- —

## Navigation destinations
- SUP-005

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

