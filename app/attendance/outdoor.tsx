import { useQuery } from "@tanstack/react-query";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { InnerHeader } from "@/components/InnerHeader";
import { ListFilters, Pager, useListFilters } from "@/components/ListFilters";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { endpoints } from "@/core/services";
import { paginate, rangeQuery } from "@/features/attendance/summaries";
import { formatDateKey, formatTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

const OUTDOOR_STATUSES = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROCESS", label: "Clarified" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

/** D-045 Rejected outdoor punches: date range, status, 10/20/30 per page. */
export default function OutdoorSummary() {
  const auth = useAuth();
  const params = useLocalSearchParams<{ from?: string; to?: string; status?: string }>();
  const f = useListFilters(params);
  const enabled = auth.status === "signedIn";
  const q = rangeQuery(f.range, { status: f.status === "ALL" ? undefined : f.status });
  const list = useQuery({ queryKey: ["attendance", "outdoor", q], queryFn: () => endpoints.myOutdoorRejections(q), enabled });

  if (!enabled) return <Redirect href="/" />;
  const all = list.data ?? [];
  const pg = paginate(all, f.page, f.pageSize);
  const pending = all.filter((r) => r.status === "PENDING").length;

  return (
    <Screen refreshing={list.isRefetching} onRefresh={() => void list.refetch()}>
      <InnerHeader title="Rejected outdoor punches" />
      <ListFilters f={f} statuses={OUTDOOR_STATUSES} testID="outdoor" />
      {!list.isPending && !list.error ? (
        <Card style={styles.summary}>
          <AppText variant="bodyStrong">
            {all.length} outside punch{all.length === 1 ? "" : "es"} trimmed · {pending} waiting for you
          </AppText>
          {pending > 0 ? (
            <AppText variant="caption" color={colors.primary} onPress={() => router.push("/requests/outside")} style={styles.link}>
              Accept or explain the pending ones ›
            </AppText>
          ) : null}
        </Card>
      ) : null}
      {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data && all.length === 0 ? <AppText color={colors.textSecondary}>No rejected outdoor punches in these dates.</AppText> : null}
      {pg.rows.map((r) => {
        const day = r.session?.attendanceRecord?.attendanceDate?.slice(0, 10) ?? r.originalCheckIn.slice(0, 10);
        return (
          <Card key={r.id}>
            <View style={styles.row}>
              <AppText variant="bodyStrong" style={styles.flex}>
                {formatDateKey(day)}
              </AppText>
              <StatusPill status={r.status} />
            </View>
            <AppText variant="caption" color={colors.textSecondary}>
              Punched {formatTime(r.originalCheckIn)} – {r.originalCheckOut ? formatTime(r.originalCheckOut) : "--"} · counted {formatTime(r.trimmedCheckIn)} –{" "}
              {r.trimmedCheckOut ? formatTime(r.trimmedCheckOut) : "--"}
            </AppText>
            {r.rejectedReason ? <AppText variant="caption">{r.rejectedReason}</AppText> : null}
            {r.clarificationReason ? (
              <AppText variant="caption" color={colors.textSecondary}>
                Your reason: {r.clarificationReason}
              </AppText>
            ) : null}
          </Card>
        );
      })}
      <Pager page={pg.page} totalPages={pg.totalPages} total={pg.total} onPage={f.setPage} testID="outdoor-pager" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { marginBottom: spacing.md },
  link: { marginTop: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
});
