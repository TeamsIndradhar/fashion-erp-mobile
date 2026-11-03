# OWN-007 — Alerts center

| Field | Value |
|---|---|
| Category | Company Owner (`13-company-owner`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=OWN-007` |
| Required permission | `per alert's module` |

## Purpose
Important exceptions from existing reports in one list (aggregation API is a gap G-04).

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT
- users with reports.view + module view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `Built in the app from the listed reports (one call each, only for modules the user can see)` | EXISTING (via mobile auth adapter) |
| `Sources: delayed-production-orders, low-stock-report, customer-outstanding, pending-dispatch reports` | EXISTING (via mobile auth adapter) |

## Available actions
- Open source

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

