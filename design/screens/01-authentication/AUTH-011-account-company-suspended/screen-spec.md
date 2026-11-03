# AUTH-011 — Account / company suspended

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=AUTH-011` |
| Required permission | `—` |

## Purpose
Company suspended or user deactivated (existing rules). Text from the server.

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `Existing live check → 403 ACCOUNT_SUSPENDED / PERMISSION_DENIED` | EXISTING (via mobile auth adapter) |

## Available actions
- Sign out
- Contact support

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

