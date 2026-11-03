# EMP-020 — Notifications

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.0 · Batch 1 · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-020` |
| Required permission | `session (own only)` |

## Purpose
In-app notifications (existing). Push notifications are a backend gap (G-10).

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/notifications` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/notifications/mark-all-read` | EXISTING (via mobile auth adapter) |

## Available actions
- Mark all read
- Open → deep link

## Validation
- —

## Navigation destinations
- EMP-021

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

