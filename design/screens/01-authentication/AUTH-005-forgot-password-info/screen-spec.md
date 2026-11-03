# AUTH-005 — Forgot password (info)

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **APPROVED** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=AUTH-005` |
| Required permission | `none` |

## Purpose
Explains the existing process: HR/admin resets the password; user gets a temporary password.

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `Existing process: admin resets the password (resetUserPassword) → temporary password → forced change (AUTH-006)` | EXISTING (via mobile auth adapter) |

## Available actions
- Close

## Validation
- —

## Navigation destinations
- AUTH-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

