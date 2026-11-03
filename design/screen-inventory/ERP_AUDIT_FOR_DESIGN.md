# ERP audit for the mobile design (2026-11-03, read-only)

Source repo: `fashion-erp` (audited at worktree `.claude/worktrees/admiring-pare-a03ffd`, base `fa45e745`). Paths are in the ERP repo.

## 1. Roles (15) — `src/config/rbac.ts` L147–169

| ERP role | Design category it maps to | Notes |
|---|---|---|
| SUPER_ADMIN | Company Admin **and** Company Owner | Every module × every action (seeded rows, no bypass). First user of a new company gets it. Only role exempt from the self-approval guard. |
| MANAGEMENT | Company Owner / Admin (read + approve) | View/export/approve across modules; administration view only |
| MERCHANDISER | Sales Manager (+ sampling, CRM) | self-service HRMS; payment_requests view/create |
| SAMPLING_MANAGER | Production Manager (sampling) | team approver |
| PRODUCTION_MANAGER | Production Manager | team approver; production full; piece_rate approve; payment_requests create |
| PRODUCTION_SUPERVISOR | Supervisor | self-service HRMS; production view/view_all/create/edit/approve; qc create; piece_rate create |
| PRODUCTION_WORKER | Production Worker | self-service HRMS; dashboard, production, piece_rate **view only** |
| EXTERNAL_UNIT_USER | External unit (contractor) — **not in the brief** | dashboard + production view/create only; no HRMS; scoped to own contractor |
| QC_MANAGER | Production Manager (QC) | qc full |
| STORE_MANAGER | Inventory Manager **and** Purchase Manager | inventory full; purchase_order approve |
| ACCOUNTS_MANAGER | Accountant | accounts/invoices/payments/expenses/payment_requests full; salary approve/post |
| ACCOUNTS_EXECUTIVE | Accountant (executive) | creates/edits, no approve |
| DISPATCH_MANAGER | Dispatch Manager | dispatch full |
| WAREHOUSE_USER | Inventory (operator) | inventory/fg/dispatch view/create/edit |
| VIEWER | Read-only | view on all modules |

**There is no "Company Owner", "Company Admin" or "HR Manager" role.** HR work today = MANAGEMENT or SUPER_ADMIN (or a custom role). Roles are **per company and customizable** (`Role.companyId`, `role-admin.service.ts`), users may have **per-user GRANT/DENY overrides** (`UserPermissionOverride`, DENY wins) and roles per branch (`UserBranchRole`). ⇒ The app must decide visibility from **permission keys**, never from role names (the categories below are design scenarios only).

Helper groups: `HRMS_SELF_SERVICE` (attendance view/create, regularization view/create, leave view/create, leave balances view, salary history view, salary advance view/create) → MERCHANDISER, PRODUCTION_SUPERVISOR, PRODUCTION_WORKER, ACCOUNTS_EXECUTIVE, WAREHOUSE_USER. `HRMS_TEAM_APPROVER` (+ team/records/photos view, regularization/outdoor/overtime/leave approve-reject) → SAMPLING_MANAGER, PRODUCTION_MANAGER, QC_MANAGER, STORE_MANAGER, ACCOUNTS_MANAGER, DISPATCH_MANAGER.

**Expense requests:** the brief wants every employee to submit expense requests "if permission permits". By default `payment_requests.create` is held only by MERCHANDISER, PRODUCTION_MANAGER, STORE_MANAGER, ACCOUNTS_MANAGER, ACCOUNTS_EXECUTIVE, DISPATCH_MANAGER (+ SUPER_ADMIN). **PRODUCTION_WORKER, PRODUCTION_SUPERVISOR and WAREHOUSE_USER cannot create them today.** Every employee can request a **salary advance** (`hrms_salary_advance.create`). → Decision D-D04.

## 2. Modules (59) and actions (14)

Actions: view, create, edit, delete, approve, reject, post, cancel, export, print, override, scan, view_all.
Packages (per-company on/off, `src/config/module-entitlements.ts`): SAMPLING, PRODUCTION, PURCHASING, INVENTORY, DISPATCH, ACCOUNTS, CRM, MARKETING, HRMS, BARCODES, AI_GARMENT_FLOW, AI_DESIGNER, REPORTS; always-on core: dashboard, masters_core, masters_finance, sales_orders, administration_users/roles/settings.

## 3. Web pages (sidebar, `src/components/layout/navigation.ts` L56–253)

