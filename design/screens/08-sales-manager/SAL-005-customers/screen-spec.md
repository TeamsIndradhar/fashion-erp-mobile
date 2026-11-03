# SAL-005 — Customers

| Field | Value |
|---|---|
| Category | Sales Manager (`08-sales-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SAL-005` |
| Required permission | `masters_core.view; outstanding needs financial permission` |

## Purpose
Customer cards; outstanding shown only with finance/report permission.

## User types / ERP roles
- MERCHANDISER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/customers` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/customers/customer-outstanding` | EXISTING (via mobile auth adapter) |

## Available actions
- Search
- Open

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

