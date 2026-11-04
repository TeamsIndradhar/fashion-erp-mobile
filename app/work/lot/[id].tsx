import { useQuery } from "@tanstack/react-query";
import { Redirect, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { endpoints } from "@/core/services";
import { pieces } from "@/features/work/work";
import { colors, spacing } from "@/theme/tokens";

/** WRK-008 Assigned lot: style, colour/size split, current stage, my part. */
export default function LotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const auth = useAuth();
  const enabled = auth.status === "signedIn" && !!id;
  const lot = useQuery({ queryKey: ["work", "lot", id], queryFn: () => endpoints.lot(id!), enabled });
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const l = lot.data;
  return (
    <Screen>
      {lot.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {lot.error ? <Banner tone="danger" message={(lot.error as Error).message} /> : null}
      {l ? (
        <>
          <AppText variant="h2" style={styles.title}>
            Lot {l.lotNumber}
          </AppText>
          <Card>
            <ListRow label="Style" value={l.productionOrder?.product?.styleName ?? null} />
            <ListRow label="Order" value={l.productionOrder?.orderNumber ?? null} />
            <ListRow label="Pieces in lot" value={String(pieces(l.quantity))} />
            <ListRow label="Now at" value={l.currentStage?.name ?? null} />
          </Card>
          {l.variantBreakdown.length > 0 ? (
            <Card>
              <AppText variant="bodyStrong" style={styles.label}>
                Colour / size
              </AppText>
              {l.variantBreakdown.map((v) => (
                <ListRow key={v.id} label={[v.productVariant.color?.name, v.productVariant.size?.name].filter(Boolean).join(" · ") || v.productVariant.skuCode} value={`${pieces(v.quantity)} pcs`} />
              ))}
            </Card>
          ) : null}
          {l.jobOrders.map((jo) => (
            <Card key={jo.id}>
              <AppText variant="bodyStrong">
                {jo.productionStage.name} · {jo.jobNumber}
              </AppText>
              {jo.assignments.map((a) => (
                <AppText key={a.id} variant="caption" color={colors.textSecondary}>
                  You: assigned {pieces(a.assignedQuantity)} · entered {a.loggedQuantity} · left {a.remainingQuantity}
                </AppText>
              ))}
            </Card>
          ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  label: { marginBottom: spacing.sm },
});
