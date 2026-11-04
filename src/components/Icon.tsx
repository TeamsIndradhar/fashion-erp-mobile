import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, View } from "react-native";
import { colors, radius } from "../theme/tokens";

/**
 * Design-system icon names (design/design-system/ICONS.md) → Feather (Lucide-style 2 px outline).
 * The few the Feather set lacks (fingerprint, rupee, hanger logo) come from MaterialCommunityIcons.
 */
const FEATHER = {
  pin: "map-pin",
  alert: "alert-triangle",
  lock: "lock",
  chev: "chevron-right",
  chevLeft: "chevron-left",
  back: "chevron-left",
  gps: "navigation",
  bell: "bell",
  home: "home",
  brief: "briefcase",
  user: "user",
  users: "users",
  calendar: "calendar",
  edit: "edit-2",
  shield: "shield",
  checkc: "check-circle",
  clock: "clock",
  login: "log-in",
  logout: "log-out",
  chart: "bar-chart-2",
  box: "box",
  clipboard: "clipboard",
  layers: "layers",
  grid: "grid",
  check: "check",
  file: "file-text",
  info: "info",
} as const;

const MCI = {
  finger: "fingerprint",
  rupee: "currency-inr",
  hanger: "hanger",
  shieldCheck: "shield-check-outline",
} as const;

export type IconName = keyof typeof FEATHER | keyof typeof MCI;
export type IconTone = "primary" | "accent" | "success" | "danger" | "warning" | "info" | "muted" | "text" | "white" | "glow";

const FG: Record<IconTone, string> = {
  primary: colors.primary,
  accent: colors.accent,
  success: colors.successDark,
  danger: colors.danger,
  warning: colors.warning,
  info: colors.info,
  muted: colors.textSecondary,
  text: colors.text,
  white: colors.white,
  glow: colors.successGlow,
};

const TINT: Record<IconTone, string> = {
  primary: colors.primaryTint,
  accent: colors.accentTint,
  success: colors.successTint,
  danger: colors.dangerTint,
  warning: colors.warningTint,
  info: colors.infoTint,
  muted: colors.border,
  text: colors.border,
  white: colors.primary,
  glow: colors.successTint,
};

export function Icon({ name, tone = "text", size = 22, color }: { name: IconName; tone?: IconTone; size?: number; color?: string }) {
  const c = color ?? FG[tone];
  if (name in MCI) return <MaterialCommunityIcons name={MCI[name as keyof typeof MCI]} size={size} color={c} />;
  return <Feather name={FEATHER[name as keyof typeof FEATHER]} size={size} color={c} />;
}

/** Rounded, tinted icon tile (ICONS.md): icon at ~55 % of the tile. */
export function IconTile({ name, tone = "primary", size = 40, round }: { name: IconName; tone?: IconTone; size?: number; round?: number }) {
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: round ?? radius.md, backgroundColor: TINT[tone] }]}>
      <Icon name={name} tone={tone} size={Math.round(size * 0.55)} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: "center", justifyContent: "center" },
});
