# EMP-017 — My expense requests (history)

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-017` |
| Required permission | `payment_requests.view (own unless view_all)` |

## Purpose
Own requests with status filters (existing visibility rules).

## User types / ERP roles
- roles with payment_requests.view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/payment-requests?view=mine&status=` | EXISTING (via mobile auth adapter) |

## Available actions
- Filter
- Tap → EMP-018

## Validation
- —

## Navigation destinations
- EMP-018

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

