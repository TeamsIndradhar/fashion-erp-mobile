# EMP-005 — states

| State | Behaviour |
|---|---|
| Loading | Skeleton cards (SHR-003) while data loads; header and bottom nav stay visible. |
| Empty | EmptyState with a one-line explanation and, where allowed, the main action. |
| Error | ErrorState with the server's `message` (from the existing error envelope) and Retry. Codes are never shown. |
| Offline | OfflineBanner at the top; cached read-only data if any; submits are disabled (no offline queue). |
| Permission denied | PermissionDeniedState when the server returns PERMISSION_DENIED / NOT_FOUND for out-of-scope data, or MODULE_NOT_ENABLED (SHR-004). |
| Session expired | Single refresh attempt; on failure → AUTH-007. |
| Success | Toast or result screen using the server's success message. |

Screen-specific: Live selfie for every punch (existing rule). Face is matched on the phone exactly like the web app (enrolled photos, company threshold and frame count); the matched facePhotoId goes with the punch, and the server re-checks the face (D-037); if the server does not match, the punch is recorded and sent for review.

