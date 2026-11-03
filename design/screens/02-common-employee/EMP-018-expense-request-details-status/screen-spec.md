# EMP-018 — Expense request details / status

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-018` |
| Required permission | `payment_requests.view; cancel = own + create` |

## Purpose
Status timeline: PENDING_APPROVAL → APPROVED → PARTIALLY_PAID/PAID, or REJECTED/CANCELLED (existing).

## User types / ERP roles
- roles with payment_requests.view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/payment-requests/{id}` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/payment-requests/{id}/cancel` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/record-attachments/PAYMENT_REQUEST/{id} (bill photo + voice note)` | EXISTING (via mobile auth adapter) |

## Available actions
- Cancel (while pending)

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

