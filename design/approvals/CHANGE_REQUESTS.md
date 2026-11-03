# Change requests

Format: `CR-nnn | date | screen ID(s) | requested change | requested by | status (OPEN / DONE / REJECTED) | design version after change`

| CR | Date | Screens | Change | By | Status |
|---|---|---|---|---|---|
| — | | | (none yet) | | |

## Open design decisions (need the user)

| Id | Question | Recommendation |
|---|---|---|
| D-D03 | Primary punch style: round "Tap to Punch" (reference 2, EMP-001) or Punch In / Punch Out pair (reference 1, EMP-002)? | Home = round single button; attendance screen = pair. Keep both as designed. |
| D-D04 | Expense requests for workers / supervisors / warehouse users: grant `payment_requests.create` to these roles (role config change in the ERP), or show them only the salary-advance request? | Company decision; no code needed either way |
| D-D05 | Include the discovered `EXTERNAL_UNIT_USER` (contractor login) in the mobile app? | Later batch |
| D-D06 | Should supervisors get team attendance / HR approvals (`hrms_attendance_team.view`, approve rights)? Today they don't by default. | Company decision (role config) |
| D-D07 | Admin features on mobile: view-only for users/roles; editing stays on the web? | Yes, view-only |
| D-D08 | Bottom-nav label "Alerts" (short) vs "Notifications" (as in the references)? | "Alerts" fits 5 tabs on small phones |
| D-D09 | Which batch-1 categories go into the **first implementation**? (Earlier plan: login + attendance only.) | Implementation phase 1 = authentication + common employee attendance; others after their batch approval |
