# AUTH-012 — states

| State | Behaviour |
|---|---|
| Loading | Skeleton cards (SHR-003) while data loads; header and bottom nav stay visible. |
| Empty | EmptyState with a one-line explanation and, where allowed, the main action. |
| Error | ErrorState with the server's `message` (from the existing error envelope) and Retry. Codes are never shown. |
| Offline | OfflineBanner at the top; cached read-only data if any; submits are disabled (no offline queue). |
| Permission denied | PermissionDeniedState when the server returns PERMISSION_DENIED / NOT_FOUND for out-of-scope data, or MODULE_NOT_ENABLED (SHR-004). |
| Session expired | Single refresh attempt; on failure → AUTH-007. |
| Success | Toast or result screen using the server's success message. |

Screen-specific: In-app update (CR-003): when a newer optional version exists, a sheet offers it. Android: Google Play in-app update (downloads inside the app, then 'Restart to update'). iPhone: opens the App Store page (Apple has no in-app update API). Forced updates stay on AUTH-010. Small JS fixes arrive silently by OTA (EAS Update) on the next launch.

