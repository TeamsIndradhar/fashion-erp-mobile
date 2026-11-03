import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors, elevation, radius, spacing } from "../theme/tokens";

/**
 * The single hero card of a dashboard. Solid heroStart for now; the heroStart→heroEnd
 * gradient needs expo-linear-gradient (not added yet — D-031 log first).
 */
export function HeroCard({ children }: { children: ReactNode }) {
  return <View style={styles.hero}>{children}</View>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.heroStart, borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.lg, ...elevation.raised },
});
