// Design System v1.0 tokens (design/design-system/*.md). Change only through a change request.

export const colors = {
  primary: "#4130CC",
  primaryDark: "#3925AD",
  heroStart: "#523DD8",
  heroEnd: "#947BF5",
  primaryTint: "#F3F1FD",
  bg: "#F2F0FE",
  surface: "#FFFFFF",
  border: "#E7E5F7",
  text: "#07082A",
  textSecondary: "#8789A8",
  success: "#1CA454",
  successDark: "#0B973D",
  successTint: "#DFF8E9",
  successGlow: "#43F45D",
  danger: "#E02130",
  dangerTint: "#FDE8EA",
  warning: "#FFA81F",
  warningTint: "#FFF4E0",
  info: "#2F6FED",
  white: "#FFFFFF",
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, "2xl": 24, "3xl": 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 } as const;

export const layout = { gutter: 16, cardGap: 12, cardPadding: 16, touchTarget: 48, punchTarget: 64 } as const;

type TextToken = { fontSize: number; lineHeight: number; fontWeight: "400" | "600" | "700" };

export const typography: Record<"display" | "h1" | "h2" | "h3" | "body" | "bodyStrong" | "caption" | "micro", TextToken> = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
  h1: { fontSize: 24, lineHeight: 30, fontWeight: "700" },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: "700" },
  h3: { fontSize: 17, lineHeight: 22, fontWeight: "600" },
  body: { fontSize: 15, lineHeight: 21, fontWeight: "400" },
  bodyStrong: { fontSize: 15, lineHeight: 21, fontWeight: "600" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: "600" },
};

export const elevation = {
  card: { shadowColor: "#4130CC", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  raised: { shadowColor: "#4130CC", shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
} as const;
