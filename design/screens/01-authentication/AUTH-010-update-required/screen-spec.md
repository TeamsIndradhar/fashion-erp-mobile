# AUTH-010 — Update required

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **APPROVED** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=AUTH-010` |
| Required permission | `none` |

## Purpose
Blocks old app versions before a breaking server change.

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/mobile/v1/app-config → minAppVersion / 426` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Open store

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

