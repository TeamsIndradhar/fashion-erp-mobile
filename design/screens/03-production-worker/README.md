# Production Worker

Who: PRODUCTION_WORKER and any assigned-only production user. Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| WRK-001 | [Worker Home](WRK-001-worker-home/screen-spec.md) | READY_FOR_REVIEW | `production.view (assigned scope) + hrms_attendance.view` | [png](WRK-001-worker-home/screen.png) |
| WRK-002 | [My Assigned Work (list)](WRK-002-my-assigned-work-list/screen-spec.md) | READY_FOR_REVIEW | `production.view; Employee.selfEntryEnabled` | [png](WRK-002-my-assigned-work-list/screen.png) |
| WRK-003 | [Task / job order details](WRK-003-task-job-order-details/screen-spec.md) | READY_FOR_REVIEW | `production.view (own assignment rows only)` | [png](WRK-003-task-job-order-details/screen.png) |
| WRK-004 | [Submit production progress](WRK-004-submit-production-progress/screen-spec.md) | READY_FOR_REVIEW | `production.view + self-entry guards (linked employee, selfEntryEnabled, real assignment, work skill)` | [png](WRK-004-submit-production-progress/screen.png) |
| WRK-005 | [Submission confirmation](WRK-005-submission-confirmation/screen-spec.md) | READY_FOR_REVIEW | `production.view` | [png](WRK-005-submission-confirmation/screen.png) |
| WRK-006 | [My submissions / work history](WRK-006-my-submissions-work-history/screen-spec.md) | READY_FOR_REVIEW | `production.view` | [png](WRK-006-my-submissions-work-history/screen.png) |
| WRK-007 | [Hand back pieces](WRK-007-hand-back-pieces/screen-spec.md) | READY_FOR_REVIEW | `production.view (own assignment)` | [png](WRK-007-hand-back-pieces/screen.png) |
| WRK-008 | [Assigned lot details](WRK-008-assigned-lot-details/screen-spec.md) | READY_FOR_REVIEW | `production.view (assertLotInScope)` | [png](WRK-008-assigned-lot-details/screen.png) |
| WRK-009 | [My piece-rate earnings](WRK-009-my-piece-rate-earnings/screen-spec.md) | READY_FOR_REVIEW | `piece_rate.view + ProductionSettings.workersCanViewOwnRate` | [png](WRK-009-my-piece-rate-earnings/screen.png) |
| WRK-010 | [Self-entry not enabled](WRK-010-self-entry-not-enabled/screen-spec.md) | READY_FOR_REVIEW | `—` | [png](WRK-010-self-entry-not-enabled/screen.png) |

