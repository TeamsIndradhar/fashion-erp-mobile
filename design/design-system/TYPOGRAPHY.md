# Typography (Design System v1.0)

Font: **Inter** (bundled at Phase 2 via `@expo-google-fonts/inter` — dependency to approve), system font fallback. Matches the clean sans of the references.

| Token | Size / line height | Weight | Use |
|---|---|---|---|
| `display` | 28 / 34 | 700 | Big times ("09:15 AM"), KPI hero numbers |
| `h1` | 24 / 30 | 700 | "Fashion ERP" title, home titles |
| `h2` | 20 / 26 | 700 | Section titles ("Modules", "Today's Attendance") |
| `h3` | 17 / 22 | 600 | Card titles, employee name |
| `body` | 15 / 21 | 400 | Body |
| `bodyStrong` | 15 / 21 | 600 | Values, button labels |
| `caption` | 13 / 18 | 400 | Meta (employee ID, dates) |
| `micro` | 11 / 14 | 600 | Badges, bottom-nav labels |

Rules: OS font scaling to 200 % must not clip text; long names end with an ellipsis (full text on press); numbers use tabular figures; amounts in ₹ with Indian grouping (1,23,456.00).
