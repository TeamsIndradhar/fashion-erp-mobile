import { useQuery } from "@tanstack/react-query";
import { Redirect, router, type Href } from "expo-router";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { OfflineBanner } from "@/components/OfflineBanner";
import { endpoints } from "@/core/services";
import { groupBySection } from "@/features/reports/reports";
import { formatDateTime } from "@/lib/dates";
import { colors, layout, spacing } from "@/theme/tokens";

/**
 * OWN-001 / ADM-001 Business dashboard: the ERP's Executive Dashboard report
 * (sections the server allows this viewer) + ADM-002 waiting-approvals counts.
 * Every number comes from an existing ERP report or list — nothing invented.
 */
export default function Dashboard() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn" && !!auth.me?.viewableModules.includes("reports");
  const exec = useQuery({ queryKey: ["dashboard", "executive"], queryFn: () => endpoints.report("dashboard", "executive-dashboard"), enabled });
  const ap = auth.me?.permissions.approvals;
  const canProd = !!auth.me?.permissions.production?.approve;
  const on = auth.status === "signedIn";
  const counts = [
    useCount("Payment requests", "/approvals", on && !!ap?.paymentRequest, ["approvals", "pay"], endpoints.paymentRequestsToApprove),
    useCount("Purchase orders", "/approvals", on && !!ap?.purchaseOrder, ["approvals", "po"], endpoints.purchaseOrdersToApprove),
    useCount("Material requests", "/approvals", on && !!ap?.materialRequest, ["approvals", "mr"], endpoints.materialRequestsToApprove),
    useCount("Production entries", "/team/approvals", on && canProd, ["team", "pending"], endpoints.pendingEntries),
    useCount("Leave", "/team/reviews", on && !!ap?.leave, ["team", "review", "leave"], endpoints.teamLeave),
    useCount("Corrections", "/team/reviews", on && !!ap?.correction, ["team", "review", "correction"], endpoints.teamCorrections),
    useCount("Outside punches", "/team/reviews", on && !!ap?.outdoor, ["team", "review", "outside"], endpoints.teamOutside),
    useCount("Overtime", "/team/reviews", on && !!ap?.overtime, ["team", "review", "overtime"], endpoints.teamOvertime),
  ].filter((c) => c.enabled);

  if (!on) return <Redirect href="/" />;
  const sections = exec.data ? groupBySection(exec.data.descriptor) : [];
  const waiting = counts.reduce((s, c) => s + (c.count ?? 0), 0);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <OfflineBanner />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={exec.isRefetching} onRefresh={() => void Promise.all([exec.refetch(), ...counts.map((c) => c.refetch())])} />}
      >
        <AppText variant="h2" style={styles.title}>
          Business dashboard
        </AppText>

        {counts.length > 0 ? (
          <Card>
            <AppText variant="h3" style={styles.label}>
              Waiting for you{waiting ? ` (${waiting})` : ""}
            </AppText>
            {counts.map((c) => (
              <Pressable key={c.label} accessibilityRole="button" onPress={() => router.push(c.href)} style={styles.countRow}>
                <AppText style={styles.flex}>{c.label}</AppText>
                <AppText variant="bodyStrong" color={c.count ? colors.warning : colors.textSecondary}>
                  {c.count ?? "…"}
                </AppText>
              </Pressable>
            ))}
          </Card>
        ) : null}

        {!enabled ? <Banner tone="info" message="You don't have access to business reports." /> : null}
        {exec.isPending && enabled ? <ActivityIndicator color={colors.primary} /> : null}
        {exec.error ? <Banner tone="danger" message={(exec.error as Error).message} /> : null}
        {exec.data && sections.length === 0 ? <AppText color={colors.textSecondary}>No sections of the dashboard are open to your role.</AppText> : null}
        {sections.map((s) => (
          <Card key={s.section}>
            <AppText variant="h3" style={styles.label}>
              {s.section}
            </AppText>
            <View style={styles.grid}>
              {s.items.map((m) => (
                <View key={m.metric} style={styles.metric}>
                  <AppText variant="bodyStrong">{m.value}</AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {m.metric}
                  </AppText>
                </View>
              ))}
            </View>
          </Card>
        ))}
        {exec.data ? (
          <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
            As of {formatDateTime(exec.data.descriptor.generatedAt)}
          </AppText>
        ) : null}
        {enabled ? <Button kind="secondary" title="All reports" onPress={() => router.push("/reports")} testID="dashboard-reports" /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function useCount(label: string, href: Href, enabled: boolean, queryKey: string[], fn: () => Promise<unknown[]>) {
  const q = useQuery({ queryKey, queryFn: fn, enabled });
  return { label, href, enabled, count: q.data ? q.data.length : null, refetch: q.refetch };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: layout.gutter },
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  label: { marginBottom: spacing.sm },
  countRow: { flexDirection: "row", alignItems: "center", minHeight: layout.touchTarget, borderTopWidth: 1, borderTopColor: colors.border },
  flex: { flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  metric: { width: "50%", paddingVertical: spacing.sm, paddingRight: spacing.sm },
});
