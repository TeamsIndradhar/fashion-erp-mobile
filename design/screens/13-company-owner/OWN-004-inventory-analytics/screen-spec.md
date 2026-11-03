# OWN-004 — Inventory analytics

| Field | Value |
|---|---|
| Category | Company Owner (`13-company-owner`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=OWN-004` |
| Required permission | `reports.view + inventory.view` |

## Purpose
Stock value, low stock and dead stock.

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT
- users with reports.view + module view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/inventory/stock-valuation` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/inventory/low-stock-report` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/inventory/slow-moving-dead-stock` | EXISTING (via mobile auth adapter) |

## Available actions
- Open report

## Validation
- —

## Navigation destinations
- ADM-006

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

