# EMP-021 — Notification details

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-021` |
| Required permission | `session; target record needs its own permission` |

## Purpose
Opens the related record (relatedModule + relatedRecordId); if access was removed → permission-denied state.

## User types / ERP roles
- All tenant users

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `PATCH /api/v1/notifications/{id}/read` | EXISTING (via mobile auth adapter) |

## Available actions
- Open record

## Validation
- —

## Navigation destinations
- record screen

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

