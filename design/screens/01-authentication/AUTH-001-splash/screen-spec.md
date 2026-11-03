# AUTH-001 — Splash

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=AUTH-001` |
| Required permission | `none (public)` |

## Purpose
Brand screen while the app checks version, refreshes the stored session and loads the user's permissions.

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/mobile/v1/app-config` | NEW thin mobile route (designed in docs/05) |
| `POST /api/mobile/v1/auth/refresh` | NEW thin mobile route (designed in docs/05) |
| `GET /api/mobile/v1/me` | NEW thin mobile route (designed in docs/05) |

## Available actions
- none (automatic)

## Validation
- —

## Navigation destinations
- AUTH-010 Update required
- AUTH-002 Login
- AUTH-006 Set password
- EMP-001 / role home

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

