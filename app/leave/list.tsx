import { useQuery } from "@tanstack/react-query";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { InnerHeader } from "@/components/InnerHeader";
import { ListFilters, Pager, useListFilters } from "@/components/ListFilters";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { endpoints } from "@/core/services";
import { rangeQuery } from "@/features/attendance/summaries";
import { formatDateKey } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

const STATUSES = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

/** D-045 My leaves with status (and "Pending leaves" = status PENDING): leaves overlapping the dates, server-paged 10/20/30. */
export default function LeaveList() {
  const auth = useAuth();
  const params = useLocalSearchParams<{ from?: string; to?: string; status?: string }>();
  const f = useListFilters({ ...params, from: params.from ?? `${new Date().getFullYear()}-01-01`, to: params.to ?? `${new Date().getFullYear()}-12-31` });
  const enabled = auth.status === "signedIn";
  const q = rangeQuery(f.range, { status: f.status === "ALL" ? undefined : f.status, page: f.page, pageSize: f.pageSize, sortBy: "startDate" });
  const list = useQuery({ queryKey: ["leave", "page", q], queryFn: () => endpoints.myLeavePage(q), enabled });

  if (!enabled) return <Redirect href="/" />;
  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;
  const pendingView = f.status === "PENDING";

  return (
    <Screen refreshing={list.isRefetching} onRefresh={() => void list.refetch()}>
      <InnerHeader title={pendingView ? "Pending leaves" : "My leaves"} />
      <Button icon="calendar" title="Apply for leave" onPress={() => router.push("/requests/leave")} testID="leave-list-apply" />
      <View style={styles.gap} />
      <ListFilters f={f} statuses={STATUSES} testID="leave" />
      {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data && rows.length === 0 ? <AppText color={colors.textSecondary}>{pendingView ? "No leave is waiting for approval." : "No leave in these dates."}</AppText> : null}
      {rows.map((r) => {
        const start = r.startDate.slice(0, 10);
        const end = r.endDate.slice(0, 10);
        const days = r.days.reduce((s, d) => s + (Number(d.fraction) || 0), 0) || r.days.length;
        return (
          <Card key={r.id}>
            <View style={styles.row}>
              <AppText variant="bodyStrong" style={styles.flex}>
                {r.leaveType.name}
              </AppText>
              <StatusPill status={r.status} />
            </View>
            <AppText variant="caption" color={colors.textSecondary}>
              {formatDateKey(start)}
              {end !== start ? ` – ${formatDateKey(end)}` : ""} · {days} day{days === 1 ? "" : "s"} · applied {formatDateKey(r.createdAt.slice(0, 10))}
            </AppText>
            {r.reason ? <AppText variant="caption">{r.reason}</AppText> : null}
            {r.rejectionReason ? (
              <AppText variant="caption" color={colors.danger}>
                {r.rejectionReason}
              </AppText>
            ) : null}
          </Card>
        );
      })}
      {meta ? <Pager page={meta.page} totalPages={meta.totalPages} total={meta.totalCount} onPage={f.setPage} testID="leave-pager" /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { height: spacing.md },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
});
