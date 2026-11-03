# OWN-001 — Owner Dashboard

| Field | Value |
|---|---|
| Category | Company Owner (`13-company-owner`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=OWN-001` |
| Required permission | `reports.view + financial_reports.view (business cards); module views for others` |

## Purpose
Business performance first: sales, purchase, receivables, payables, production, stock, people. Every number comes from existing ERP reports — no invented KPIs.

## User types / ERP roles
- SUPER_ADMIN
- MANAGEMENT
- any role with financial_reports.view + reports.view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/reports/dashboard/executive-dashboard` | EXISTING (via mobile auth adapter) |
| `Numeric KPI endpoint (values come as formatted strings today)` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- Open analytics
- Alerts

## Validation
- —

## Navigation destinations
- OWN-002
- OWN-005

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

