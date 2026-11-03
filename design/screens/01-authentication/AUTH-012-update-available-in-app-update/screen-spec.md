# AUTH-012 — Update available (in-app update)

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=AUTH-012` |
| Required permission | `none` |

## Purpose
In-app update (CR-003): when a newer optional version exists, a sheet offers it. Android: Google Play in-app update (downloads inside the app, then 'Restart to update'). iPhone: opens the App Store page (Apple has no in-app update API). Forced updates stay on AUTH-010. Small JS fixes arrive silently by OTA (EAS Update) on the next launch.

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/mobile/v1/app-config → latestAppVersion (built in Phase 1)` | EXISTING (via mobile auth adapter) |
| `Per-platform versions, store links and release notes in app-config (B-25, proposed)` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Update now
- Later
- Restart to update (Android, after download)

## Validation
- —

## Navigation destinations
- AUTH-010 (when the version becomes too old)

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

