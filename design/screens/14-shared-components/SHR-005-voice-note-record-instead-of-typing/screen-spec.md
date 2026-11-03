# SHR-005 — Voice note (record instead of typing)

| Field | Value |
|---|---|
| Category | Shared Components (`14-shared-components`) |
| Status | **READY_FOR_REVIEW** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=SHR-005` |
| Required permission | `same as the record it is attached to; microphone permission on the phone` |

## Purpose
CR-001: for users who cannot type. Offered only on records whose ERP backend already stores voice notes (expense / payment requests, expenses, advances, transfers, payments, credit notes); other remark fields stay text-only (user decision 2026-11-03). Recording is optional; text stays available. Max 2 minutes (web recorder allows 5).

## User types / ERP roles
- every user, remark fields of records the ERP stores voice for

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET/POST /api/v1/record-attachments/{module}/{recordId} (existing; audio webm/ogg/mp3/m4a/wav/aac accepted)` | EXISTING (via mobile auth adapter) |
| `Voice only where the ERP already stores it: payment requests (expense requests), expenses, employee advances, internal transfers, payments, supplier credit notes` | EXISTING (via mobile auth adapter) |

## Available actions
- Tap mic to record
- Tap again to stop
- Play
- Delete and re-record

## Validation
- Max 2 minutes
- Microphone permission asked only on first tap (explainer first)
- Uploaded with the record; same permission as the record

## Navigation destinations
- —

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

