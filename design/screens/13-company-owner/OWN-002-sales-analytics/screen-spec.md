# OWN-002 — Sales analytics

| Field | Value |
|---|---|
| Category | Company Owner (`13-company-owner`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=OWN-002` |
| Required permission | `reports.view + sales_orders.view / financial_reports.view` |

## Purpose
Trend, top customers, top styles from existing reports.

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT
- any role with financial_reports.view + reports.view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/business-performance/monthly-sales-trend` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/business-performance/top-customers-by-revenue` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/business-performance/top-styles-by-revenue` | EXISTING (via mobile auth adapter) |

## Available actions
- Change period

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

