# ADM-004 — Users & roles (view only)

| Field | Value |
|---|---|
| Category | Company Admin (`12-company-admin`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=ADM-004` |
| Required permission | `administration_users.view` |

## Purpose
Read-only list of users, their roles and status; editing stays on the web (D-D07).

## User types / ERP roles
- users with administration_users.view

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/users` | EXISTING (via mobile auth adapter) |

## Available actions
- Search

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

