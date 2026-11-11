import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { InnerHeader } from "@/components/InnerHeader";
import { OfflineBanner } from "@/components/OfflineBanner";
import { endpoints } from "@/core/services";
import { dayStatus, TONE_COLOR } from "@/features/attendance/labels";
import { formatDateKey, formatHours, formatMonthKey, formatTime, istMonthKey } from "@/lib/dates";
import { colors, layout, spacing } from "@/theme/tokens";

/** EMP-011/012 My Report: month summary and day list (opened from the calendar icon on EMP-002 and "My Report" on home). */
export default function AttendanceReport() {
  const auth = useAuth();
  const [monthDelta, setMonthDelta] = useState(0);
  const monthKey = istMonthKey(new Date(), monthDelta);
  const enabled = auth.status === "signedIn";
  const month = useQuery({ queryKey: ["attendance", "month", monthKey], queryFn: () => endpoints.attendanceMonth(monthKey), enabled });

  if (!enabled) return <Redirect href="/" />;

  const s = month.data?.summary;
  const days = (month.data?.days ?? []).filter((d) => !d.isFuture).reverse();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <OfflineBanner />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={month.isRefetching} onRefresh={() => void month.refetch()} />}
      >
        <InnerHeader title="Report" />

        <View style={styles.monthHead}>
          <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={() => setMonthDelta((d) => d - 1)} style={styles.arrow}>
            <AppText variant="h3" color={colors.primary}>
              ‹
            </AppText>
          </Pressable>
          <AppText variant="h3">{formatMonthKey(monthKey)}</AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next month"
            disabled={monthDelta >= 0}
            onPress={() => setMonthDelta((d) => Math.min(0, d + 1))}
            style={[styles.arrow, monthDelta >= 0 && styles.dim]}
          >
            <AppText variant="h3" color={colors.primary}>
              ›
            </AppText>
          </Pressable>
        </View>

        {month.isPending ? <ActivityIndicator color={colors.primary} /> : null}
        {month.error ? <Banner tone="danger" message={(month.error as Error).message} /> : null}
        {s ? (
          <Card style={styles.summary}>
            {(
              [
                ["Present", s.presentDays],
                ["Absent", s.absentDays],
                ["Leave", (s.paidLeaveDays ?? 0) + (s.unpaidLeaveDays ?? 0)],
                ["Late", s.lateDays],
                ["Outside", s.outsideDays],
                ["Hours", s.totalHours !== undefined ? formatHours(s.totalHours) : undefined],
              ] as const
            ).map(([label, value]) => (
              <View key={label} style={styles.stat}>
                <AppText variant="h3">{value ?? "—"}</AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {label}
                </AppText>
              </View>
            ))}
          </Card>
        ) : null}

        {days.map((d) => {
          const st = dayStatus(d);
          return (
            <Pressable key={d.dateKey} accessibilityRole="button" onPress={() => router.push({ pathname: "/attendance/day/[date]", params: { date: d.dateKey } })}>
              <Card style={styles.dayRow}>
                <View style={styles.dayMain}>
                  <AppText variant="bodyStrong">{formatDateKey(d.dateKey)}</AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {d.firstIn ? `${formatTime(d.firstIn)} – ${d.lastOut ? formatTime(d.lastOut) : "…"}` : "No punches"}
                    {d.workedHours ? ` · ${formatHours(d.workedHours)}` : ""}
                    {d.remark ? " · remark" : ""}
                  </AppText>
                </View>
                <AppText variant="micro" color={TONE_COLOR[st.tone]}>
                  {st.label.toUpperCase()}
                </AppText>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: layout.gutter },
  monthHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 0, marginBottom: spacing.md },
  arrow: { minWidth: layout.touchTarget, minHeight: layout.touchTarget, alignItems: "center", justifyContent: "center" },
  dim: { opacity: 0.3 },
  summary: { flexDirection: "row", flexWrap: "wrap" },
  stat: { width: "33%", paddingVertical: spacing.sm },
  dayRow: { flexDirection: "row", alignItems: "center" },
  dayMain: { flex: 1, marginRight: spacing.sm },
});
