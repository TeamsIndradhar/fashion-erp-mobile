# Common Employee

Who: Every employee with HRMS self-service (most roles). Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| EMP-001 | [Employee Home](EMP-001-employee-home/screen-spec.md) | APPROVED | `hrms_attendance.view (attendance card); shortcuts per permission` | [png](EMP-001-employee-home/screen.png) |
| EMP-002 | [Attendance Dashboard](EMP-002-attendance-dashboard/screen-spec.md) | APPROVED | `hrms_attendance.view; punch needs hrms_attendance.create` | [png](EMP-002-attendance-dashboard/screen.png) |
| EMP-003 | [Location permission](EMP-003-location-permission/screen-spec.md) | APPROVED | `hrms_attendance.create` | [png](EMP-003-location-permission/screen.png) |
| EMP-004 | [GPS verification (weak GPS)](EMP-004-gps-verification-weak-gps/screen-spec.md) | APPROVED | `hrms_attendance.create` | [png](EMP-004-gps-verification-weak-gps/screen.png) |
| EMP-005 | [Punch – selfie](EMP-005-punch-selfie/screen-spec.md) | APPROVED | `hrms_attendance.create` | [png](EMP-005-punch-selfie/screen.png) |
| EMP-006 | [Punch In confirmation](EMP-006-punch-in-confirmation/screen-spec.md) | APPROVED | `hrms_attendance.create` | [png](EMP-006-punch-in-confirmation/screen.png) |
| EMP-007 | [Punch success](EMP-007-punch-success/screen-spec.md) | APPROVED | `hrms_attendance.create` | [png](EMP-007-punch-success/screen.png) |
| EMP-008 | [Punch Out confirmation](EMP-008-punch-out-confirmation/screen-spec.md) | APPROVED | `hrms_attendance.create` | [png](EMP-008-punch-out-confirmation/screen.png) |
| EMP-009 | [Punch sent for review (suspicious / outside)](EMP-009-punch-sent-for-review-suspicious-outside/screen-spec.md) | APPROVED | `hrms_attendance.create` | [png](EMP-009-punch-sent-for-review-suspicious-outside/screen.png) |
| EMP-010 | [Security warning (blocked / phone not allowed)](EMP-010-security-warning-blocked-phone-not-allowed/screen-spec.md) | APPROVED | `hrms_attendance.create` | [png](EMP-010-security-warning-blocked-phone-not-allowed/screen.png) |
| EMP-011 | [Attendance monthly report](EMP-011-attendance-monthly-report/screen-spec.md) | APPROVED | `hrms_attendance.view` | [png](EMP-011-attendance-monthly-report/screen.png) |
| EMP-012 | [Attendance history (day list)](EMP-012-attendance-history-day-list/screen-spec.md) | APPROVED | `hrms_attendance.view` | [png](EMP-012-attendance-history-day-list/screen.png) |
| EMP-013 | [Attendance day details](EMP-013-attendance-day-details/screen-spec.md) | APPROVED | `hrms_attendance.view` | [png](EMP-013-attendance-day-details/screen.png) |
| EMP-014 | [Add attendance remark](EMP-014-add-attendance-remark/screen-spec.md) | APPROVED | `hrms_attendance.create` | [png](EMP-014-add-attendance-remark/screen.png) |
| EMP-015 | [My Requests (hub)](EMP-015-my-requests-hub/screen-spec.md) | READY_FOR_REVIEW | `per item: payment_requests.create · hrms_salary_advance.create · hrms_leave.create · hrms_attendance_regularization.create` | [png](EMP-015-my-requests-hub/screen.png) |
| EMP-016 | [Expense request form](EMP-016-expense-request-form/screen-spec.md) | READY_FOR_REVIEW | `payment_requests.create` | [png](EMP-016-expense-request-form/screen.png) |
| EMP-017 | [My expense requests (history)](EMP-017-my-expense-requests-history/screen-spec.md) | READY_FOR_REVIEW | `payment_requests.view (own unless view_all)` | [png](EMP-017-my-expense-requests-history/screen.png) |
| EMP-018 | [Expense request details / status](EMP-018-expense-request-details-status/screen-spec.md) | READY_FOR_REVIEW | `payment_requests.view; cancel = own + create` | [png](EMP-018-expense-request-details-status/screen.png) |
| EMP-019 | [Salary advance request](EMP-019-salary-advance-request/screen-spec.md) | READY_FOR_REVIEW | `hrms_salary_advance.create (all self-service roles)` | [png](EMP-019-salary-advance-request/screen.png) |
| EMP-020 | [Notifications](EMP-020-notifications/screen-spec.md) | APPROVED | `session (own only)` | [png](EMP-020-notifications/screen.png) |
| EMP-021 | [Notification details](EMP-021-notification-details/screen-spec.md) | APPROVED | `session; target record needs its own permission` | [png](EMP-021-notification-details/screen.png) |
| EMP-022 | [My Profile](EMP-022-my-profile/screen-spec.md) | APPROVED | `session` | [png](EMP-022-my-profile/screen.png) |
| EMP-023 | [Change password](EMP-023-change-password/screen-spec.md) | APPROVED | `session` | [png](EMP-023-change-password/screen.png) |
| EMP-024 | [Settings](EMP-024-settings/screen-spec.md) | APPROVED | `session` | [png](EMP-024-settings/screen.png) |
| EMP-025 | [My devices](EMP-025-my-devices/screen-spec.md) | APPROVED | `session (own devices)` | [png](EMP-025-my-devices/screen.png) |
| EMP-026 | [Help & Support](EMP-026-help-support/screen-spec.md) | APPROVED | `session` | [png](EMP-026-help-support/screen.png) |
| EMP-027 | [About app](EMP-027-about-app/screen-spec.md) | APPROVED | `none` | [png](EMP-027-about-app/screen.png) |
| EMP-028 | [Leave request form + my leave](EMP-028-leave-request-form-my-leave/screen-spec.md) | READY_FOR_REVIEW | `hrms_leave.view / create` | [png](EMP-028-leave-request-form-my-leave/screen.png) |
| EMP-029 | [Attendance correction request](EMP-029-attendance-correction-request/screen-spec.md) | READY_FOR_REVIEW | `hrms_attendance_regularization.create` | [png](EMP-029-attendance-correction-request/screen.png) |
| EMP-030 | [My salary slips](EMP-030-my-salary-slips/screen-spec.md) | READY_FOR_REVIEW | `hrms_salary_history.view (own only)` | [png](EMP-030-my-salary-slips/screen.png) |
| EMP-031 | [Outside punch rejected — accept or clarify](EMP-031-outside-punch-rejected-accept-or-clarify/screen-spec.md) | READY_FOR_REVIEW | `hrms_attendance.view` | [png](EMP-031-outside-punch-rejected-accept-or-clarify/screen.png) |

