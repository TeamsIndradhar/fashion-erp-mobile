import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { SessionCard } from "@/features/attendance/SessionCard";
import { formatDateKey, formatHours } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

const REMARK_MAX = 500;

/** EMP-013 Day details + EMP-014 day remark. */
export default function DayDetails() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const auth = useAuth();
  const enabled = auth.status === "signedIn" && !!date;
  const day = useQuery({ queryKey: ["attendance", "day", date], queryFn: () => endpoints.attendanceDay(date!), enabled });

  if (auth.status !== "signedIn") return <Redirect href="/" />;

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        {date ? formatDateKey(date) : ""}
      </AppText>
      {day.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {day.error ? <Banner tone="danger" message={(day.error as Error).message} /> : null}
      {day.data ? (
        <>
          <Card>
            <AppText variant="caption" color={colors.textSecondary}>
              Worked
            </AppText>
            <AppText variant="h3">{formatHours(day.data.workedHours)}</AppText>
          </Card>
          {day.data.sessions.length === 0 ? <AppText color={colors.textSecondary}>No punches on this day.</AppText> : null}
          {day.data.sessions.map((s, i) => (
            <SessionCard key={s.id} session={s} index={i} />
          ))}
          {!day.data.isFuture && auth.me?.permissions.attendance.punch ? (
            <RemarkEditor key={`remark-${date}`} date={date!} initial={day.data.remark ?? ""} />
          ) : day.data.remark ? (
            <Card>
              <AppText variant="caption" color={colors.textSecondary}>
                Remark
              </AppText>
              <AppText>{day.data.remark}</AppText>
            </Card>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

function RemarkEditor({ date, initial }: { date: string; initial: string }) {
  const qc = useQueryClient();
  const [text, setText] = useState(initial);
  const save = useMutation({
    mutationFn: () => endpoints.setDayRemark(date, text),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["attendance"] }),
  });
  const tooLong = text.length > REMARK_MAX;
  return (
    <View style={styles.remark}>
      <TextField
        label={`Remark (${text.length}/${REMARK_MAX})`}
        value={text}
        onChangeText={setText}
        multiline
        placeholder="e.g. Client visit, came late because of rain"
        error={tooLong ? `A remark can be at most ${REMARK_MAX} characters.` : null}
        testID="day-remark"
      />
      {save.error ? <Banner tone="danger" message={save.error instanceof ApiError ? save.error.message : strings.errors.generic} /> : null}
      {save.isSuccess ? <Banner tone="success" message="Remark saved." /> : null}
      <View style={styles.gap} />
      <Button title="Save remark" onPress={() => save.mutate()} loading={save.isPending} disabled={tooLong || text === initial} testID="day-remark-save" />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  remark: { marginTop: spacing.md },
  gap: { height: spacing.md },
});
