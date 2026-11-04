import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { endpoints } from "@/core/services";
import { pieces } from "@/features/work/work";
import { colors, radius, spacing } from "@/theme/tokens";

/** SUP-006 Team work status: running production orders in scope, lot progress on tap. */
export default function TeamOrders() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn" && !!auth.me?.permissions.production?.view;
  const list = useQuery({ queryKey: ["team", "orders"], queryFn: endpoints.productionOrders, enabled });
  const [open, setOpen] = useState<string | null>(null);
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Team work status
      </AppText>
      {list.isPending && enabled ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data?.length === 0 ? <AppText color={colors.textSecondary}>No production orders running.</AppText> : null}
      {list.data?.map((o) => (
        <Pressable key={o.id} accessibilityRole="button" accessibilityState={{ expanded: open === o.id }} onPress={() => setOpen(open === o.id ? null : o.id)}>
          <Card>
            <AppText variant="bodyStrong">
              {o.orderNumber} · {o.product?.styleName ?? ""}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Made {o.producedQuantity} of {pieces(o.plannedQuantity)}
            </AppText>
            <Bar value={o.producedQuantity} total={pieces(o.plannedQuantity)} />
            {open === o.id ? <OrderLots id={o.id} /> : null}
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

function OrderLots({ id }: { id: string }) {
  const d = useQuery({ queryKey: ["team", "order", id], queryFn: () => endpoints.productionOrder(id) });
  if (d.isPending) return <ActivityIndicator color={colors.primary} />;
  if (d.error) return <Banner tone="danger" message={(d.error as Error).message} />;
  return (
    <View style={styles.lots}>
      {d.data?.progress.lots.map((l) => (
        <View key={l.lotId} style={styles.lot}>
          <AppText variant="caption">
            Lot {l.lotNumber} · {l.producedQuantity}/{l.plannedQuantity}
            {l.rejectedQuantity ? ` · rejected ${l.rejectedQuantity}` : ""} · {l.status.replace(/_/g, " ").toLowerCase()}
          </AppText>
          <Bar value={l.producedQuantity} total={l.plannedQuantity} />
        </View>
      ))}
    </View>
  );
}

function Bar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <View style={styles.track} accessibilityLabel={`${pct}% done`}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  track: { height: 6, backgroundColor: colors.primaryTint, borderRadius: radius.full, marginTop: spacing.sm, overflow: "hidden" },
  fill: { height: 6, backgroundColor: colors.primary },
  lots: { marginTop: spacing.md },
  lot: { marginBottom: spacing.sm },
});
