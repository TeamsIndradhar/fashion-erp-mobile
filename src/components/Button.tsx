import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { colors, layout, radius, spacing } from "../theme/tokens";
import { AppText } from "./AppText";

type Kind = "primary" | "secondary" | "danger" | "ghost";

interface Props {
  title: string;
  onPress: () => void;
  kind?: Kind;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}

const BG: Record<Kind, string> = { primary: colors.primary, secondary: colors.surface, danger: colors.danger, ghost: "transparent" };
const FG: Record<Kind, string> = { primary: colors.white, secondary: colors.primary, danger: colors.white, ghost: colors.primaryDark };

export function Button({ title, onPress, kind = "primary", disabled, loading, testID }: Props) {
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
        {loading ? <ActivityIndicator color={FG[kind]} style={styles.spinner} /> : null}
        <AppText variant="bodyStrong" color={FG[kind]}>
          {title}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: layout.touchTarget, borderRadius: radius.md, paddingHorizontal: spacing.lg, justifyContent: "center", alignItems: "center" },
  outline: { borderWidth: 1, borderColor: colors.primary },
  disabled: { opacity: 0.5 },
  row: { flexDirection: "row", alignItems: "center" },
  spinner: { marginRight: spacing.sm },
});
