# EMP-023 — Change password

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **APPROVED** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-023` |
| Required permission | `session` |

## Purpose
Voluntary change (same rules as AUTH-006). Other devices are signed out by the existing check.

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `POST /api/v1/account/change-password` | EXISTING (via mobile auth adapter) |
| `POST /api/mobile/v1/auth/login (silent re-sign-in)` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Save

## Validation
- Same as AUTH-006

## Navigation destinations
- EMP-022

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

