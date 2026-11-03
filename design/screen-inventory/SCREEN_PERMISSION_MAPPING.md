# Screen → permission mapping (Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03)

Permission keys are `module.action` from `fashion-erp/src/config/rbac.ts`. A screen is shown when the user holds the key **and** the company entitlement is on (`module-entitlements.ts`). Roles are listed only as examples of who holds the key by default — roles are per company and customizable, and per-user GRANT/DENY overrides exist, so the app must use the keys from `GET /api/mobile/v1/me` (gap G-01), never role names.

| Screen | Title | Required permission | Default roles holding it |
|---|---|---|---|
| AUTH-001 | Splash | `none (public)` | All tenant users |
| AUTH-002 | Login | `none (public)` | All tenant users |
| AUTH-003 | Login – loading / invalid credentials | `none` | All tenant users |
| AUTH-004 | Login – too many attempts | `none` | All tenant users |
| AUTH-005 | Forgot password (info) | `none` | All tenant users |
| AUTH-006 | Set your own password (temporary password) | `session with mustChangePassword` | All tenant users |
| AUTH-007 | Session expired | `—` | All tenant users |
| AUTH-008 | Logout confirmation | `session` | All tenant users |
| AUTH-009 | Verifying this phone (device registration) | `session` | All tenant users |
| AUTH-010 | Update required | `none` | All tenant users |
| AUTH-011 | Account / company suspended | `—` | All tenant users |
| EMP-001 | Employee Home | `hrms_attendance.view (attendance card); shortcuts per permission` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-002 | Attendance Dashboard | `hrms_attendance.view; punch needs hrms_attendance.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-003 | Location permission | `hrms_attendance.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-004 | GPS verification (weak GPS) | `hrms_attendance.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-005 | Punch – selfie | `hrms_attendance.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-006 | Punch In confirmation | `hrms_attendance.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-007 | Punch success | `hrms_attendance.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-008 | Punch Out confirmation | `hrms_attendance.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-009 | Punch sent for review (suspicious / outside) | `hrms_attendance.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-010 | Security warning (blocked / phone not allowed) | `hrms_attendance.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-011 | Attendance monthly report | `hrms_attendance.view` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-012 | Attendance history (day list) | `hrms_attendance.view` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-013 | Attendance day details | `hrms_attendance.view` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-014 | Add attendance remark | `hrms_attendance.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-015 | My Requests (hub) | `per item: payment_requests.create · hrms_salary_advance.create · hrms_leave.create · hrms_attendance_regularization.create` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-016 | Expense request form | `payment_requests.create` | roles with payment_requests.create (MERCHANDISER, PRODUCTION_MANAGER, STORE_MANAGER, ACCOUNTS_*, DISPATCH_MANAGER, SUPER_ADMIN) |
| EMP-017 | My expense requests (history) | `payment_requests.view (own unless view_all)` | roles with payment_requests.view |
| EMP-018 | Expense request details / status | `payment_requests.view; cancel = own + create` | roles with payment_requests.view |
| EMP-019 | Salary advance request | `hrms_salary_advance.create (all self-service roles)` | MERCHANDISER; PRODUCTION_SUPERVISOR; PRODUCTION_WORKER; ACCOUNTS_EXECUTIVE; WAREHOUSE_USER; + HRMS_TEAM_APPROVER roles; MANAGEMENT; SUPER_ADMIN |
| EMP-020 | Notifications | `session (own only)` | All tenant users |
| EMP-021 | Notification details | `session; target record needs its own permission` | All tenant users |
| EMP-022 | My Profile | `session` | All tenant users |
| EMP-023 | Change password | `session` | All tenant users |
| EMP-024 | Settings | `session` | All tenant users |
| EMP-025 | My devices | `session (own devices)` | All tenant users |
| EMP-026 | Help & Support | `session` | All tenant users |
| EMP-027 | About app | `none` | All tenant users |
| EMP-028 | Leave request form + my leave | `hrms_leave.create` | HRMS_SELF_SERVICE roles |
| EMP-029 | Attendance correction request | `hrms_attendance_regularization.create` | HRMS_SELF_SERVICE roles |
| EMP-030 | My salary slips | `hrms_salary_history.view` | HRMS_SELF_SERVICE roles |
| EMP-031 | Outside-punch rejection: accept / clarify | `hrms_attendance.view` | HRMS_SELF_SERVICE roles |
| WRK-001 | Worker Home | `production.view (assigned scope) + hrms_attendance.view` | PRODUCTION_WORKER; any role with production.view but without view_all (assigned-only scope) |
| WRK-002 | My Assigned Work (list) | `production.view; Employee.selfEntryEnabled` | PRODUCTION_WORKER; any role with production.view but without view_all (assigned-only scope) |
| WRK-003 | Task / job order details | `production.view (own assignment rows only)` | PRODUCTION_WORKER; any role with production.view but without view_all (assigned-only scope) |
| WRK-004 | Submit production progress | `production.view + self-entry guards (linked employee, selfEntryEnabled, real assignment, work skill)` | PRODUCTION_WORKER; any role with production.view but without view_all (assigned-only scope) |
| WRK-005 | Submission confirmation | `production.view` | PRODUCTION_WORKER; any role with production.view but without view_all (assigned-only scope) |
| WRK-006 | My submissions / work history | `production.view` | PRODUCTION_WORKER; any role with production.view but without view_all (assigned-only scope) |
| WRK-007 | Hand back pieces | `production.view (own assignment)` | PRODUCTION_WORKER; any role with production.view but without view_all (assigned-only scope) |
| WRK-008 | Assigned lot details | `production.view (assertLotInScope)` | PRODUCTION_WORKER; any role with production.view but without view_all (assigned-only scope) |
| WRK-009 | My piece-rate earnings | `piece_rate.view + ProductionSettings.workersCanViewOwnRate` | PRODUCTION_WORKER; any role with production.view but without view_all (assigned-only scope) |
| WRK-010 | Self-entry not enabled | `—` | PRODUCTION_WORKER; any role with production.view but without view_all (assigned-only scope) |
| SUP-001 | Supervisor Home | `production.approve (approvals card); hrms_attendance_team.view (team attendance card, not held by PRODUCTION_SUPERVISOR by default)` | PRODUCTION_SUPERVISOR; PRODUCTION_MANAGER; SUPER_ADMIN (production.approve) |
| SUP-002 | Team attendance today | `hrms_attendance_team.view` | roles with hrms_attendance_team.view (HRMS_TEAM_APPROVER roles, MANAGEMENT) |
| SUP-003 | Team member details | `hrms_attendance_records.view (team scope)` | roles with hrms_attendance_records.view |
| SUP-004 | Pending production approvals | `production.approve (branch + stage + team scope)` | PRODUCTION_SUPERVISOR; PRODUCTION_MANAGER; SUPER_ADMIN (production.approve) |
| SUP-005 | Approve / reject progress entry | `production.approve (no self-approval)` | PRODUCTION_SUPERVISOR; PRODUCTION_MANAGER; SUPER_ADMIN (production.approve) |
| SUP-006 | Team work status | `production.view (view_all or team)` | PRODUCTION_SUPERVISOR; PRODUCTION_MANAGER; SUPER_ADMIN (production.approve) |
| SUP-007 | Team reports | `reports.view + production.view` | roles with reports.view + production.view |
| EXT-001 | External unit (contractor) home | `production.view/create (own contractor)` | EXTERNAL_UNIT_USER |
| PM-001 | Production Manager Home | `production.view (+view_all); reports.view for KPIs` | PRODUCTION_MANAGER; QC_MANAGER (QC parts); SAMPLING_MANAGER (view); MANAGEMENT; SUPER_ADMIN |
| PM-002 | Production orders (list) | `production.view` | PRODUCTION_MANAGER; QC_MANAGER (QC parts); SAMPLING_MANAGER (view); MANAGEMENT; SUPER_ADMIN |
| PM-003 | Production order details | `production.view; actions per production.edit/approve/cancel` | PRODUCTION_MANAGER; QC_MANAGER (QC parts); SAMPLING_MANAGER (view); MANAGEMENT; SUPER_ADMIN |
| PM-004 | Job order details (manager) | `production.view` | PRODUCTION_MANAGER; QC_MANAGER (QC parts); SAMPLING_MANAGER (view); MANAGEMENT; SUPER_ADMIN |
| PM-005 | Job work orders (contractor) | `production.view` | PRODUCTION_MANAGER; QC_MANAGER (QC parts); SAMPLING_MANAGER (view); MANAGEMENT; SUPER_ADMIN |
| PM-006 | QC inspections | `qc.view` | QC_MANAGER |
| PM-007 | Lot list / lot timeline | `production.view` | PRODUCTION_MANAGER; QC_MANAGER (QC parts); SAMPLING_MANAGER (view); MANAGEMENT; SUPER_ADMIN |
| PM-008 | Sampling list & detail | `sampling.view` | SAMPLING_MANAGER; MERCHANDISER |
| INV-001 | Inventory Home | `inventory.view / fg_inventory.view / material_request.view` | STORE_MANAGER; WAREHOUSE_USER; MANAGEMENT; SUPER_ADMIN |
| INV-002 | Stock balance (list) | `inventory.view` | STORE_MANAGER; WAREHOUSE_USER; MANAGEMENT; SUPER_ADMIN |
| INV-003 | Stock item ledger | `inventory.view` | STORE_MANAGER; WAREHOUSE_USER; MANAGEMENT; SUPER_ADMIN |
| INV-004 | Material requests list / issue | `material_request.view/edit` | STORE_MANAGER; WAREHOUSE_USER; MANAGEMENT; SUPER_ADMIN |
| INV-005 | FG stock list | `fg_inventory.view` | STORE_MANAGER; WAREHOUSE_USER; MANAGEMENT; SUPER_ADMIN |
| INV-006 | Stock movements / receive transfers | `inventory.view/create` | STORE_MANAGER; WAREHOUSE_USER; MANAGEMENT; SUPER_ADMIN |
| INV-007 | Barcode scanner | `barcodes.scan` | STORE_MANAGER; WAREHOUSE_USER; MANAGEMENT; SUPER_ADMIN |
| PUR-001 | Purchase Home | `purchase_order.view` | STORE_MANAGER (purchase_order approve); PRODUCTION_MANAGER / WAREHOUSE_USER (create); ACCOUNTS_MANAGER / MANAGEMENT (approve); SUPER_ADMIN |
| PUR-002 | Purchase orders (list) | `purchase_order.view; approve button needs purchase_order.approve` | STORE_MANAGER (purchase_order approve); PRODUCTION_MANAGER / WAREHOUSE_USER (create); ACCOUNTS_MANAGER / MANAGEMENT (approve); SUPER_ADMIN |
| PUR-003 | PO details + approve | `purchase_order.view/approve` | STORE_MANAGER (purchase_order approve); PRODUCTION_MANAGER / WAREHOUSE_USER (create); ACCOUNTS_MANAGER / MANAGEMENT (approve); SUPER_ADMIN |
| PUR-004 | Goods receipts list | `inventory.view` | STORE_MANAGER (purchase_order approve); PRODUCTION_MANAGER / WAREHOUSE_USER (create); ACCOUNTS_MANAGER / MANAGEMENT (approve); SUPER_ADMIN |
| SAL-001 | Sales Home | `sales_orders.view; crm.view; sampling.view` | MERCHANDISER; MANAGEMENT; SUPER_ADMIN |
| SAL-002 | Sales orders (list) | `sales_orders.view` | MERCHANDISER; MANAGEMENT; SUPER_ADMIN |
| SAL-003 | Sales order details | `sales_orders.view` | MERCHANDISER; MANAGEMENT; SUPER_ADMIN |
| SAL-004 | CRM leads list / lead details | `crm.view` | MERCHANDISER; MANAGEMENT; SUPER_ADMIN |
| SAL-005 | Customers list | `masters_core.view` | MERCHANDISER; MANAGEMENT; SUPER_ADMIN |
| SAL-006 | Buyer enquiries | `buyer_enquiries.view` | MERCHANDISER; MANAGEMENT; SUPER_ADMIN |
| ACC-001 | Accounts Home | `payment_requests.view (+approve/post); financial_reports.view for AR/AP` | ACCOUNTS_MANAGER; ACCOUNTS_EXECUTIVE (no approve); MANAGEMENT; SUPER_ADMIN |
| ACC-002 | Payment request approval inbox | `payment_requests.approve (no self-approval)` | roles with payment_requests.approve (current-level approver) |
| ACC-003 | Payout queue / pay request | `payment_requests.post` | ACCOUNTS_MANAGER; ACCOUNTS_EXECUTIVE (no approve); MANAGEMENT; SUPER_ADMIN |
| ACC-004 | Invoices list | `invoices.view` | ACCOUNTS_MANAGER; ACCOUNTS_EXECUTIVE (no approve); MANAGEMENT; SUPER_ADMIN |
| ACC-005 | Receivables / payables reports | `financial_reports.view + reports.view` | ACCOUNTS_MANAGER; ACCOUNTS_EXECUTIVE (no approve); MANAGEMENT; SUPER_ADMIN |
| HR-001 | HR Home | `hrms_attendance_team.view; hrms_leave.approve; hrms_attendance_outdoor.approve` | MANAGEMENT; SUPER_ADMIN; HRMS_TEAM_APPROVER roles (team scope); custom HR role (none exists today) |
| HR-002 | Company attendance (day / month) | `hrms_attendance_team.view / records.view` | MANAGEMENT; SUPER_ADMIN; HRMS_TEAM_APPROVER roles (team scope); custom HR role (none exists today) |
| HR-003 | Leave approvals | `hrms_leave.approve / reject (team scope, no self-approval)` | MANAGEMENT; SUPER_ADMIN; HRMS_TEAM_APPROVER roles (team scope); custom HR role (none exists today) |
| HR-004 | Regularization approvals | `hrms_attendance_regularization.approve` | MANAGEMENT; SUPER_ADMIN; HRMS_TEAM_APPROVER roles (team scope); custom HR role (none exists today) |
| HR-005 | Outside / flagged punch review | `hrms_attendance_outdoor.approve / reject` | MANAGEMENT; SUPER_ADMIN; HRMS_TEAM_APPROVER roles (team scope); custom HR role (none exists today) |
| HR-006 | Overtime approvals | `hrms_attendance_overtime.approve` | MANAGEMENT; SUPER_ADMIN; HRMS_TEAM_APPROVER roles (team scope); custom HR role (none exists today) |
| HR-007 | Employee directory | `masters_core.view` | MANAGEMENT; SUPER_ADMIN; HRMS_TEAM_APPROVER roles (team scope); custom HR role (none exists today) |
| DSP-001 | Dispatch Home | `dispatch.view` | DISPATCH_MANAGER; WAREHOUSE_USER; MANAGEMENT; SUPER_ADMIN |
| DSP-002 | Dispatch list & details | `dispatch.view` | DISPATCH_MANAGER; WAREHOUSE_USER; MANAGEMENT; SUPER_ADMIN |
| DSP-003 | Carton scan / packing | `dispatch.edit + barcodes.scan` | DISPATCH_MANAGER; WAREHOUSE_USER; MANAGEMENT; SUPER_ADMIN |
| ADM-001 | Company Admin Dashboard | `dashboard.view; each card needs its own module permission` | SUPER_ADMIN; MANAGEMENT (view/approve); users with administration_* permissions |
| ADM-002 | Pending approvals (all modules) | `approve on each module (shown per permission)` | SUPER_ADMIN; MANAGEMENT (view/approve); users with administration_* permissions |
| ADM-003 | Employee summary | `masters_core.view + hrms_attendance_team.view` | SUPER_ADMIN; MANAGEMENT (view/approve); users with administration_* permissions |
| ADM-004 | Users & roles (view) | `administration_users.view` | users with administration_users/roles.view |
| ADM-005 | Reports center | `reports.view + owning module` | any role with reports.view (+ owning module view) |
| ADM-006 | Report viewer (mobile) | `reports.view; export needs reports.export` | any role with reports.view |
| OWN-001 | Owner Dashboard | `reports.view + financial_reports.view (business cards); module views for others` | SUPER_ADMIN; MANAGEMENT; any role with financial_reports.view + reports.view |
| OWN-002 | Sales analytics | `reports.view + sales_orders.view / financial_reports.view` | SUPER_ADMIN; MANAGEMENT; any role with financial_reports.view + reports.view |
| OWN-003 | Production analytics | `reports.view + production.view` | SUPER_ADMIN; MANAGEMENT; any role with financial_reports.view + reports.view |
| OWN-004 | Inventory analytics | `reports.view + inventory.view` | SUPER_ADMIN; MANAGEMENT; any role with financial_reports.view + reports.view |
| OWN-005 | Financial summary | `financial_reports.view + reports.view` | SUPER_ADMIN; MANAGEMENT; any role with financial_reports.view + reports.view |
| OWN-006 | HRMS summary | `hrms_attendance_records.view` | SUPER_ADMIN; MANAGEMENT; any role with financial_reports.view + reports.view |
| OWN-007 | Alerts center | `per module` | SUPER_ADMIN; MANAGEMENT; any role with financial_reports.view + reports.view |
| SHR-001 | Component sheet | `—` | design reference |
| SHR-002 | All Modules (permission-driven) | `view on each module + entitlement` | every user (content depends on permissions) |
| SHR-003 | Standard states | `—` | all screens |
| SHR-004 | Module not enabled for company | `entitlement off → 403 MODULE_NOT_ENABLED` | all |
| SHR-005 | Voice note (record instead of typing) | `same as the record it is attached to; microphone permission on the phone` | every user, every remark / reason field and upload area |

