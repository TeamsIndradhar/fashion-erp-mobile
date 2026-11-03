import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { colors, layout, radius, spacing, typography } from "../theme/tokens";
import { AppText } from "./AppText";

interface Props extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string | null;
  secure?: boolean;
}

export function TextField({ label, error, secure, testID, ...input }: Props) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
        {label}
      </AppText>
      <View style={[styles.box, focused && styles.focused, !!error && styles.errorBox]}>
        <TextInput
          {...input}
          testID={testID}
          accessibilityLabel={label}
          secureTextEntry={secure && hidden}
          placeholderTextColor={colors.textSecondary}
          onFocus={(e) => {
            setFocused(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            input.onBlur?.(e);
          }}
          style={styles.input}
        />
        {secure ? (
          <Pressable accessibilityRole="button" accessibilityLabel={hidden ? "Show password" : "Hide password"} onPress={() => setHidden((h) => !h)} style={styles.eye}>
            <AppText variant="caption" color={colors.primaryDark}>
              {hidden ? "Show" : "Hide"}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.danger} style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { marginBottom: spacing.xs },
  box: {
    minHeight: layout.touchTarget,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  focused: { borderColor: colors.primary },
  errorBox: { borderColor: colors.danger },
  input: { flex: 1, ...typography.body, color: colors.text, paddingVertical: spacing.sm },
  eye: { paddingHorizontal: spacing.sm, minHeight: layout.touchTarget, justifyContent: "center" },
  error: { marginTop: spacing.xs },
});
