# HR Manager

Who: MANAGEMENT, SUPER_ADMIN, HRMS team approvers (no HR role exists). Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| HR-001 | [HR Home](HR-001-hr-home/screen-spec.md) | READY_FOR_REVIEW | `hrms_attendance_team.view; hrms_leave.approve; hrms_attendance_outdoor.approve` | [png](HR-001-hr-home/screen.png) |
| HR-002 | [Company attendance (day / month)](HR-002-company-attendance-day-month/screen-spec.md) | READY_FOR_REVIEW | `hrms_attendance_team.view / hrms_attendance_records.view (+view_all)` | [png](HR-002-company-attendance-day-month/screen.png) |
| HR-003 | [Leave approvals](HR-003-leave-approvals/screen-spec.md) | READY_FOR_REVIEW | `hrms_leave.approve / reject (team scope, no self-approval)` | [png](HR-003-leave-approvals/screen.png) |
| HR-004 | [Correction (regularization) approvals](HR-004-correction-regularization-approvals/screen-spec.md) | READY_FOR_REVIEW | `hrms_attendance_regularization.approve / reject` | [png](HR-004-correction-regularization-approvals/screen.png) |
| HR-005 | [Outside / flagged punch review](HR-005-outside-flagged-punch-review/screen-spec.md) | READY_FOR_REVIEW | `hrms_attendance_outdoor.approve / reject` | [png](HR-005-outside-flagged-punch-review/screen.png) |
| HR-006 | [Overtime approvals](HR-006-overtime-approvals/screen-spec.md) | READY_FOR_REVIEW | `hrms_attendance_overtime.approve / reject` | [png](HR-006-overtime-approvals/screen.png) |
| HR-007 | [Employee directory](HR-007-employee-directory/screen-spec.md) | READY_FOR_REVIEW | `masters_core.view` | [png](HR-007-employee-directory/screen.png) |

