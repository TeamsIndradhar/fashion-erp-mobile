# OWN-003 — Production analytics

| Field | Value |
|---|---|
| Category | Company Owner (`13-company-owner`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=OWN-003` |
| Required permission | `reports.view + production.view` |

## Purpose
Target vs actual, rejection, line-wise output. No SAM/efficiency % exists in the ERP — not shown.

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT
- users with reports.view + module view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/production/production-achievement` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/production/production-rejection` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/production/line-wise-production` | EXISTING (via mobile auth adapter) |

## Available actions
- Change period

## Validation
- —

## Navigation destinations
- ADM-006

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

