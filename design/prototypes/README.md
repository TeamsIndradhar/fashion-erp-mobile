# Clickable design prototype

**Open:** double-click `index.html` (Chrome or Edge), or `file:///D:/office-data/claude-projects/fashion-erp-mobile/design/prototypes/index.html`.

- Left: user categories → screens (green dot = designed, grey = pending batch 2), search box.
- Centre: phone frame (390 × 844) with the screen. Arrow keys / Prev-Next to move.
- Right: screen ID, status, design version, purpose, roles, required permission, API mapping (E existing · N new mobile route · G backend gap), actions, navigation, validation, states.
- Deep link: `index.html?screen=EMP-001`.

**Design review only:** static HTML with **DEMO DATA**; it makes no API calls and cannot create attendance or any other record.

## Files
| File | Role |
|---|---|
| `styles.css` | Design tokens + components (mirrors `design/design-system/`) |
| `components.js` | Shared UI helpers (header, profile card, hero, punch buttons, grids, list cards, KPIs, fields, banners, states, nav) |
| `screens-auth-employee.js` | 01 Authentication, 02 Common employee |
| `screens-work.js` | 03 Production worker, 04 Supervisor |
| `screens-mgmt.js` | 05–13 managers, admin, owner; 14 shared; batch-2 inventory entries |
| `app.js` | Viewer; `?screen=ID&bare=1` renders a single screen for PNG export |

## Regenerate
```bash
node design/tools/export-png.cjs
```
```bash
node design/tools/generate-docs.cjs
```
The screen registry in `screens-*.js` is the single source of truth: the PNGs, every `screen-spec.md`, and the four inventory documents are generated from it. Needs only Node and an installed Chrome/Edge (no packages).
