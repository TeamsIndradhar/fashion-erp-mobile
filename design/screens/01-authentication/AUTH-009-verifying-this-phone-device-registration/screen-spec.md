# AUTH-009 — Verifying this phone (device registration)

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=AUTH-009` |
| Required permission | `session` |

## Purpose
First sign-in on a phone: registers the device and runs the integrity check. Runs in the background; a failure does not block login (feeds risk engine).

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `POST /api/mobile/v1/devices/register (Play Integrity / App Attest)` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Continue

## Validation
- —

## Navigation destinations
- role home

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

