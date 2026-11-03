# Navigation (Design System v1.0)

## Bottom navigation (max 5 tabs, built from permissions)

| Tab | Shown when | Content |
|---|---|---|
| **Home** | always | Role-adaptive dashboard (employee / worker / supervisor / manager / admin / owner) |
| **My Work** | user has assigned production work, or attendance | Worker & supervisor: tasks; others: attendance + my requests |
| **Modules** | user can view at least one module beyond self-service | All authorized modules, grouped by category, with search |
| **Alerts** | always | Notifications with unread badge |
| **Profile** | always | Profile, change password, devices, settings, help, about, logout |

## Rules
- ERP modules are never placed directly in the bottom nav; they live in **Modules**, grouped: HR · Production · Inventory · Purchase · Sales & CRM · Accounts · Dispatch · Reports · Masters.
- Home shows at most 8 shortcuts (2 rows of 4), chosen from what the user can access.
- Inner screens: back arrow + title; bottom nav hidden on forms and full-screen flows (punch, submit progress).
- Visibility = RBAC module `view` **and** company entitlement on; buttons inside a page follow action permissions (create, edit, approve, reject, export…). The server still checks every call.
- Deep links (from notifications) open the record; if access was removed → `PermissionDeniedState`.
- Permissions are re-read on app start, on pull-to-refresh of Home, and when the server returns a permission error; navigation rebuilds without a restart.
