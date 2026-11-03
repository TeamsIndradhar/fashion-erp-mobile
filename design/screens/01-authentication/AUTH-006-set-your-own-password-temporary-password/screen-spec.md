# AUTH-006 — Set your own password (temporary password)

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **APPROVED** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=AUTH-006` |
| Required permission | `session with mustChangePassword` |

## Purpose
Forced change after signing in with the temporary password (existing mustChangePassword rule). No back button.

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `POST /api/v1/account/change-password (existing changeOwnPassword())` | EXISTING (via mobile auth adapter) |
| `POST /api/mobile/v1/auth/login (re-sign-in with new password)` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Change password
- Logout

## Validation
- Current password correct
- New ≥ 8 characters
- Not the temporary password
- Different from current
- Confirm matches

## Navigation destinations
- role home

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

