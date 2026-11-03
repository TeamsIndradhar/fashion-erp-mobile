# PUR-003 — Purchase order details + approve

| Field | Value |
|---|---|
| Category | Purchase Manager (`07-purchase-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PUR-003` |
| Required permission | `purchase_order.view; approve needs purchase_order.approve (no self-approval)` |

## Purpose
Lines with ordered/received quantity; approve; open PDF.

## User types / ERP roles
- STORE_MANAGER
- ACCOUNTS_MANAGER / MANAGEMENT (approve)
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/purchase-orders/{id}` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/purchase-orders/{id}/approve` | EXISTING (via mobile auth adapter) |
| `GET /api/v1/purchase-orders/{id}/pdf` | EXISTING (via mobile auth adapter) |

## Available actions
- Approve
- PDF
- Attachments

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

