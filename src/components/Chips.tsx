import { Pressable, StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../theme/tokens";
import { AppText } from "./AppText";

/** Single-choice chips (radio group). */
export function Chips<T extends string>({ options, value, onChange, testID }: { options: { value: T; label: string }[]; value: T | null; onChange: (v: T) => void; testID?: string }) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" testID={testID}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable key={o.value} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => onChange(o.value)} style={[styles.chip, on && styles.on]}>
            <AppText variant="caption" color={on ? colors.white : colors.primaryDark}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.md },
  chip: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    minHeight: 36,
    justifyContent: "center",
  },
  on: { backgroundColor: colors.primary },
});
