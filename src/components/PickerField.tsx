import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { colors, layout, radius, spacing } from "../theme/tokens";
import { AppText } from "./AppText";

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" from the phone's local calendar (the user's "today"). */
export function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function localTimeKey(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toDate(mode: "date" | "time", value: string | null): Date {
  const now = new Date();
  if (!value) return now;
  if (mode === "date") {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const [h, min] = value.split(":").map(Number);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, min);
}

interface Props {
  label: string;
  mode: "date" | "time";
  /** "YYYY-MM-DD" for dates, "HH:mm" for times. */
  value: string | null;
  onChange: (value: string) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  error?: string | null;
  testID?: string;
}

/** Tap-to-pick date or time (native picker) — no typing of dates. */
export function PickerField({ label, mode, value, onChange, maximumDate, minimumDate, error, testID }: Props) {
  const [open, setOpen] = useState(false);
  function handle(event: DateTimePickerEvent, picked?: Date) {
    if (Platform.OS !== "ios") setOpen(false);
    if (event.type !== "set" || !picked) return;
    onChange(mode === "date" ? localDateKey(picked) : localTimeKey(picked));
  }
  return (
    <View style={styles.wrap}>
      <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
        {label}
      </AppText>
      <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={`${label}: ${value ?? "not set"}`} onPress={() => setOpen((o) => !o)} style={[styles.box, !!error && styles.errorBox]}>
        <AppText color={value ? colors.text : colors.textSecondary}>{value ?? (mode === "date" ? "Choose a date" : "Choose a time")}</AppText>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={toDate(mode, value)}
          mode={mode}
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handle}
        />
      ) : null}
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
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  errorBox: { borderColor: colors.danger },
  error: { marginTop: spacing.xs },
});
