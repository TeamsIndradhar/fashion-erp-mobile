import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../theme/tokens";
import { AppText } from "./AppText";

type Tone = "danger" | "warning" | "success" | "info";

const BG: Record<Tone, string> = { danger: colors.dangerTint, warning: colors.warningTint, success: colors.successTint, info: colors.primaryTint };
const BAR: Record<Tone, string> = { danger: colors.danger, warning: colors.warning, success: colors.success, info: colors.info };

export function Banner({ tone, message, testID }: { tone: Tone; message: string; testID?: string }) {
  return (
    <View testID={testID} accessibilityRole="alert" style={[styles.box, { backgroundColor: BG[tone], borderLeftColor: BAR[tone] }]}>
      <AppText variant="body">{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: radius.sm, borderLeftWidth: 4, padding: spacing.md },
});
