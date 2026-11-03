# HR-007 — Employee directory

| Field | Value |
|---|---|
| Category | HR Manager (`10-hr-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=HR-007` |
| Required permission | `masters_core.view` |

## Purpose
Search employees; call; open profile (fields per permission).

## User types / ERP roles
- roles with masters_core.view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/employees` | EXISTING (via mobile auth adapter) |

## Available actions
- Search
- Call

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

