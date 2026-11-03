# OWN-005 — Financial summary

| Field | Value |
|---|---|
| Category | Company Owner (`13-company-owner`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=OWN-005` |
| Required permission | `financial_reports.view + reports.view` |

## Purpose
P&L headline, AR/AP aging, bank/cash balances from existing reports. No dedicated cash-flow KPI exists (gap).

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT
- any role with financial_reports.view + reports.view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/accounts/profit-and-loss` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/receivables/customer-outstanding` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/payables/supplier-outstanding` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/reports/expenses/financial-accounts-balances` | EXISTING (via mobile auth adapter) |

## Available actions
- Open each report

## Validation
- —

## Navigation destinations
- ADM-006

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

