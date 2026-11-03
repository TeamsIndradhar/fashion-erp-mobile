# ADM-006 — Report viewer (mobile)

| Field | Value |
|---|---|
| Category | Company Admin (`12-company-admin`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=ADM-006` |
| Required permission | `reports.view; export needs reports.export` |

## Purpose
Report rows rendered as cards; filters as a sheet; export/share only with permission. Reports return full row sets (no server paging) — large reports may be slow.

## User types / ERP roles
- any role with reports.view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/{category}/{key}?dateFrom&dateTo…` | EXISTING (via mobile auth adapter) |
| `GET …/export/{xlsx\|csv\|pdf}` | EXISTING (via mobile auth adapter) |

## Available actions
- Filters
- Export / share

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

