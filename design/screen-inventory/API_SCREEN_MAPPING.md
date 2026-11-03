# Screen → API mapping (Design v1.1 · Batch 1 (+CR-001 voice notes) · 2026-11-03)

Kinds: **E** existing ERP route reused through the mobile bearer adapter · **N** new thin mobile route already designed in `docs/05_API_CONTRACT.md` · **G** `BACKEND_GAP — APPROVAL_REQUIRED` (no fake responses will be built in its place).

| Screen | Endpoint | Kind |
|---|---|---|
| AUTH-001 | `GET /api/mobile/v1/app-config` | N |
| AUTH-001 | `POST /api/mobile/v1/auth/refresh` | N |
| AUTH-001 | `GET /api/mobile/v1/me` | N |
| AUTH-002 | `POST /api/mobile/v1/auth/login (calls existing authenticateTenantUser())` | N |
| AUTH-003 | `POST /api/mobile/v1/auth/login → 401 INVALID_LOGIN` | N |
| AUTH-004 | `Existing lockout (rateLimiter.ts, 5 tries / 15 min) via login adapter` | E |
| AUTH-005 | `none — ERP has no self-service reset (admin reset only)` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| AUTH-006 | `POST /api/v1/account/change-password (existing changeOwnPassword())` | E |
| AUTH-006 | `POST /api/mobile/v1/auth/login (re-sign-in with new password)` | N |
| AUTH-007 | `POST /api/mobile/v1/auth/refresh → 401` | N |
| AUTH-008 | `POST /api/mobile/v1/auth/logout` | N |
| AUTH-008 | `POST /api/mobile/v1/auth/logout-all` | N |
| AUTH-009 | `POST /api/mobile/v1/devices/register (Play Integrity / App Attest)` | N |
| AUTH-010 | `GET /api/mobile/v1/app-config → minAppVersion / 426` | N |
| AUTH-011 | `Existing live check → 403 ACCOUNT_SUSPENDED / PERMISSION_DENIED` | E |
| EMP-001 | `GET /api/mobile/v1/me` | N |
| EMP-001 | `GET /api/v1/attendance/me/today` | E |
| EMP-001 | `GET /api/v1/notifications?unreadOnly=true` | E |
| EMP-002 | `GET /api/v1/attendance/me/today` | E |
| EMP-002 | `GET /api/mobile/v1/attendance/locations` | N |
| EMP-003 | `none (OS permission)` | E |
| EMP-004 | `none (device GPS); limit from attendance/me/today rules.gpsAccuracyMeters` | E |
| EMP-005 | `camera only; face step per decision Q-01 (OPEN)` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| EMP-006 | `POST /api/mobile/v1/attendance/punch-challenge` | N |
| EMP-006 | `POST /api/mobile/v1/attendance/punch (calls existing punch())` | N |
| EMP-007 | `POST /api/mobile/v1/attendance/punch-challenge` | N |
| EMP-007 | `POST /api/mobile/v1/attendance/punch (calls existing punch())` | N |
| EMP-008 | `POST /api/mobile/v1/attendance/punch-challenge` | N |
| EMP-008 | `POST /api/mobile/v1/attendance/punch (calls existing punch())` | N |
| EMP-009 | `POST /api/mobile/v1/attendance/punch-challenge` | N |
| EMP-009 | `POST /api/mobile/v1/attendance/punch (calls existing punch())` | N |
| EMP-010 | `422 ATTENDANCE_BLOCKED_BY_RISK / 403 DEVICE_NOT_ALLOWED (new codes)` | N |
| EMP-011 | `GET /api/v1/attendance/me/month?month=YYYY-MM` | E |
| EMP-012 | `GET /api/v1/attendance/me/month?month=YYYY-MM` | E |
| EMP-013 | `GET /api/v1/attendance/me/day?date=YYYY-MM-DD` | E |
| EMP-013 | `GET /api/v1/attendance/sessions/{id}/selfie/{in\|out}` | E |
| EMP-014 | `PUT /api/v1/attendance/me/remark {date, remark}` | E |
| EMP-014 | `Voice note on attendance day remark — no attachment target yet (CR-001)` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| EMP-015 | `GET /api/v1/payment-requests?view=mine` | E |
| EMP-015 | `GET /api/v1/salary/advances` | E |
| EMP-015 | `GET /api/v1/leave-requests?mine=true` | E |
| EMP-015 | `GET /api/v1/attendance-corrections?mine=true` | E |
| EMP-016 | `POST /api/v1/payment-requests (existing; request type = Expenditure voucher)` | E |
| EMP-016 | `POST /api/v1/record-attachments/PAYMENT_REQUEST/{recordId} (voice note, existing shared attachments API)` | E |
| EMP-017 | `GET /api/v1/payment-requests?view=mine&status=` | E |
| EMP-018 | `GET /api/v1/payment-requests/{id}` | E |
| EMP-018 | `POST /api/v1/payment-requests/{id}/cancel` | E |
| EMP-018 | `GET /api/v1/record-attachments/PAYMENT_REQUEST/{id} (bill photo + voice note)` | E |
| EMP-019 | `GET/POST /api/v1/salary/advances` | E |
| EMP-019 | `POST /api/v1/salary/advances/{id}/cancel` | E |
| EMP-019 | `Voice note on the linked SALARY_ADVANCE payment request via record-attachments/PAYMENT_REQUEST — needs the request id in the advance response (to verify)` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| EMP-020 | `GET /api/v1/notifications` | E |
| EMP-020 | `POST /api/v1/notifications/mark-all-read` | E |
| EMP-021 | `PATCH /api/v1/notifications/{id}/read` | E |
| EMP-022 | `GET /api/mobile/v1/me` | N |
| EMP-023 | `POST /api/v1/account/change-password` | E |
| EMP-023 | `POST /api/mobile/v1/auth/login (silent re-sign-in)` | N |
| EMP-024 | `local only` | E |
| EMP-025 | `GET /api/mobile/v1/devices` | N |
| EMP-025 | `DELETE /api/mobile/v1/devices/{id}` | N |
| EMP-026 | `/api/v1/support-tickets (existing ERP support tickets — exact routes to verify)` | E |
| EMP-027 | `GET /api/mobile/v1/app-config` | N |
| EMP-028 | `POST /api/v1/leave-requests` | E |
| EMP-028 | `GET /api/v1/leave-requests/balance` | E |
| EMP-029 | `POST /api/v1/attendance-corrections` | E |
| EMP-030 | `GET /api/v1/salary/history` | E |
| EMP-030 | `GET /api/v1/salary/history/slips/{lineId}/pdf` | E |
| EMP-031 | `GET /api/v1/attendance/outdoor-rejections?mine=true` | E |
| EMP-031 | `POST .../{id}/accept\|clarify` | E |
| WRK-001 | `GET /api/mobile/v1/me` | N |
| WRK-001 | `GET /api/v1/attendance/me/today` | E |
| WRK-001 | `GET /api/v1/job-orders/my-assignments` | E |
| WRK-002 | `GET /api/v1/job-orders/my-assignments` | E |
| WRK-003 | `GET /api/v1/job-orders/{id}` | E |
| WRK-003 | `GET /api/v1/job-orders/{id}/slips` | E |
| WRK-004 | `POST /api/v1/job-orders/{id}/self-progress` | E |
| WRK-004 | `Voice note on production progress entries (needs a JOB_ORDER_PROGRESS_ENTRY target) — no attachment target yet (CR-001)` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| WRK-005 | `POST /api/v1/job-orders/{id}/self-progress → 201` | E |
| WRK-006 | `GET /api/v1/job-order-progress-entries/mine` | E |
| WRK-007 | `POST /api/v1/job-order-assignments/{id}/handback {quantity, reason}` | E |
| WRK-007 | `Voice note on hand-back reason — no attachment target yet (CR-001)` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| WRK-008 | `GET /api/v1/lots/{id}` | E |
| WRK-009 | `GET /api/v1/piece-rate-earnings` | E |
| WRK-010 | `GET /api/v1/job-orders/my-assignments → error (not linked / self-entry off)` | E |
| SUP-001 | `GET /api/mobile/v1/me` | N |
| SUP-001 | `GET /api/v1/job-order-progress-entries/pending` | E |
| SUP-001 | `GET /api/v1/attendance/summary?date=` | E |
| SUP-001 | `Team dashboard counts (team size, active JOs) — server-rendered only` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| SUP-002 | `GET /api/v1/attendance/team-day?date=` | E |
| SUP-003 | `GET /api/v1/attendance/team-month?month=&view=team` | E |
| SUP-004 | `GET /api/v1/job-order-progress-entries/pending` | E |
| SUP-005 | `POST /api/v1/job-order-progress-entries/{id}/approve {approvalRemark?}` | E |
| SUP-005 | `POST /api/v1/job-order-progress-entries/{id}/reject (remark required)` | E |
| SUP-005 | `PATCH /api/v1/job-order-progress-entries/{id}` | E |
| SUP-005 | `Voice note on progress entries / approval remarks — no attachment target yet (CR-001)` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| SUP-006 | `GET /api/v1/production-orders (scoped)` | E |
| SUP-006 | `Team job-order list / team pending counts` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| SUP-007 | `GET /api/v1/reports/production/worker-output-register?period=` | E |
| SUP-007 | `GET /api/v1/reports/production/line-wise-production` | E |
| EXT-001 | `GET /api/v1/job-work-orders?contractorId=` | E |
| PM-001 | `GET /api/v1/reports/dashboard/executive-dashboard (formatted strings)` | E |
| PM-001 | `Numeric KPI endpoint` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| PM-001 | `GET /api/v1/job-order-progress-entries/pending` | E |
| PM-001 | `GET /api/v1/reports/production-planning/delayed-production-orders` | E |
| PM-002 | `GET /api/v1/production-orders?page&pageSize&search&status` | E |
| PM-003 | `GET /api/v1/production-orders/{id} (incl. job orders)` | E |
| PM-003 | `GET /api/v1/lots/{id}/timeline` | E |
| PM-004 | `GET /api/v1/job-orders/{id}` | E |
| PM-005 | `GET /api/v1/job-work-orders` | E |
| PM-006 | `QC list API` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| PM-006 | `GET /api/v1/reports/quality/qc-inspection-register` | E |
| PM-007 | `Lot list API` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| PM-007 | `GET /api/v1/lots/{id}/timeline` | E |
| PM-008 | `sampling routes (to map)` | E |
| INV-001 | `GET /api/v1/reports/inventory/low-stock-report` | E |
| INV-001 | `GET /api/v1/reports/inventory/stock-valuation` | E |
| INV-001 | `GET /api/v1/material-requests?status=` | E |
| INV-002 | `GET /api/v1/inventory/stock-balances?warehouseId&materialCategory&showZeroStock` | E |
| INV-003 | `GET /api/v1/reports/inventory/stock-ledger` | E |
| INV-004 | `GET /api/v1/material-requests` | E |
| INV-005 | `GET /api/v1/finished-goods-inventory/stock-list` | E |
| INV-006 | `GET /api/v1/stock-movements` | E |
| INV-007 | `barcode resolve route (to map)` | E |
| PUR-001 | `GET /api/v1/purchase-orders?status=` | E |
| PUR-001 | `GET /api/v1/reports/purchase/pending-purchase-order` | E |
| PUR-001 | `Pending GRN status` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| PUR-002 | `GET /api/v1/purchase-orders` | E |
| PUR-003 | `GET /api/v1/purchase-orders/{id}` | E |
| PUR-003 | `PO approve route (to map)` | E |
| PUR-004 | `GET /api/v1/goods-receipts` | E |
| SAL-001 | `GET /api/v1/reports/sales-orders/pending-orders` | E |
| SAL-001 | `GET /api/v1/crm/dashboard?range=&widgets=` | E |
| SAL-001 | `GET /api/v1/sales-orders` | E |
| SAL-002 | `GET /api/v1/sales-orders` | E |
| SAL-003 | `GET /api/v1/sales-orders/{id}` | E |
| SAL-003 | `GET /api/v1/reports/order-lifecycle/{salesOrderId}` | E |
| SAL-004 | `GET /api/v1/crm/leads` | E |
| SAL-005 | `GET /api/v1/customers` | E |
| SAL-006 | `buyer-enquiries routes (to map)` | E |
| ACC-001 | `GET /api/v1/payment-requests/summary` | E |
| ACC-001 | `GET /api/v1/reports/receivables/customer-outstanding` | E |
| ACC-001 | `GET /api/v1/reports/payables/supplier-outstanding` | E |
| ACC-002 | `GET /api/v1/payment-requests?view=approve` | E |
| ACC-002 | `POST /api/v1/payment-requests/{id}/approve` | E |
| ACC-002 | `POST /api/v1/payment-requests/{id}/reject` | E |
| ACC-003 | `GET /api/v1/payment-requests?view=pay` | E |
| ACC-003 | `POST /api/v1/payment-requests/{id}/payouts` | E |
| ACC-004 | `GET /api/v1/sales-invoices` | E |
| ACC-004 | `GET /api/v1/purchase-invoices` | E |
| ACC-005 | `receivables/* and payables/* reports` | E |
| HR-001 | `GET /api/v1/attendance/summary?date=` | E |
| HR-001 | `GET /api/v1/leave-requests?status=PENDING` | E |
| HR-001 | `GET /api/v1/attendance/outdoor` | E |
| HR-002 | `GET /api/v1/attendance/team-day` | E |
| HR-002 | `GET /api/v1/attendance/team-month` | E |
| HR-003 | `GET /api/v1/leave-requests?status=PENDING` | E |
| HR-003 | `POST /api/v1/leave-requests/{id}/approve\|reject` | E |
| HR-004 | `GET /api/v1/attendance-corrections` | E |
| HR-005 | `GET /api/v1/attendance/outdoor` | E |
| HR-005 | `POST /api/v1/attendance/outdoor (approve)` | E |
| HR-005 | `POST /api/v1/attendance/outdoor/{sessionId}/reject` | E |
| HR-005 | `risk reasons from hrms_attendance_punch_meta (B-17)` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| HR-006 | `attendance/overtime routes` | E |
| HR-007 | `GET /api/v1/employees` | E |
| DSP-001 | `GET /api/v1/dispatches` | E |
| DSP-001 | `GET /api/v1/reports/dispatch/pending-dispatch` | E |
| DSP-002 | `GET /api/v1/dispatches` | E |
| DSP-003 | `dispatch packing routes (to map)` | E |
| ADM-001 | `GET /api/mobile/v1/me (permission keys)` | N |
| ADM-001 | `Company counts (employees, users, customers) — server-rendered only` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| ADM-001 | `Cross-module pending approvals` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| ADM-001 | `GET /api/v1/reports/mis/daily-mis?date=` | E |
| ADM-002 | `Aggregated pending-approvals endpoint` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| ADM-002 | `Per-module lists: payment-requests?view=approve, job-order-progress-entries/pending, leave-requests?status=PENDING, attendance/outdoor, attendance-corrections, purchase-orders, material-requests` | E |
| ADM-003 | `GET /api/v1/employees` | E |
| ADM-003 | `company counts API` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| ADM-004 | `GET /api/v1/users` | E |
| ADM-005 | `GET /api/v1/reports/{category}/{key}` | E |
| ADM-006 | `GET /api/v1/reports/{category}/{key}?dateFrom&dateTo…` | E |
| ADM-006 | `GET …/export/{xlsx\|csv\|pdf}` | E |
| OWN-001 | `GET /api/v1/reports/dashboard/executive-dashboard` | E |
| OWN-001 | `Numeric KPI endpoint (values come as formatted strings today)` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| OWN-002 | `GET /api/v1/reports/business-performance/monthly-sales-trend` | E |
| OWN-002 | `GET /api/v1/reports/business-performance/top-customers-by-revenue` | E |
| OWN-002 | `GET /api/v1/reports/business-performance/top-styles-by-revenue` | E |
| OWN-003 | `production/production-achievement, production-rejection, line-wise-production` | E |
| OWN-004 | `inventory/stock-valuation, low-stock-report, slow-moving-dead-stock` | E |
| OWN-005 | `GET /api/v1/reports/accounts/profit-and-loss` | E |
| OWN-005 | `GET /api/v1/reports/receivables/customer-outstanding` | E |
| OWN-005 | `GET /api/v1/reports/payables/supplier-outstanding` | E |
| OWN-005 | `GET /api/v1/reports/expenses/financial-accounts-balances` | E |
| OWN-005 | `Cash-position KPI` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| OWN-006 | `attendance/monthly-attendance-summary` | E |
| OWN-007 | `Alert aggregation` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |
| SHR-001 | `none` | E |
| SHR-002 | `GET /api/mobile/v1/me (viewable modules + action sets)` | N |
| SHR-003 | `none` | E |
| SHR-004 | `existing EntitlementService via PermissionService` | E |
| SHR-005 | `GET/POST /api/v1/record-attachments/{module}/{recordId} (existing; audio webm/ogg/mp3/m4a/wav/aac accepted)` | E |
| SHR-005 | `Targets missing for production entries, attendance remark, leave, corrections, outdoor clarification, approval remarks` | G — **BACKEND_GAP — APPROVAL_REQUIRED** |

