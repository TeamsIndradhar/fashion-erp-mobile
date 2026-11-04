import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { colors, spacing } from "../theme/tokens";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

/** AppHeader `inner` variant (COMPONENTS.md): back arrow + title. */
export function InnerHeader({ title, onBack, right, testID }: { title: string; onBack?: () => void; right?: ReactNode; testID?: string }) {
  return (
    <View style={styles.row}>
      <Pressable
        testID={testID ?? "header-back"}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={8}
        onPress={onBack ?? (() => router.back())}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <Icon name="back" tone="text" size={24} />
      </Pressable>
      <AppText variant="h2" style={styles.title} numberOfLines={1}>
        {title}
      </AppText>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 6, paddingBottom: spacing.md },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20 },
  pressed: { backgroundColor: colors.primaryTint },
  title: { flex: 1, fontSize: 19, lineHeight: 24 },
});
