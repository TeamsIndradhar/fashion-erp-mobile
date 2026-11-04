import { StyleSheet, View } from "react-native";
import { colors } from "../theme/tokens";
import { AppText } from "./AppText";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

const STYLE: Record<BadgeTone, { bg: string; fg: string }> = {
  success: { bg: colors.successTint, fg: colors.successDark },
  warning: { bg: colors.warningTint, fg: "#B86E00" },
  danger: { bg: colors.dangerTint, fg: colors.danger },
  info: { bg: colors.infoTint, fg: colors.info },
  neutral: { bg: colors.primaryTint, fg: colors.primaryDark },
};

/** Pill with a dot (COMPONENTS.md `StatusBadge`). */
export function StatusBadge({ label, tone = "neutral", testID }: { label: string; tone?: BadgeTone; testID?: string }) {
  const s = STYLE[tone];
  return (
    <View testID={testID} style={[styles.pill, { backgroundColor: s.bg }]}>
      <View style={[styles.dot, { backgroundColor: s.fg }]} />
      <AppText variant="micro" color={s.fg} style={styles.text} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 4, paddingHorizontal: 9, borderRadius: 999, alignSelf: "flex-start" },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11.5, lineHeight: 15, fontWeight: "700" },
});
