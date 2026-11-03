# Supervisor / Team Leader

Who: PRODUCTION_SUPERVISOR; production approvers. Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| SUP-001 | [Supervisor Home](SUP-001-supervisor-home/screen-spec.md) | READY_FOR_REVIEW | `production.approve (approvals card); hrms_attendance_team.view (team attendance card, not held by PRODUCTION_SUPERVISOR by default)` | [png](SUP-001-supervisor-home/screen.png) |
| SUP-002 | [Team attendance today](SUP-002-team-attendance-today/screen-spec.md) | READY_FOR_REVIEW | `hrms_attendance_team.view` | [png](SUP-002-team-attendance-today/screen.png) |
| SUP-003 | [Team member details](SUP-003-team-member-details/screen-spec.md) | READY_FOR_REVIEW | `hrms_attendance_records.view (team scope)` | [png](SUP-003-team-member-details/screen.png) |
| SUP-004 | [Pending production approvals](SUP-004-pending-production-approvals/screen-spec.md) | READY_FOR_REVIEW | `production.approve (branch + stage + team scope)` | [png](SUP-004-pending-production-approvals/screen.png) |
| SUP-005 | [Approve / reject progress entry](SUP-005-approve-reject-progress-entry/screen-spec.md) | READY_FOR_REVIEW | `production.approve (no self-approval)` | [png](SUP-005-approve-reject-progress-entry/screen.png) |
| SUP-006 | [Team work status](SUP-006-team-work-status/screen-spec.md) | READY_FOR_REVIEW | `production.view (view_all or team)` | [png](SUP-006-team-work-status/screen.png) |
| SUP-007 | [Team reports](SUP-007-team-reports/screen-spec.md) | READY_FOR_REVIEW | `reports.view + production.view` | [png](SUP-007-team-reports/screen.png) |

