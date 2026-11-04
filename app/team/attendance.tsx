import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { Chips } from "@/components/Chips";
import { OfflineBanner } from "@/components/OfflineBanner";
import { PickerField } from "@/components/PickerField";
import { endpoints } from "@/core/services";
import { TONE_COLOR } from "@/features/attendance/labels";
import { sortAndFilterTeam, TEAM_STATUS, type TeamFilter } from "@/features/team/team";
import { formatHours, formatTime, istDateKey } from "@/lib/dates";
import { colors, layout, spacing } from "@/theme/tokens";

const FILTERS: { value: TeamFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "IN", label: "In" },
  { value: "NOT_IN", label: "Not in" },
  { value: "LATE", label: "Late" },
  { value: "LEAVE", label: "Leave" },
];

/** SUP-002 Team attendance for a day (own team scope from HRMS reporting lines). */
export default function TeamAttendance() {
  const auth = useAuth();
  const [date, setDate] = useState(istDateKey());
  const [filter, setFilter] = useState<TeamFilter>("ALL");
  const enabled = auth.status === "signedIn" && !!auth.me?.permissions.attendance.team;
  const day = useQuery({ queryKey: ["team", "day", date], queryFn: () => endpoints.teamDay(date), enabled });
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const c = day.data?.cards;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={day.isRefetching} onRefresh={() => void day.refetch()} />}>
        <AppText variant="h2" style={styles.title}>
          Team attendance
        </AppText>
        {!enabled ? <Banner tone="info" message="You don't have permission to see team attendance." /> : null}
        <PickerField label="Day" mode="date" value={date} onChange={setDate} maximumDate={new Date()} />
        {day.isPending && enabled ? <ActivityIndicator color={colors.primary} /> : null}
        {day.error ? <Banner tone="danger" message={(day.error as Error).message} /> : null}
        {c ? (
          <Card style={styles.cards}>
            {(
              [
                ["Team", c.total],
                ["Present", c.present],
                ["Outside", c.outside],
                ["Late", c.late],
                ["Not in", c.absent + c.notPunched],
                ["Leave", c.onLeave],
              ] as const
            ).map(([label, n]) => (
              <View key={label} style={styles.stat}>
                <AppText variant="h3">{n}</AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {label}
                </AppText>
              </View>
            ))}
          </Card>
        ) : null}
        {day.data ? <Chips options={FILTERS} value={filter} onChange={setFilter} /> : null}
        {day.data && day.data.rows.length === 0 ? <AppText color={colors.textSecondary}>No one reports to you in the ERP yet.</AppText> : null}
        {day.data
          ? sortAndFilterTeam(day.data.rows, filter).map((r) => {
              const s = TEAM_STATUS[r.status];
              return (
                <Pressable
                  key={r.employee.id}
                  accessibilityRole="button"
                  disabled={!auth.me?.permissions.attendance.teamMonth}
                  onPress={() => router.push({ pathname: "/team/member/[id]", params: { id: r.employee.id, month: date.slice(0, 7) } })}
                >
                  <Card style={styles.row}>
                    <View style={styles.flex}>
                      <AppText variant="bodyStrong" numberOfLines={1}>
                        {r.employee.fullName}
                      </AppText>
                      <AppText variant="caption" color={colors.textSecondary}>
                        {r.employee.employeeCode}
                        {r.day.firstIn ? ` · in ${formatTime(r.day.firstIn)}` : ""}
                        {r.day.lastOut ? ` · out ${formatTime(r.day.lastOut)}` : r.day.hasOpenSession ? " · still in" : ""}
                        {r.day.workedHours ? ` · ${formatHours(r.day.workedHours)}` : ""}
                        {r.day.isLate ? " · late" : ""}
                      </AppText>
                    </View>
                    <AppText variant="micro" color={TONE_COLOR[s.tone]}>
                      {(r.day.leaveLabel && r.status === "ON_LEAVE" ? r.day.leaveLabel : s.label).toUpperCase()}
                    </AppText>
                  </Card>
                </Pressable>
              );
            })
          : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: layout.gutter },
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  cards: { flexDirection: "row", flexWrap: "wrap" },
  stat: { width: "33%", paddingVertical: spacing.sm },
  row: { flexDirection: "row", alignItems: "center" },
  flex: { flex: 1, marginRight: spacing.sm },
});