Dashboard · AI Garment Flow (3) · AI Designer (2) · Masters · CRM (16 pages) · Marketing (2) · HRMS (17 pages: My Attendance, Team Attendance, Monthly Records, Regularization, Outdoor Punches, Overtime, Punch Photos, Salary Sheet, Attendance Settings, Leave Requests, Leave Balances, Leave Types, Salary Setup, Manage Attendance, Generate Salary, Salary History, Advance Salary) · Merchandising (Buyer Enquiries, Sampling) · Sales Orders · Purchase (Purchase Orders, Goods Receipts) · Manufacturing (BOM/MRP, Production, Job Work Orders, **My Work**, Pending Approvals) · Inventory (Stock Balance, Stock Movements, Receive Transfers, Material Requests, FG Dashboard, Stock List, Receive Goods, Receipts, Unlocated Stock) · Accounts (incl. Payment Requests) · Dispatch · Barcodes (Scanner, Customer Returns, Barcode Management) · Reports · Administration · Help & Support.

## 4. Data sources for dashboards

- Web dashboard is server-rendered, **no API route**. Team view (team size, present today, active job orders, pending leave) via hierarchy; company counts; payment-request tiles (**company-wide, not permission-gated — do not copy to mobile as is**).
- KPIs: report `dashboard/executive-dashboard` (sales today/month/year, orders, purchase, pending POs, stock value, low stock, planned/completed qty, achievement %, rejection %, dispatch, revenue, AR, AP, expenses) and `mis/daily-mis` — via `GET /api/v1/reports/{category}/{key}`; rows are **pre-formatted strings** (e.g. "₹1,234.00"), permission `reports.view` (+ owning module).
- 87 registered reports, one generic route; full row sets, no real paging.
- Lists with `{data, meta}` + `page/pageSize/search`: production-orders, job-work-orders, stock-balances, FG stock-list, stock-movements, purchase-orders, goods-receipts, sales-orders, customers, crm/leads, sales-invoices, payments, expenses, payment-requests (+ `/summary`), dispatches, employees, leave-requests (`mine=true`), attendance (`/summary`, `/team-day`).

## 5. Backend gaps found (all `BACKEND_GAP — APPROVAL_REQUIRED`)

| Id | Gap | Screens affected |
|---|---|---|
| G-01 | No `GET /me` (profile + permission keys + viewable modules + nav) — `PermissionService.getViewableModules` exists server-side only | every home / navigation |
| G-02 | No mobile bearer auth (designed in `docs/03`) | all |
| G-03 | No numeric KPI endpoint; executive-dashboard / daily-MIS return formatted strings | owner, admin, manager homes |
| G-04 | No cross-module "pending approvals" count/list | admin, owner, manager homes |
| G-05 | No company-wide job-order list; no lot list | production manager |
| G-06 | No QC inspection list / QC-pending count | production manager (QC) |
| G-07 | No "pending GRN" status (closest: pending-purchase-order report) | inventory/purchase |
| G-08 | Dashboard data (team view, company counts) has no API | supervisor/admin homes |
| G-09 | Expense-request permission not granted to workers/supervisors by default (role config decision, not code) | employee expense screens |

## 6. Self-service, worker and supervisor APIs (audit 3)

