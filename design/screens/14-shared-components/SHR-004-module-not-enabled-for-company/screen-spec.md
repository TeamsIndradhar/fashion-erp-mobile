# SHR-004 — Module not enabled for company

| Field | Value |
|---|---|
| Category | Shared Components (`14-shared-components`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SHR-004` |
| Required permission | `entitlement off → 403 MODULE_NOT_ENABLED` |

## Purpose
Shown when the platform turned a package off for the company (existing entitlement rules).

## User types / ERP roles
- all

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `existing EntitlementService via PermissionService` | EXISTING (via mobile auth adapter) |

## Available actions
- Back

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

