# Components (Design System v1.0)

Every screen is composed only from these components. Changing a shared component is a design change → record it in `design/approvals/CHANGE_REQUESTS.md`.

| Component | Purpose | Variants / key props | From reference |
|---|---|---|---|
| `AppHeader` | Hanger logo + "Fashion ERP" + subtitle; bell with unread badge; optional back/settings | `home` · `inner` (back + title) | ref-1, ref-2 |
| `CompanyHeader` | Company name chip (multi-company context) | `companyName` | — |
| `EmployeeProfileCard` | Avatar, name, employee ID, department, designation, status badge | `active` · `inactive` | ref-1, ref-2 |
| `AttendanceHeroCard` | Gradient card: place, verification, GPS accuracy, date, punch state | `notIn` · `in` · `out` · `blocked` | ref-1, ref-2 |
| `PunchButton` | Round "Tap to Punch" (single) or paired In/Out | `single` · `pair`, `disabledReason` | ref-2 / ref-1 |
| `TrustChips` | Chips: "GPS ± 8 m", "Device verified" | | ref-2 |
| `TodayAttendanceCard` | Check-in / check-out times with arrows | | ref-2 |
| `DashboardSummaryCard` | KPI value + label + sub-text | `tone` | — |
| `ModuleGrid` / `ModuleCard` | 4-column tiles, icon tile + label + optional badge | | ref-1, ref-2 |
| `SectionHeader` | Title + "View details →" link | | ref-1, ref-2 |
| `StatusBadge` | Pill with dot | `success · warning · danger · info · neutral` | ref-1, ref-2 |
| `PrimaryButton` · `SecondaryButton` · `DangerButton` · `LinkButton` | Actions | `loading`, `disabled` | — |
| `FormField` | Label, input, helper, error | text · number · amount · date · select · textarea · file | — |
| `SearchBar` · `FilterChips` | Lists | | — |
| `DataListCard` | One record per card (number, status, meta, amount, chevron) — used instead of tables | | — |
| `ApprovalCard` | Record summary + Approve / Reject (only with permission) | `canApprove` | — |
| `NotificationCard` | Icon, title, time, unread dot | | — |
| `InfoBanner` | Tinted banner with icon (+ optional chip) | `success · warning · danger · info` | ref-1, ref-2 |
| `EmptyState` · `ErrorState` · `LoadingState` (skeleton) · `PermissionDeniedState` · `OfflineBanner` | Standard states on every screen | | — |
| `BottomNavigation` | 4–5 permission-driven tabs | | ref-1, ref-2 |
| `BottomSheet` · `ConfirmDialog` | Small actions, confirmations | | — |
| `DemoDataTag` | "DEMO DATA" marker — **prototype only, never in the app** | | — |
