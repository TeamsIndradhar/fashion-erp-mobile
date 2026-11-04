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
import { fmtQty } from "@/features/inventory/inventory";
import { colors, spacing } from "@/theme/tokens";

/** INV-005 detail: finished goods of one style by colour × size and by warehouse / rack. */
export default function FgStyle() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const auth = useAuth();
  const enabled = auth.status === "signedIn" && !!id;
  const q = useQuery({ queryKey: ["inv", "fg", "style", id], queryFn: () => endpoints.fgStockDetail(id!), enabled });
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const d = q.data;
  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        {title ?? "Finished goods"}
      </AppText>
      {q.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {q.error ? <Banner tone="danger" message={(q.error as Error).message} /> : null}
      {d ? (
        <>
          <Card>
            <ListRow label="Ready to sell" value={`${fmtQty(d.saleableStock)} pcs`} />
            <ListRow label="Rejected" value={`${fmtQty(d.rejectedStock)} pcs`} />
          </Card>
          {d.colours.map((c) => (
            <Card key={c.colorId ?? "none"}>
              <AppText variant="bodyStrong" style={styles.label}>
                {c.colorName ?? "No colour"} · {fmtQty(c.saleableQuantity)} pcs
              </AppText>
              {c.sizes.map((s) => (
                <ListRow
                  key={s.sizeId ?? "none"}
                  label={`${s.sizeName ?? "No size"}${s.places.length ? ` · ${s.places.map((p) => p.label).join(", ")}` : ""}`}
                  value={`${fmtQty(s.saleableQuantity)}${s.rejectedQuantity ? ` (+${fmtQty(s.rejectedQuantity)} rej.)` : ""}`}
                />
              ))}
            </Card>
          ))}
          {d.warehouses.length ? (
            <Card>
              <AppText variant="bodyStrong" style={styles.label}>
                By warehouse
              </AppText>
              {d.warehouses.map((w) => (
                <ListRow key={w.warehouseId} label={w.warehouseName} value={`${fmtQty(w.saleableQuantity)} pcs`} />
              ))}
            </Card>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  label: { marginBottom: spacing.sm },
});
