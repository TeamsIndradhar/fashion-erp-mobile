# SHR-002 — All Modules (permission-driven)

| Field | Value |
|---|---|
| Category | Shared Components (`14-shared-components`) |
| Status | **APPROVED** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SHR-002` |
| Required permission | `view on each module + entitlement` |

## Purpose
Grouped list of the modules this user may open; searchable; hidden when nothing beyond self-service.

## User types / ERP roles
- every user (content depends on permissions)

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/mobile/v1/me (viewable modules + action sets)` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Search
- Open module

## Validation
- —

## Navigation destinations
- module homes

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

