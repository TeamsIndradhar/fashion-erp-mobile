# ACC-005 — Receivables / payables aging

| Field | Value |
|---|---|
| Category | Accountant (`09-accountant`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=ACC-005` |
| Required permission | `financial_reports.view + reports.view` |

## Purpose
Aging buckets; tap a party for its ledger.

## User types / ERP roles
- ACCOUNTS_MANAGER
- ACCOUNTS_EXECUTIVE
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/receivables/customer-outstanding` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/payables/supplier-outstanding` | EXISTING (via mobile auth adapter) |

## Available actions
- Switch AR / AP

## Validation
- —

## Navigation destinations
- ADM-006

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

