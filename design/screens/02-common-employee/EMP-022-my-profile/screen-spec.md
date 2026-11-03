# EMP-022 — My Profile

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-022` |
| Required permission | `session` |

## Purpose
Identity, employment, shift, company, this device; entry to password, devices, settings, help, about, logout.

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/mobile/v1/me` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Change password
- Devices
- Settings
- Help
- About
- Logout

## Validation
- —

## Navigation destinations
- EMP-023
- EMP-025
- EMP-024
- EMP-026
- EMP-027
- AUTH-008

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

