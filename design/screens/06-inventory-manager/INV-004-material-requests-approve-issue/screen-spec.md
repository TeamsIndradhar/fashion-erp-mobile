# INV-004 — Material requests — approve / issue

| Field | Value |
|---|---|
| Category | Inventory Manager (`06-inventory-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=INV-004` |
| Required permission | `material_request.view; approve / issue per permission` |

## Purpose
Requests waiting; issue lines (fabric by roll via the existing roll picker).

## User types / ERP roles
- STORE_MANAGER
- WAREHOUSE_USER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/material-requests` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/material-requests/{id}/approve` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/material-requests/lines/{lineId}/available-rolls` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/material-requests/lines/{lineId}/issue` | EXISTING (via mobile auth adapter) |

## Available actions
- Approve
- Issue line
- Pick rolls

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

