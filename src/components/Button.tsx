import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { colors, spacing } from "../theme/tokens";
import { AppText } from "./AppText";
import { Icon, type IconName } from "./Icon";

type Kind = "primary" | "secondary" | "danger" | "ghost";

interface Props {
  title: string;
  onPress: () => void;
  kind?: Kind;
  disabled?: boolean;
  loading?: boolean;
  /** Icon left of the label (BUTTONS.md); the spinner replaces it while loading. */
  icon?: IconName;
  testID?: string;
}

const BG: Record<Kind, string> = { primary: colors.primary, secondary: colors.surface, danger: colors.danger, ghost: "transparent" };
const FG: Record<Kind, string> = { primary: colors.white, secondary: colors.primary, danger: colors.white, ghost: colors.primaryDark };

export function Button({ title, onPress, kind = "primary", disabled, loading, icon, testID }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: pressed && kind === "primary" ? colors.primaryDark : BG[kind] },
        kind === "secondary" && styles.outline,
        inactive && styles.disabled,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={FG[kind]} style={styles.lead} />
        ) : icon ? (
          <View style={styles.lead}>
            <Icon name={icon} tone={kind === "primary" || kind === "danger" ? "white" : "primary"} size={20} />
          </View>
        ) : null}
        <AppText variant="bodyStrong" color={FG[kind]} style={styles.label}>
          {title}
        </AppText>
      </View>
    </Pressable>
  );
}

// BUTTONS.md: height 52, radius 14, bold label; secondary has a 1.5 px primary border.
const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: 14, paddingHorizontal: spacing.lg, justifyContent: "center", alignItems: "center" },
  outline: { borderWidth: 1.5, borderColor: colors.primary },
  disabled: { opacity: 0.5 },
  row: { flexDirection: "row", alignItems: "center" },
  lead: { marginRight: spacing.sm },
  label: { fontWeight: "700" },
});
