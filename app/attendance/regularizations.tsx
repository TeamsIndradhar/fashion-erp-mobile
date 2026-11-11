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
import { CORRECTION_LABEL } from "@/features/requests/requests";
import { formatDateKey, formatTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

const STATUSES = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

/** D-045 Attendance regularization summary: server-paged (10/20/30), date range, status. */
export default function RegularizationSummary() {
  const auth = useAuth();
  const params = useLocalSearchParams<{ from?: string; to?: string; status?: string }>();
  const f = useListFilters(params);
  const enabled = auth.status === "signedIn";
  const q = rangeQuery(f.range, { status: f.status === "ALL" ? undefined : f.status, page: f.page, pageSize: f.pageSize });
  const list = useQuery({ queryKey: ["corrections", "page", q], queryFn: () => endpoints.myCorrectionsPage(q), enabled });

  if (!enabled) return <Redirect href="/" />;
  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;
  const canCreate = !!auth.me?.viewableModules.includes("hrms_attendance_regularization");

  return (
    <Screen refreshing={list.isRefetching} onRefresh={() => void list.refetch()}>
      <InnerHeader title="Attendance regularization" />
      {canCreate ? <Button icon="edit" title="New regularization" onPress={() => router.push("/requests/correction")} testID="regularization-new" /> : null}
      <View style={styles.gap} />
      <ListFilters f={f} statuses={STATUSES} testID="regularization" />
      {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data && rows.length === 0 ? <AppText color={colors.textSecondary}>No regularization requests in these dates.</AppText> : null}
      {rows.map((r) => (
        <Card key={r.id}>
          <View style={styles.row}>
            <AppText variant="bodyStrong" style={styles.flex}>
              {CORRECTION_LABEL[r.type] ?? r.type}
            </AppText>
            <StatusPill status={r.status} />
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            {formatDateKey(r.attendanceDate.slice(0, 10))}
            {r.requestedPunchIn ? ` · In ${formatTime(r.requestedPunchIn)}` : ""}
            {r.requestedPunchOut ? ` · Out ${formatTime(r.requestedPunchOut)}` : ""}
          </AppText>
          <AppText variant="caption">{r.reason}</AppText>
          {r.rejectionReason ? (
            <AppText variant="caption" color={colors.danger}>
              {r.rejectionReason}
            </AppText>
          ) : null}
        </Card>
      ))}
      {meta ? <Pager page={meta.page} totalPages={meta.totalPages} total={meta.totalCount} onPage={f.setPage} testID="regularization-pager" /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { height: spacing.md },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
});
