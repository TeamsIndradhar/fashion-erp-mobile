# SAL-004 — CRM leads + lead details

| Field | Value |
|---|---|
| Category | Sales Manager (`08-sales-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SAL-004` |
| Required permission | `crm.view (own scope unless view_all)` |

## Purpose
My leads with next follow-up; call / WhatsApp actions; activity log.

## User types / ERP roles
- MERCHANDISER
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/crm/leads` | EXISTING (via mobile auth adapter) |
| `CRM lead detail / activities routes (existing, under /api/v1/crm)` | EXISTING (via mobile auth adapter) |

## Available actions
- Call
- Log activity (type or record)

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

