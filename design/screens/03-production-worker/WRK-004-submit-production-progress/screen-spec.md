# WRK-004 — Submit production progress

| Field | Value |
|---|---|
| Category | Production Worker (`03-production-worker`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=WRK-004` |
| Required permission | `production.view + self-entry guards (linked employee, selfEntryEnabled, real assignment, work skill)` |

## Purpose
Worker logs own quantities (and can record a voice note instead of typing remarks); entry is created PENDING for supervisor approval (existing rule). Capacity check: completed + rejected + damaged − extra ≤ assigned.

## User types / ERP roles
- PRODUCTION_WORKER
- any role with production.view but without view_all (assigned-only scope)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `POST /api/v1/job-orders/{id}/self-progress` | EXISTING (via mobile auth adapter) |
| `Voice note on production progress entries (needs a JOB_ORDER_PROGRESS_ENTRY target) — no attachment target yet (CR-001)` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- Submit

## Validation
- Whole numbers ≥ 0
- At least one quantity > 0
- Server capacity check (assignment-capacity.ts) with its own message

## Navigation destinations
- WRK-005

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

