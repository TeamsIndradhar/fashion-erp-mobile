# Fashion ERP Mobile — Design (v1.0, batch 1)

Design-first baseline for the whole app. **No application code until the user approves these designs.**

| Folder | Content |
|---|---|
| `reference/` | The two reference screenshots (visual direction) |
| `design-system/` | Colours (sampled from the references), typography, spacing, icons, components, buttons, forms, cards, navigation |
| `user-flows/` | Authentication, employee, worker, supervisor, manager, company admin, owner flows (Mermaid) |
| `screen-inventory/` | `ERP_AUDIT_FOR_DESIGN.md` (roles, modules, APIs, gaps), `ALL_SCREENS.md`, `SCREEN_PERMISSION_MAPPING.md`, `API_SCREEN_MAPPING.md`, `SCREEN_APPROVAL_STATUS.md` |
| `screens/` | 14 categories; per screen `<ID-slug>/screen.png` (designed screens), `screen-spec.md`, `interactions.md`, `states.md` |
| `prototypes/` | Clickable HTML prototype (`index.html`) — design review only, demo data |
| `approvals/` | `DESIGN_REVIEW.md` (how to review + consistency audit), `APPROVED_SCREENS.md`, `CHANGE_REQUESTS.md` (+ open design decisions) |
| `tools/` | `export-png.cjs`, `generate-docs.cjs` (Node only, no packages) |

Principles: one app; dashboards and navigation built from the user's **permission keys** (never role names); every number from an existing ERP API/report; anything missing marked `BACKEND_GAP — APPROVAL_REQUIRED`; one design system for every module.
