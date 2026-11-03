# Colors — Fashion ERP Mobile (Design System v1.0)

Sampled pixel values from `design/reference/reference-dashboard-1.png` and `reference-dashboard-2.png`, rounded into tokens. **Light theme only** (no dark theme, no glassmorphism — per brief).

| Token | Hex | Sampled from | Use |
|---|---|---|---|
| `primary` | `#4130CC` | ref-1 status card | Primary buttons, active nav, focus |
| `primaryDark` | `#3925AD` | ref-1 "More Options" link | Pressed state, link text |
| `heroStart` | `#523DD8` | ref-2 hero card, left | Hero/status card gradient start |
| `heroEnd` | `#947BF5` | ref-2 hero card, right | Hero/status card gradient end |
| `primaryTint` | `#F3F1FD` | ref-2 chips | Chips, selected rows, icon tiles |
| `bg` | `#F2F0FE` | ref-2 background | Screen background (lavender-white) |
| `surface` | `#FFFFFF` | cards | Cards, sheets, bottom nav |
| `border` | `#E7E5F7` | card outlines | 1 px borders, dividers |
| `text` | `#07082A` | ref-2 name | Titles and body |
| `textSecondary` | `#8789A8` | ref-1 employee code | Meta text |
| `success` | `#1CA454` | ref-1 Punch In | Success, present, Punch In, Active badge |
| `successDark` | `#0B973D` | ref-1 shield icon | Success icons |
| `successTint` | `#DFF8E9` | ref-1 secure banner | Success banners/badges |
| `successGlow` | `#43F45D` | ref-1 checked-in ring | Only the checked-in ring |
| `danger` | `#E02130` | ref-1 Punch Out | Errors, rejected, Punch Out, destructive |
| `dangerTint` | `#FDE8EA` | derived | Error banners |
| `warning` | `#FFA81F` | ref-1 Add Remark icon | Pending, under review |
| `warningTint` | `#FFF4E0` | derived | Pending badges, review banners |
| `info` | `#2F6FED` | ref-1 help icon | Info |

Rules
- One primary colour across all modules; modules differ by icon, never by colour.
- The gradient appears **only** on the single hero card of a dashboard.
- Status colour always comes with text or an icon (never colour alone).
- Contrast: body text ≥ 4.5:1 on `bg`/`surface`; white on `primary` ≥ 4.5:1.
