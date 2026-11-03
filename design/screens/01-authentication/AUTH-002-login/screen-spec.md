# AUTH-002 — Login

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=AUTH-002` |
| Required permission | `none (public)` |

## Purpose
Sign in with the existing ERP email + password. Company comes from the account (email is unique across companies).

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `POST /api/mobile/v1/auth/login (calls existing authenticateTenantUser())` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Show/hide password
- Sign in
- Forgot password → AUTH-005

## Validation
- Email required, valid format
- Password required
- Button disabled while empty or submitting

## Navigation destinations
- AUTH-006 (temporary password)
- AUTH-009 (new device)
- role home

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

