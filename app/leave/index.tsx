import { useQueries, useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { InnerHeader } from "@/components/InnerHeader";
import { ModuleGrid, type ModuleTile } from "@/components/ModuleGrid";
import { Screen } from "@/components/Screen";
import { endpoints } from "@/core/services";
import { rangeQuery } from "@/features/attendance/summaries";
import { spacing } from "@/theme/tokens";

/** D-045 Leave module: apply, my leaves with status, pending leaves, this year's balance. */
export default function LeaveHub() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn";
  const me = auth.me;
  const allowed = !!me?.employee && !!me.viewableModules.includes("hrms_leave");
  const year = new Date().getFullYear();
  const yearRange = { from: `${year}-01-01`, to: `${year}-12-31` };
  const pendingQ = rangeQuery(yearRange, { status: "PENDING", page: 1, pageSize: 1 });
  const pending = useQuery({ queryKey: ["leave", "page", pendingQ], queryFn: () => endpoints.myLeavePage(pendingQ), enabled: enabled && allowed });
  const types = useQuery({ queryKey: ["leave", "types"], queryFn: endpoints.leaveTypes, enabled: enabled && allowed });
  const active = (types.data ?? []).filter((t) => t.isActive);
  const balances = useQueries({
    queries: active.map((t) => ({
      queryKey: ["leave", "balance", t.id, year],
      queryFn: () => endpoints.leaveBalance(me!.employee!.id, t.id, year),
      enabled: enabled && allowed,
    })),
  });

  if (!enabled || !me) return <Redirect href="/" />;
  const pendingCount = pending.data?.meta.totalCount;

  const tiles: ModuleTile[] = [
    { key: "apply", label: "Apply Leave", icon: "edit", tone: "primary", onPress: () => router.push("/requests/leave") },
    { key: "mine", label: "Leaves", icon: "calendar", tone: "accent", onPress: () => router.push("/leave/list") },
    { key: "pending", label: "Pending Leaves", icon: "clock", tone: "warning", count: pendingCount || undefined, onPress: () => router.push({ pathname: "/leave/list", params: { status: "PENDING" } }) },
  ];

  return (
    <Screen>
      <InnerHeader title="Leave" />
      {!allowed ? <Banner tone="info" message="Leave is not available for your login. Contact HR." /> : null}
      {allowed ? <ModuleGrid tiles={tiles} /> : null}
      {allowed && active.length > 0 ? (
        <Card style={styles.card}>
          <AppText variant="h3" style={styles.title}>
            Balance {year}
          </AppText>
          {active.map((t, i) => {
            const b = balances[i]?.data;
            return (
              <View key={t.id} style={styles.row}>
                <AppText style={styles.flex}>{t.name}</AppText>
                <AppText variant="bodyStrong">{b ? `${b.remainingDays} / ${b.annualDays} left` : "—"}</AppText>
              </View>
            );
          })}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.md },
  title: { marginBottom: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.xs },
  flex: { flex: 1 },
});
