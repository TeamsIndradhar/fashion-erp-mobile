# AUTH-008 — Logout confirmation

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=AUTH-008` |
| Required permission | `session` |

## Purpose
Confirm sign-out; option to sign out of all devices.

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `POST /api/mobile/v1/auth/logout` | NEW thin mobile route (designed in docs/05) |
| `POST /api/mobile/v1/auth/logout-all` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Sign out
- Sign out of all devices
- Cancel

## Validation
- —

## Navigation destinations
- AUTH-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

