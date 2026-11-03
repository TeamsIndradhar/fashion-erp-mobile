# SUP-005 — Approve / reject progress entry

| Field | Value |
|---|---|
| Category | Supervisor / Team Leader (`04-supervisor`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SUP-005` |
| Required permission | `production.approve (no self-approval)` |

## Purpose
Check the entry against the assignment and approve or reject; server re-checks capacity.

## User types / ERP roles
- PRODUCTION_SUPERVISOR
- PRODUCTION_MANAGER
- SUPER_ADMIN (production.approve)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `POST /api/v1/job-order-progress-entries/{id}/approve {approvalRemark?}` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/job-order-progress-entries/{id}/reject (remark required)` | EXISTING (via mobile auth adapter) |
| `PATCH /api/v1/job-order-progress-entries/{id}` | EXISTING (via mobile auth adapter) |
| `Voice note on progress entries / approval remarks — no attachment target yet (CR-001)` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- Approve
- Reject (remark)
- Edit quantities

## Validation
- Reject needs a remark

## Navigation destinations
- SUP-004

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

