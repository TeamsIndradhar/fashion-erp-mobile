# Company Admin

Who: SUPER_ADMIN; MANAGEMENT (view/approve). Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| ADM-001 | [Company Admin Dashboard](ADM-001-company-admin-dashboard/screen-spec.md) | READY_FOR_REVIEW | `dashboard.view; each card needs its own module permission` | [png](ADM-001-company-admin-dashboard/screen.png) |
| ADM-002 | [Pending approvals (all modules)](ADM-002-pending-approvals-all-modules/screen-spec.md) | READY_FOR_REVIEW | `approve on each module (shown per permission)` | [png](ADM-002-pending-approvals-all-modules/screen.png) |
| ADM-003 | [Employee summary](ADM-003-employee-summary/screen-spec.md) | NOT_STARTED | `masters_core.view + hrms_attendance_team.view` | — |
| ADM-004 | [Users & roles (view)](ADM-004-users-roles-view/screen-spec.md) | NOT_STARTED | `administration_users.view` | — |
| ADM-005 | [Reports center](ADM-005-reports-center/screen-spec.md) | READY_FOR_REVIEW | `reports.view + owning module` | [png](ADM-005-reports-center/screen.png) |
| ADM-006 | [Report viewer (mobile)](ADM-006-report-viewer-mobile/screen-spec.md) | READY_FOR_REVIEW | `reports.view; export needs reports.export` | [png](ADM-006-report-viewer-mobile/screen.png) |

