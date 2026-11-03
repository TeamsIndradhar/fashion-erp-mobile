# Change requests

Format: `CR-nnn | date | screen ID(s) | requested change | requested by | status (OPEN / DONE / REJECTED) | design version after change`

| CR | Date | Screens | Change | By | Status |
|---|---|---|---|---|---|
| CR-002 | 2026-11-03 | EMP-014, EMP-019, EMP-028, EMP-029, EMP-031, WRK-004, WRK-007, SUP-005, HR-004, SHR-005 | Voice note only where the ERP backend already supports it (remove elsewhere); face check same as the web; resolve other gaps with existing APIs | User | DONE (Design v1.3) |
| CR-001 | 2026-11-03 | All remark/reason fields and upload areas — designed now on EMP-014, EMP-016, EMP-018, EMP-019, WRK-004, WRK-007, SUP-005, new SHR-005; batch-2 screens (leave, correction, outdoor clarification, approvals, support) must follow the same rule | Add a **voice recording** option next to every upload / remark ("type or record"), e.g. expense and production work, because some users can't type | User | DONE in design (Design v1.1). Backend: existing for payment requests; **BACKEND_GAP** for production entries, attendance remark, leave/corrections/outdoor clarification, approval remarks, hand-back (G-14) |

## Design decisions — answered by the user 2026-11-03

| Id | Answer |
|---|---|
| D-D03 | Keep both punch styles (round on Home, In/Out pair on Attendance) — as designed |
| D-D04 | Yes, expense requests for workers / supervisors / warehouse users (role change B-23) |
| D-D05 | Contractor app: later release |
| D-D06 | Yes, supervisors get team attendance + HR approvals (role change B-23) |
| D-D07 | Admin users/roles: view only on mobile |
| D-D08 | Bottom-nav label: Alerts — as designed |
| D-D09 | Release 1 = Login + Attendance |
| D-D10 | Voice notes only where the ERP already stores them |

No screen changes were needed for these answers.
