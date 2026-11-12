import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, layout, radius, spacing } from "../theme/tokens";

/**
 * D-046: a sheet over the current screen (the punch camera opens here instead
 * of a new page). Used inside a route shown with `presentation: "transparentModal"`.
 * Tapping the dimmed area calls `onClose` unless it is undefined (e.g. while sending).
 */
export function BottomSheet({ children, onClose, testID = "bottom-sheet" }: { children: ReactNode; onClose?: () => void; testID?: string }) {
  return (
    <View style={styles.root} testID={testID}>
      <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel="Close" disabled={!onClose} onPress={onClose} testID={`${testID}-backdrop`} />
      <SafeAreaView edges={["bottom"]} style={styles.sheet}>
        <View style={styles.handle} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" bounces={false}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(7,8,42,0.45)" },
  sheet: { maxHeight: "92%", backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, overflow: "hidden" },
  handle: { alignSelf: "center", width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, marginTop: spacing.sm },
  content: { padding: layout.gutter, paddingTop: spacing.sm },
});
