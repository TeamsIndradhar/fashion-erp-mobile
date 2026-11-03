# AUTH-004 — Login – too many attempts

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=AUTH-004` |
| Required permission | `none` |

## Purpose
Account temporarily locked by the existing lockout rule (shared with the web).

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `Existing lockout (rateLimiter.ts, 5 tries / 15 min) via login adapter` | EXISTING (via mobile auth adapter) |

## Available actions
- Wait
- Contact HR

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

