# Cards (Design System v1.0)

| Card | Spec |
|---|---|
| Base | `surface`, radius 16, padding 16, 1 px `border`, `card` shadow |
| Hero (one per home) | gradient `heroStart → heroEnd`, radius 24, white text, `raised` shadow |
| Profile | avatar 64 px with online dot, name `h3`, ID + department `caption`, status badge top-right |
| Module tile | white, radius 14, icon tile 44 px, label max 2 lines centred, optional red count badge |
| List record | row 1: document no. + status badge; rows 2–3: meta; amount right-aligned; chevron |
| KPI | value `h1`, label `caption`, sub-text (e.g. "vs last month") — 2 per row |
| Banner | tinted background, icon left, text, optional chip right (ref-1 "All Systems OK") |

Avoid tall cards; use 2-column KPI grids and list cards instead of tables. Large lists paginate (infinite scroll, 20 per page).
