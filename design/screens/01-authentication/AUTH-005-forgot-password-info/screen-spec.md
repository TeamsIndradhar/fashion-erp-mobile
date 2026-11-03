# AUTH-005 — Forgot password (info)

| Field | Value |
|---|---|
| Category | Authentication (`01-authentication`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
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
| `none — ERP has no self-service reset (admin reset only)` | BACKEND_GAP — APPROVAL_REQUIRED |

## Available actions
- Close

## Validation
- —

## Navigation destinations
- AUTH-002

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

