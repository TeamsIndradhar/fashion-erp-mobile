# PM-008 — Sampling list & decision

| Field | Value |
|---|---|
| Category | Production Manager (`05-production-manager`) |
| Status | **READY_FOR_REVIEW** (batch 2) |
| Design version | Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=PM-008` |
| Required permission | `sampling.view; decision needs approve/reject` |

## Purpose
Sample requests with current version and status; approve/reject a version where permitted.

## User types / ERP roles
- SAMPLING_MANAGER
- MERCHANDISER
- MANAGEMENT

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/sampling` | EXISTING (via mobile auth adapter) |
| `POST /api/v1/sampling/versions/{versionId}/decision` | EXISTING (via mobile auth adapter) |

## Available actions
- Open sample
- Approve / reject version

## Validation
- —

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

