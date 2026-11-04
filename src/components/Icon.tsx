import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, View } from "react-native";
import { colors, radius } from "../theme/tokens";

/** Design-system icon names (design/design-system/ICONS.md) → Feather (Lucide-style 2 px outline). */
const GLYPH = {
  pin: "map-pin",
  alert: "alert-triangle",
  lock: "lock",
  chev: "chevron-right",
  back: "chevron-left",
  gps: "navigation",
} as const;

export type IconName = keyof typeof GLYPH;
export type IconTone = "primary" | "success" | "danger" | "warning" | "info" | "muted" | "text" | "white";

const FG: Record<IconTone, string> = {
  primary: colors.primary,
  success: colors.successDark,
  danger: colors.danger,
  warning: colors.warning,
  info: colors.info,
  muted: colors.textSecondary,
  text: colors.text,
  white: colors.white,
};

const TINT: Record<IconTone, string> = {
  primary: colors.primaryTint,
  success: colors.successTint,
  danger: colors.dangerTint,
  warning: colors.warningTint,
  info: colors.primaryTint,
  muted: colors.border,
  text: colors.border,
  white: colors.primary,
};

export function Icon({ name, tone = "text", size = 22 }: { name: IconName; tone?: IconTone; size?: number }) {
  return <Feather name={GLYPH[name]} size={size} color={FG[tone]} />;
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
