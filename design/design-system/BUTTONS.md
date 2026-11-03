# Buttons (Design System v1.0)

| Variant | Look | Use |
|---|---|---|
| Primary | `primary` fill, white `bodyStrong`, radius 14, height 52 | The one main action of a screen |
| Secondary | white, 1.5 px `primary` border + text | Alternative action |
| Success | `success` fill, icon left, title + sub-label ("Start your attendance") | Punch In (ref-1) |
| Danger | `danger` fill | Punch Out (ref-1), reject, destructive confirm |
| Link | `primaryDark` text + → | "View details →", "More options →" |
| Round punch | 140 px circle, hero gradient, glowing white ring, fingerprint icon, "Tap to Punch / In · Out" | Single-button punch (ref-2) |

States: default · pressed (8 % darker) · disabled (40 % opacity **plus** a reason line under it) · loading (spinner replaces the icon, label stays).

Rule: at most one enabled filled action per card. In the ref-1 In/Out pair only the valid one is enabled (Punch In when not punched in, Punch Out when punched in).