| Area | Existing routes (ERP `src/app/api/v1/...`) | Permission | Scope |
|---|---|---|---|
| Worker — my assignments | `GET job-orders/my-assignments` | production.view | own assignments only; needs linked employee **and** `Employee.selfEntryEnabled`; stage-limited |
| Worker — submit progress | `POST job-orders/{id}/self-progress` `{completedQuantity, rejectedQuantity, damagedQuantity, extraQuantity, remarks}` → entry `PENDING` | production.view + service guards (assignment, work skill, capacity) | own assignment only |
| Worker — my submissions | `GET job-order-progress-entries/mine` (approvalStatus, approvalRemark) | production.view | own |
| Worker — hand back | `POST job-order-assignments/{id}/handback` `{quantity, reason}`; `GET job-orders/{id}/handbacks` | production.view | own |
| Slips | `GET/POST job-orders/{id}/slips` (jpeg/png/webp/heic/pdf) | production.view | job order in scope |
| Job order / lot detail | `GET job-orders/{id}`, `GET lots/{id}` | production.view | assigned-only users see own rows |
| Piece-rate earnings | `GET piece-rate-earnings` | piece_rate.view | own only, and only if `ProductionSettings.workersCanViewOwnRate` |
| Supervisor approvals | `GET job-order-progress-entries/pending`, `PATCH .../{id}`, `POST .../{id}/approve` `{approvalRemark?}`, `POST .../{id}/reject` (remark required) | production.approve (no self-approval) | branch + stage + team |
| Team attendance | `GET attendance/team-day`, `GET attendance/team-month` | hrms_attendance_team.view / hrms_attendance_records.view | HRMS team (**PRODUCTION_SUPERVISOR does not hold these by default**) |
| HR approvals | leave `POST leave-requests/{id}/approve|reject`; regularization `attendance-corrections/{id}/approve|reject`; outdoor `GET/POST attendance/outdoor`, `attendance/outdoor/{sessionId}/reject`; overtime `attendance/overtime/{id}/approve|reject` | hrms_* approve/reject | team, no self-approval |
| Payment requests | `GET payment-requests?view=mine|approve|pay&status&group`, `POST payment-requests`, `GET/PATCH payment-requests/{id}`, `POST .../{id}/cancel|approve|reject`, `POST .../{id}/payouts`, `GET payment-requests/summary` | payment_requests.* | own unless view_all/approve/post; `view=approve` = current-level approver |
| Salary advance | `GET/POST salary/advances`, `POST salary/advances/{id}/cancel` | hrms_salary_advance.view/create (**all self-service roles**) | own; one open advance at a time; creates a `SALARY_ADVANCE` payment request |
| Leave | `GET/POST leave-requests?mine=true`, `GET leave-requests/balance`, `GET leave-balances?mine` | hrms_leave.* | own / team |
| Regularization | `GET/POST attendance-corrections?mine`, documents | hrms_attendance_regularization.* | own / team |
| Outdoor rejection (employee side) | `GET attendance/outdoor-rejections?mine=true`, `POST .../{id}/accept|clarify` | hrms_attendance.view | own |
| Salary slips | `GET salary/history?year`, `GET salary/history/slips/{lineId}/pdf`, `PUT salary/history/lines/{lineId}/response` | hrms_salary_history.view | own only |
| Notifications | `GET notifications?unreadOnly`, `PATCH notifications/{id}/read`, `POST notifications/mark-all-read` → `{data, meta:{unreadCount}}` | session only | own; in-app only, no push; production self-entry decisions create **no** notification |
| Support | `/support-tickets` (web page for every user) | session | own |

Additional gaps: G-10 no push notifications (needs a push-token table + sender); G-11 no notification for production entry approve/reject; G-12 employee advances & expenses have no "own" scope (accountant tools only); G-13 `employeeId` not in session (services look it up — fine for the adapter).

## 7. Voice notes (CR-001, 2026-11-03)

- **Existing:** shared record-attachments API `GET/POST /api/v1/record-attachments/{module}/{recordId}` (files + voice notes, max 10 files per upload) — `fashion-erp/src/app/api/v1/record-attachments/[module]/[recordId]/route.ts`, targets in `src/core/attachments/attachment-targets.ts`. File storage accepts `audio/webm, ogg, mpeg, mp4, x-m4a, wav, x-wav, aac` (`src/core/file-storage/FileStorage.ts:23-31`). Web recorder `src/components/ui/VoiceRecorder.tsx` (default max 300 s).
- **Voice-enabled targets today:** EXPENSE, EXPENSE_PAYMENT, EMPLOYEE_ADVANCE, EMPLOYEE_ADVANCE_SETTLEMENT, INTERNAL_TRANSFER, **PAYMENT_REQUEST**, SUPPLIER_CREDIT_NOTE, PAYMENT.
- **G-14 (BACKEND_GAP — APPROVAL_REQUIRED):** no attachment target for production progress entries / job-order hand-backs, attendance day remark, leave requests (`LEAVE_REQUEST` enum value exists, no target), attendance corrections (`ATTENDANCE_CORRECTION` exists, own documents route — audio support unverified), outdoor clarification proof (image/PDF only), approval/reject remarks, support tickets (unverified). The ERP design makes adding a target small: "a module added here gets file upload, voice recording, preview and delete for free" (comment in `attachment-targets.ts`) — each still needs its own scope rule (e.g. worker sees only own entries).
- **Mobile:** recording needs the **microphone permission** (Android `RECORD_AUDIO`, iOS `NSMicrophoneUsageDescription`), asked only when the user first taps record.
