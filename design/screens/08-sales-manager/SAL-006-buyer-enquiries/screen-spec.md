# SAL-006 — Buyer enquiries

| Field | Value |
|---|---|
| Category | Sales Manager (`08-sales-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SAL-006` |
| Required permission | `buyer_enquiries.view` |

## Purpose
Enquiries and lines; convert a line to a sample where permitted.

## User types / ERP roles
- MERCHANDISER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/buyer-enquiries` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/buyer-enquiries/lines/{lineId}/convert` | EXISTING (via mobile auth adapter) |

## Available actions
- Open
- Convert to sample

## Validation
- —

## Navigation destinations
- PM-008

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

