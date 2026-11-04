import { useQuery } from "@tanstack/react-query";
import { Redirect, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { endpoints } from "@/core/services";
import { formatDateKey, formatHours, formatMonthKey, formatTime, istDateKey, istMonthKey } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

/** SUP-003 One team member's month (from the team month grid). */
export default function TeamMember() {
  const { id, month: monthParam } = useLocalSearchParams<{ id: string; month?: string }>();
  const month = monthParam && /^\d{4}-\d{2}$/.test(monthParam) ? monthParam : istMonthKey();
  const auth = useAuth();
  const enabled = auth.status === "signedIn" && !!auth.me?.permissions.attendance.teamMonth;
  const grid = useQuery({ queryKey: ["team", "month", month], queryFn: () => endpoints.teamMonth(month), enabled });
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const m = grid.data?.employees.find((e) => e.employee.id === id) ?? null;
  const s = m?.summary;
  const today = istDateKey();

  return (
    <Screen>
      {grid.isPending && enabled ? <ActivityIndicator color={colors.primary} /> : null}
      {grid.error ? <Banner tone="danger" message={(grid.error as Error).message} /> : null}
      {grid.data && !m ? <Banner tone="warning" message="This person is not in your team for this month." /> : null}
      {m ? (
        <>
          <AppText variant="h2" style={styles.title}>
            {m.employee.fullName}
          </AppText>
          <AppText color={colors.textSecondary} style={styles.sub}>
            {m.employee.employeeCode} · {formatMonthKey(month)}
            {m.employee.shift ? ` · ${m.employee.shift.name} ${m.employee.shift.startTime}–${m.employee.shift.endTime}` : ""}
          </AppText>
          {s ? (
            <Card style={styles.cards}>
              {(
                [
                  ["Present", s.presentDays],
                  ["Absent", s.absentDays],
                  ["Leave", (s.paidLeaveDays ?? 0) + (s.unpaidLeaveDays ?? 0)],
                  ["Late", s.lateDays],
                  ["Outside", s.outsideDays],
                  ["Hours", s.totalHours !== undefined ? formatHours(s.totalHours) : undefined],
                ] as const
              ).map(([label, v]) => (
                <View key={label} style={styles.stat}>
                  <AppText variant="h3">{v ?? "—"}</AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {label}
                  </AppText>
                </View>
              ))}
            </Card>
          ) : null}
          {m.days
            .filter((d) => d.dateKey <= today)
            .reverse()
            .map((d) => (
              <Card key={d.dateKey} style={styles.row}>
                <View style={styles.flex}>
                  <AppText variant="bodyStrong">{formatDateKey(d.dateKey)}</AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {d.firstIn ? `${formatTime(d.firstIn)} – ${d.lastOut ? formatTime(d.lastOut) : "…"}` : (d.leaveLabel ?? "No punches")}
                    {d.workedHours ? ` · ${formatHours(d.workedHours)}` : ""}
                    {d.isLate ? " · late" : ""}
                    {d.isOutside ? " · outside" : ""}
                  </AppText>
                  {d.remark ? (
                    <AppText variant="caption" color={colors.textSecondary}>
                      “{d.remark}”
                    </AppText>
                  ) : null}
                </View>
                <AppText variant="bodyStrong">{d.code}</AppText>
              </Card>
            ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg },
  sub: { marginBottom: spacing.lg },
  cards: { flexDirection: "row", flexWrap: "wrap" },
  stat: { width: "33%", paddingVertical: spacing.sm },
  row: { flexDirection: "row", alignItems: "center" },
  flex: { flex: 1, marginRight: spacing.sm },
});
