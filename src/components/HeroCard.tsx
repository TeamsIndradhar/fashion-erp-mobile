import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { colors, elevation, radius } from "../theme/tokens";

/** The single hero card of a dashboard: heroStart → heroEnd gradient (prototype `.hero`, 120°). */
export function HeroCard({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.shadow, style]}>
      <LinearGradient colors={[colors.heroStart, colors.heroEnd]} start={{ x: 0, y: 0.2 }} end={{ x: 1, y: 0.8 }} style={styles.hero}>
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: { borderRadius: radius.xl, marginBottom: 12, backgroundColor: colors.heroStart, ...elevation.raised },
  hero: { borderRadius: radius.xl, padding: 16 },
});
