import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { colors, elevation, layout, radius } from "../theme/tokens";

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: layout.cardPadding,
    marginBottom: layout.cardGap,
    ...elevation.card,
  },
});
