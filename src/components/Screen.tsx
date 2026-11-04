import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, layout } from "../theme/tokens";
import { OfflineBanner } from "./OfflineBanner";

/**
 * Screen shell: safe areas, lavender background, gutter, keyboard handling, offline banner.
 * `footer` (bottom navigation) stays fixed below the scroll area; `onRefresh` adds pull-to-refresh.
 */
export function Screen({
  children,
  scroll = true,
  footer,
  refreshing,
  onRefresh,
}: {
  children: ReactNode;
  scroll?: boolean;
  footer?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={footer ? ["top"] : ["top", "bottom"]}>
      <OfflineBanner />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.content, footer ? styles.withFooter : null]}
            keyboardShouldPersistTaps="handled"
            refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} colors={[colors.primary]} /> : undefined}
          >
            {children}
          </ScrollView>
        ) : (
          <>{children}</>
        )}
      </KeyboardAvoidingView>
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: layout.gutter },
  withFooter: { paddingTop: 0, paddingBottom: 12 },
});
