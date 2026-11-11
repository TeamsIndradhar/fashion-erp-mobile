import { useQuery } from "@tanstack/react-query";
import { Redirect, router, type Href } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { Icon, IconTile, type IconName, type IconTone } from "@/components/Icon";
import { InnerHeader } from "@/components/InnerHeader";
import { Screen } from "@/components/Screen";
import { endpoints } from "@/core/services";
import { monthRange, rangeQuery, sumBy } from "@/features/attendance/summaries";
import { formatHours, formatMonthKey, istMonthKey } from "@/lib/dates";
import { colors, layout, spacing } from "@/theme/tokens";

/** D-045 Monthly attendance dashboard: the month's summary plus overtime, outdoor, regularization and leave for that month. */
export default function AttendanceMonthDashboard() {
  const auth = useAuth();
  const [delta, setDelta] = useState(0);
  const monthKey = istMonthKey(new Date(), delta);
  const range = monthRange(monthKey);
  const enabled = auth.status === "signedIn";
  const modules = new Set(auth.me?.viewableModules ?? []);
  const canLeave = modules.has("hrms_leave");
  const canCorrection = modules.has("hrms_attendance_regularization");
  const q = rangeQuery(range);
  const one = rangeQuery(range, { page: 1, pageSize: 1 });

  const month = useQuery({ queryKey: ["attendance", "month", monthKey], queryFn: () => endpoints.attendanceMonth(monthKey), enabled });
  const overtime = useQuery({ queryKey: ["attendance", "overtime", q], queryFn: () => endpoints.myOvertime(q), enabled });
  const outdoor = useQuery({ queryKey: ["attendance", "outdoor", q], queryFn: () => endpoints.myOutdoorRejections(q), enabled });
  const corrections = useQuery({ queryKey: ["corrections", "page", one], queryFn: () => endpoints.myCorrectionsPage(one), enabled: enabled && canCorrection });
  const leaves = useQuery({ queryKey: ["leave", "page", one], queryFn: () => endpoints.myLeavePage(one), enabled: enabled && canLeave });

  if (!enabled) return <Redirect href="/" />;
  const s = month.data?.summary;
  const params = { from: range.from, to: range.to };
  const refresh = () => void Promise.all([month.refetch(), overtime.refetch(), outdoor.refetch(), corrections.refetch(), leaves.refetch()]);

  return (
    <Screen refreshing={month.isRefetching} onRefresh={refresh}>
      <InnerHeader title="Monthly dashboard" />
      <View style={styles.monthHead}>
        <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={() => setDelta((d) => d - 1)} style={styles.arrow} testID="dash-prev">
          <Icon name="chevLeft" tone="primary" />
        </Pressable>
        <AppText variant="h3">{formatMonthKey(monthKey)}</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          disabled={delta >= 0}
          onPress={() => setDelta((d) => Math.min(0, d + 1))}
          style={[styles.arrow, delta >= 0 && styles.dim]}
          testID="dash-next"
        >
          <Icon name="chev" tone="primary" />
        </Pressable>
      </View>

      {month.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {month.error ? <Banner tone="danger" message={(month.error as Error).message} /> : null}
      {s ? (
        <Card style={styles.stats}>
          {(
            [
              ["Working days", s.workingDays],
              ["Present", s.presentDays],
              ["Absent", s.absentDays],
              ["Leave", (s.paidLeaveDays ?? 0) + (s.unpaidLeaveDays ?? 0)],
              ["Late", s.lateDays],
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

      <AppText variant="h3" style={styles.section}>
        This month
      </AppText>
      <Row
        icon="clock"
        tone="info"
        title="Overtime"
        value={overtime.data ? `${formatHours(sumBy(overtime.data, (r) => r.hours))} · ${overtime.data.length} day(s)` : overtime.error ? "—" : "…"}
        href={{ pathname: "/attendance/overtime", params }}
        testID="dash-overtime"
      />
      <Row
        icon="pin"
        tone="danger"
        title="Rejected outdoor punches"
        value={outdoor.data ? `${outdoor.data.length} · ${outdoor.data.filter((r) => r.status === "PENDING").length} pending` : outdoor.error ? "—" : "…"}
        href={{ pathname: "/attendance/outdoor", params }}
        testID="dash-outdoor"
      />
      {canCorrection ? (
        <Row
          icon="edit"
          tone="warning"
          title="Regularizations"
          value={corrections.data ? `${corrections.data.meta.totalCount} request(s)` : corrections.error ? "—" : "…"}
          href={{ pathname: "/attendance/regularizations", params }}
          testID="dash-regularization"
        />
      ) : null}
      {canLeave ? (
        <Row
          icon="calendar"
          tone="accent"
          title="Leaves"
          value={leaves.data ? `${leaves.data.meta.totalCount} request(s)` : leaves.error ? "—" : "…"}
          href={{ pathname: "/leave/list", params }}
          testID="dash-leave"
        />
      ) : null}
      <Row icon="file" tone="primary" title="Day-by-day report" value="Open" href="/attendance/report" testID="dash-report" />
    </Screen>
  );
}

function Row({ icon, tone, title, value, href, testID }: { icon: IconName; tone: IconTone; title: string; value: string; href: Href; testID: string }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => router.push(href)} testID={testID}>
      <Card style={styles.row}>
        <IconTile name={icon} tone={tone} size={40} />
        <View style={styles.rowText}>
          <AppText variant="bodyStrong">{title}</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {value}
          </AppText>
        </View>
        <Icon name="chev" tone="muted" size={20} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  monthHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  arrow: { minWidth: layout.touchTarget, minHeight: layout.touchTarget, alignItems: "center", justifyContent: "center" },
  dim: { opacity: 0.3 },
  stats: { flexDirection: "row", flexWrap: "wrap" },
  stat: { width: "33%", paddingVertical: spacing.sm },
  section: { marginTop: spacing.lg, marginBottom: spacing.md },
  row: { flexDirection: "row", alignItems: "center" },
  rowText: { flex: 1, marginHorizontal: spacing.md },
});