## Screens with a backend gap
- AUTH-005 Forgot password (info): none — ERP has no self-service reset (admin reset only)
- EMP-005 Punch – selfie: camera only; face step per decision Q-01 (OPEN)
- EMP-014 Add attendance remark: Voice note on attendance day remark — no attachment target yet (CR-001)
- EMP-019 Salary advance request: Voice note on the linked SALARY_ADVANCE payment request via record-attachments/PAYMENT_REQUEST — needs the request id in the advance response (to verify)
- WRK-004 Submit production progress: Voice note on production progress entries (needs a JOB_ORDER_PROGRESS_ENTRY target) — no attachment target yet (CR-001)
- WRK-007 Hand back pieces: Voice note on hand-back reason — no attachment target yet (CR-001)
- SUP-001 Supervisor Home: Team dashboard counts (team size, active JOs) — server-rendered only
- SUP-005 Approve / reject progress entry: Voice note on progress entries / approval remarks — no attachment target yet (CR-001)
- SUP-006 Team work status: Team job-order list / team pending counts
- PM-001 Production Manager Home: Numeric KPI endpoint
- PM-006 QC inspections: QC list API
- PM-007 Lot list / lot timeline: Lot list API
- PUR-001 Purchase Home: Pending GRN status
- HR-005 Outside / flagged punch review: risk reasons from hrms_attendance_punch_meta (B-17)
- ADM-001 Company Admin Dashboard: Company counts (employees, users, customers) — server-rendered only; Cross-module pending approvals
- ADM-002 Pending approvals (all modules): Aggregated pending-approvals endpoint
- ADM-003 Employee summary: company counts API
- OWN-001 Owner Dashboard: Numeric KPI endpoint (values come as formatted strings today)
- OWN-005 Financial summary: Cash-position KPI
- OWN-007 Alerts center: Alert aggregation
- SHR-005 Voice note (record instead of typing): Targets missing for production entries, attendance remark, leave, corrections, outdoor clarification, approval remarks

