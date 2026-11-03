# ADM-002 — Pending approvals (all modules)

| Field | Value |
|---|---|
| Category | Company Admin (`12-company-admin`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=ADM-002` |
| Required permission | `approve on each module (shown per permission)` |

## Purpose
One inbox grouped by module; each group only if the user can approve it.

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT (view/approve)
- users with administration_* permissions

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `Per-module lists: payment-requests?view=approve, job-order-progress-entries/pending, leave-requests?status=PENDING, attendance/outdoor, attendance-corrections, purchase-orders, material-requests` | EXISTING (via mobile auth adapter) |

## Available actions
- Open group

## Validation
- —

## Navigation destinations
- ACC-002
- SUP-004
- HR-003
- HR-005
- PUR-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

