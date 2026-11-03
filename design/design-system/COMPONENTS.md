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

## Voice note (added 2026-11-03, CR-001)

| Component | Purpose | States | Where |
|---|---|---|---|
| `VoiceNote` | Record a short voice note instead of typing — for users who cannot type | idle (tap mic) · recording (timer, waveform, stop) · recorded (play, delete, re-record) · microphone blocked | Next to **every** remark / reason / description field and **every** upload area (expense, production progress, hand-back, attendance remark, approvals, leave, corrections, support) |
| `RemarkField` | "Type or record": text field + "— or —" + `VoiceNote` | text only · voice only · both | All remark fields |

Rules: voice is optional, text always stays available; max 2 minutes; recorded as AAC/M4A on the phone (accepted by the ERP file storage); uploaded through the ERP's existing record-attachments API with the same permission as the record; playback shown on detail and approval screens. See SHR-005.
