# SAL-002 — Sales orders (list)

| Field | Value |
|---|---|
| Category | Sales Manager (`08-sales-manager`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SAL-002` |
| Required permission | `sales_orders.view` |

## Purpose
Order cards with ship date and status.

## User types / ERP roles
- MERCHANDISER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/sales-orders` | EXISTING (via mobile auth adapter) |

## Available actions
- Search
- Filter
- Open

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

