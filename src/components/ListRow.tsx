import { Pressable, StyleSheet, View } from "react-native";
import { colors, layout, spacing } from "../theme/tokens";
import { AppText } from "./AppText";

export function ListRow({ label, value, onPress, testID }: { label: string; value?: string | null; onPress?: () => void; testID?: string }) {
  const body = (
    <View style={styles.row}>
      <AppText variant="body" color={colors.textSecondary} style={styles.label}>
        {label}
      </AppText>
      <AppText variant="bodyStrong" numberOfLines={1} style={styles.value}>
        {value ?? (onPress ? "›" : "—")}
      </AppText>
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable testID={testID} accessibilityRole="button" onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: layout.touchTarget, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { flex: 1, marginRight: spacing.md },
  value: { flexShrink: 1, textAlign: "right" },
  pressed: { backgroundColor: colors.primaryTint },
});
