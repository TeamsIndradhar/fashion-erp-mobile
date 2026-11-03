# EMP-005 — Punch – selfie

| Field | Value |
|---|---|
| Category | Common Employee (`02-common-employee`) |
| Status | **APPROVED** (batch 1) |
| Design version | Design v1.3 · Batches 1+2 (+CR-001/CR-002) · 2026-11-03 |
| Mockup | [screen.png](screen.png) |
| Prototype | `design/prototypes/index.html?screen=EMP-005` |
| Required permission | `hrms_attendance.create` |

## Purpose
Live selfie for every punch (existing rule). Face is matched on the phone exactly like the web app (enrolled photos, company threshold and frame count); the matched facePhotoId goes with the punch, and the server re-checks the face (D-037); if the server does not match, the punch is recorded and sent for review.

## User types / ERP roles
- MERCHANDISER
- PRODUCTION_SUPERVISOR
- PRODUCTION_WORKER
- ACCOUNTS_EXECUTIVE
- WAREHOUSE_USER
- + HRMS_TEAM_APPROVER roles
- MANAGEMENT
- SUPER_ADMIN

## Header and navigation
Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows).

## Data / API
| Endpoint | Kind |
|---|---|
| `GET /api/v1/attendance/face-photos/file/{photoId} (enrolled photos, existing)` | EXISTING (via mobile auth adapter) |
| `Face match on the phone, same as the web (FacePunchCamera: threshold + frames from attendance/me/today rules) → facePhotoId sent with the punch` | EXISTING (via mobile auth adapter) |
| `Server re-checks the selfie against enrolled photos on every punch (D-037, B-18)` | NEW thin mobile route (designed in docs/05) |

## Available actions
- Capture
- Retake

## Validation
- —

## Navigation destinations
- EMP-006

## UI components
Shared components only (see `design/design-system/COMPONENTS.md`). Demo data in the mockup is marked "DEMO DATA".

