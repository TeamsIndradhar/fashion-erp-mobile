# EXT-001 — External unit (contractor) home

| Field | Value |
|---|---|
| Category | Production Manager (`05-production-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EXT-001` |
| Required permission | `production.view / create (own contractor only)` |

## Purpose
Discovered role (not in the brief): contractor sees only their own job work. Included pending decision D-D05.

## User types / ERP roles
- EXTERNAL_UNIT_USER

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/job-work-orders?contractorId (scoped by getAllowedContractorId)` | EXISTING (via mobile auth adapter) |

## Available actions
- Open job work

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

