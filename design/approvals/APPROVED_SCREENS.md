# Approved screens

Only the user approves. Approved screens are the **design baseline**: implementation must match them; any change needs a change request (`CHANGE_REQUESTS.md`) and a new approval. The machine-readable list is `design/prototypes/approvals.js` (drives the prototype and `SCREEN_APPROVAL_STATUS.md`).

| Date | Approved by | Screens | Design version | Notes |
|---|---|---|---|---|
| 2026-11-03 | User (chat: "Approve release-1 screens") | **Release 1 — 38 screens:** AUTH-001…AUTH-011 (11) · EMP-001…EMP-014 (14) · EMP-020…EMP-027 (8) · SHR-001…SHR-005 (5) | Design v1.3 | Login + Attendance release (D-D09). Includes punch flow with face check like the web + server re-check (D-012, D-037), voice note component (only used where the backend supports it) |

Not yet approved (80 screens): expense requests EMP-015…019, leave / correction / slips EMP-028…031, worker, supervisor, all manager modules, admin, owner — status READY_FOR_REVIEW; approve before their release starts.
