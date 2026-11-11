import { useQuery } from "@tanstack/react-query";
import { Redirect, useLocalSearchParams } from "expo-router";
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
import { paginate, rangeQuery, sumBy } from "@/features/attendance/summaries";
import { formatMoney } from "@/features/requests/requests";
import { formatDateKey, formatHours } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

const STATUSES = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

/** D-045 Overtime summary: total hours / amount, date range, status, 10/20/30 per page. */
export default function OvertimeSummary() {
  const auth = useAuth();
  const params = useLocalSearchParams<{ from?: string; to?: string; status?: string }>();
  const f = useListFilters(params);
  const enabled = auth.status === "signedIn";
  const q = rangeQuery(f.range, { status: f.status === "ALL" ? undefined : f.status });
  const list = useQuery({ queryKey: ["attendance", "overtime", q], queryFn: () => endpoints.myOvertime(q), enabled });

  if (!enabled) return <Redirect href="/" />;
  const all = list.data ?? [];
  const pg = paginate(all, f.page, f.pageSize);
  const approved = all.filter((r) => r.status === "APPROVED");
  const hasPay = all.some((r) => r.amount !== null);

  return (
    <Screen refreshing={list.isRefetching} onRefresh={() => void list.refetch()}>
      <InnerHeader title="Overtime" />
      <ListFilters f={f} statuses={STATUSES} testID="overtime" />
      {!list.isPending && !list.error ? (
        <Card style={styles.summary}>
          <View style={styles.tiles}>
            <Tile label="Days" value={String(all.length)} />
            <Tile label="Total hours" value={formatHours(sumBy(all, (r) => r.hours))} />
            <Tile label="Approved hours" value={formatHours(sumBy(approved, (r) => r.hours))} />
          </View>
          {hasPay ? (
            <AppText variant="caption" color={colors.textSecondary} style={styles.pay}>
              Approved amount: {formatMoney(sumBy(approved, (r) => r.amount))}
            </AppText>
          ) : null}
        </Card>
      ) : null}
      {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data && all.length === 0 ? <AppText color={colors.textSecondary}>No overtime in these dates.</AppText> : null}
      {pg.rows.map((r) => (
        <Card key={r.id}>
          <View style={styles.row}>
            <AppText variant="bodyStrong" style={styles.flex}>
              {formatDateKey(r.attendanceDate.slice(0, 10))}
            </AppText>
            <StatusPill status={r.status} />
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            Overtime {formatHours(r.hours)} · worked {formatHours(r.workedHours)} of {formatHours(r.shiftHours)} shift
            {r.amount !== null ? ` · ${formatMoney(r.amount)}` : ""}
          </AppText>
          {r.reason ? <AppText variant="caption">{r.reason}</AppText> : null}
        </Card>
      ))}
      <Pager page={pg.page} totalPages={pg.totalPages} total={pg.total} onPage={f.setPage} testID="overtime-pager" />
    </Screen>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.tile}>
      <AppText variant="h3">{value}</AppText>
      <AppText variant="caption" color={colors.textSecondary}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { marginBottom: spacing.md },
  tiles: { flexDirection: "row", justifyContent: "space-between" },
  tile: { flex: 1, alignItems: "center" },
  pay: { marginTop: spacing.sm, textAlign: "center" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
});
