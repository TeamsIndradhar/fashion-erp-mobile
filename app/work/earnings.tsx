import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { endpoints } from "@/core/services";
import { formatMoney } from "@/features/requests/requests";
import { pieces } from "@/features/work/work";
import { formatDateTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

/** WRK-009 My piece-rate earnings (empty unless the company lets workers see their rates). */
export default function Earnings() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn";
  const list = useQuery({ queryKey: ["work", "earnings"], queryFn: endpoints.myEarnings, enabled });
  if (!enabled) return <Redirect href="/" />;
  const total = (list.data ?? []).filter((e) => e.status !== "CANCELLED").reduce((s, e) => s + Number(e.amount || 0), 0);
  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Earnings
      </AppText>
      {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data?.length === 0 ? (
        <Banner tone="info" message="No earnings to show. Your company may not show piece rates to workers — ask your supervisor." />
      ) : null}
      {list.data && list.data.length > 0 ? (
        <Card>
          <AppText variant="caption" color={colors.textSecondary}>
            Total shown
          </AppText>
          <AppText variant="display">{formatMoney(total)}</AppText>
        </Card>
      ) : null}
      {list.data?.map((e) => (
        <Card key={e.id}>
          <View style={styles.row}>
            <AppText variant="bodyStrong" style={styles.flex}>
              {e.jobOrder?.productionStage?.name ?? e.productionOperation?.name ?? "Work"} · {e.jobOrder?.lot?.lotNumber ?? ""}
            </AppText>
            <AppText variant="bodyStrong">{formatMoney(e.amount)}</AppText>
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            {pieces(e.payableQuantity)} pcs × {formatMoney(e.rateApplied)} · {e.status.replace(/_/g, " ").toLowerCase()} · {formatDateTime(e.createdAt)}
          </AppText>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
});
