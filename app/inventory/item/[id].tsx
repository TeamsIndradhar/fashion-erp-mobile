import { useQuery } from "@tanstack/react-query";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { endpoints } from "@/core/services";
import { fmtQty } from "@/features/inventory/inventory";
import { colors, spacing } from "@/theme/tokens";

/** INV-002 detail: one raw material by warehouse, colour and roll; INV-003 opens the stock ledger report. */
export default function RawItem() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const auth = useAuth();
  const enabled = auth.status === "signedIn" && !!id;
  const q = useQuery({ queryKey: ["inv", "raw", "item", id], queryFn: () => endpoints.rawStockDetail(id!), enabled });
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const d = q.data;
  return (
    <Screen>
      {q.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {q.error ? <Banner tone="danger" message={(q.error as Error).message} /> : null}
      {d ? (
        <>
          <AppText variant="h2" style={styles.title}>
            {d.materialName}
          </AppText>
          <Card>
            <ListRow label="Code" value={d.materialCode} />
            <ListRow label="Available" value={fmtQty(d.availableStock, d.unit)} />
            <ListRow label="Total" value={fmtQty(d.totalStock, d.unit)} />
            {d.rollCount ? <ListRow label="Rolls" value={String(d.rollCount)} /> : null}
          </Card>
          {d.warehouses.length ? (
            <Card>
              <AppText variant="bodyStrong" style={styles.label}>
                By warehouse
              </AppText>
              {d.warehouses.map((w) => (
                <ListRow key={w.warehouseId} label={w.warehouseName} value={fmtQty(w.quantity, d.unit)} />
              ))}
            </Card>
          ) : null}
          {d.colourBalances.length ? (
            <Card>
              <AppText variant="bodyStrong" style={styles.label}>
                By colour
              </AppText>
              {d.colourBalances.map((c) => (
                <ListRow key={c.colorId ?? "none"} label={c.colorName ?? "No colour"} value={fmtQty(c.quantity, d.unit)} />
              ))}
            </Card>
          ) : null}
          {d.colours.some((c) => c.rolls.length) ? (
            <Card>
              <AppText variant="bodyStrong" style={styles.label}>
                Rolls
              </AppText>
              {d.colours.flatMap((c) =>
                c.rolls.map((r) => (
                  <ListRow
                    key={r.id}
                    label={[r.rollNumber, c.colorName, r.shadeCode && `shade ${r.shadeCode}`, r.locationLabel ?? r.warehouseName].filter(Boolean).join(" · ")}
                    value={fmtQty(r.remainingQuantity, d.unit)}
                  />
                ))
              )}
            </Card>
          ) : null}
          {auth.me?.viewableModules.includes("reports") ? (
            <Button
              kind="secondary"
              title="Stock ledger"
              onPress={() =>
                router.push({ pathname: "/reports/[category]/[key]", params: { category: "inventory", key: "stock-ledger", title: `Ledger · ${d.materialName}`, filters: JSON.stringify({ productId: d.materialId }) } })
              }
            />
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
