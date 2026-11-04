import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chips } from "@/components/Chips";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { endpoints } from "@/core/services";
import { fmtQty } from "@/features/inventory/inventory";
import { formatDateTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

type Tab = "raw" | "fg" | "moves";

/** INV-001 Inventory home · INV-002 stock balance · INV-005 finished goods · INV-006 transfers. */
export default function InventoryHome() {
  const auth = useAuth();
  const mods = new Set(auth.me?.viewableModules ?? []);
  const tabs = (
    [
      ["raw", "Raw material", mods.has("inventory")],
      ["fg", "Finished goods", mods.has("fg_inventory")],
      ["moves", "Transfers", mods.has("inventory")],
    ] as const
  )
    .filter(([, , ok]) => ok)
    .map(([value, label]) => ({ value: value as Tab, label }));
  const [tab, setTab] = useState<Tab | null>(null);
  const active = tab ?? tabs[0]?.value ?? null;
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  // Search after typing stops for a moment.
  useEffect(() => {
    const t = setTimeout(() => setSearch(text.trim()), 400);
    return () => clearTimeout(t);
  }, [text]);
  if (auth.status !== "signedIn") return <Redirect href="/" />;

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Inventory
      </AppText>
      {tabs.length === 0 ? <Banner tone="info" message="You don't have access to stock." /> : null}
      <View style={styles.pair}>
        {auth.me?.permissions.inventory?.scan ? (
          <View style={styles.cell}>
            <Button title="Scan barcode" onPress={() => router.push("/inventory/scan")} testID="inventory-scan" />
          </View>
        ) : null}
        {mods.has("inventory") && mods.has("reports") ? (
          <View style={styles.cell}>
            <Button kind="secondary" title="Low stock" onPress={() => router.push({ pathname: "/reports/[category]/[key]", params: { category: "inventory", key: "low-stock-report", title: "Low stock" } })} />
          </View>
        ) : null}
      </View>
      {tabs.length > 0 ? <Chips options={tabs} value={active} onChange={setTab} /> : null}
      {active !== "moves" && tabs.length > 0 ? <TextField label="Search name or code" value={text} onChangeText={setText} autoCapitalize="none" /> : null}
      {active === "raw" ? <RawList search={search} /> : null}
      {active === "fg" ? <FgList search={search} /> : null}
      {active === "moves" ? <Moves /> : null}
    </Screen>
  );
}

function RawList({ search }: { search: string }) {
  const q = useQuery({ queryKey: ["inv", "raw", search], queryFn: () => endpoints.rawStock(search) });
  return (
    <>
      {q.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {q.error ? <Banner tone="danger" message={(q.error as Error).message} /> : null}
      {q.data?.length === 0 ? <AppText color={colors.textSecondary}>Nothing in stock{search ? " for this search" : ""}.</AppText> : null}
      {q.data?.map((r) => (
        <Pressable key={r.id} accessibilityRole="button" onPress={() => router.push({ pathname: "/inventory/item/[id]", params: { id: r.productId } })}>
          <Card>
            <View style={styles.row}>
              <AppText variant="bodyStrong" style={styles.flex} numberOfLines={1}>
                {r.materialName}
              </AppText>
              <AppText variant="bodyStrong">{fmtQty(r.availableStock, r.unit)}</AppText>
            </View>
            <AppText variant="caption" color={colors.textSecondary}>
              {[r.materialCode, r.materialCategory, r.rollCount ? `${r.rollCount} rolls` : null, r.colourCount ? `${r.colourCount} colours` : null].filter(Boolean).join(" · ")}
            </AppText>
          </Card>
        </Pressable>
      ))}
    </>
  );
}

function FgList({ search }: { search: string }) {
  const q = useQuery({ queryKey: ["inv", "fg", search], queryFn: () => endpoints.fgStock(search) });
  return (
    <>
      {q.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {q.error ? <Banner tone="danger" message={(q.error as Error).message} /> : null}
      {q.data?.length === 0 ? <AppText color={colors.textSecondary}>No finished goods{search ? " for this search" : ""}.</AppText> : null}
      {q.data?.map((r) => (
        <Pressable key={r.id} accessibilityRole="button" onPress={() => router.push({ pathname: "/inventory/style/[id]", params: { id: r.productId, title: r.styleName } })}>
          <Card>
            <View style={styles.row}>
              <AppText variant="bodyStrong" style={styles.flex} numberOfLines={1}>
                {r.styleName}
              </AppText>
              <AppText variant="bodyStrong">{fmtQty(r.saleableStock)} pcs</AppText>
            </View>
            <AppText variant="caption" color={colors.textSecondary}>
              {[r.styleCode, `${r.colourCount} colours`, `${r.sizeCount} sizes`, r.rejectedStock ? `${fmtQty(r.rejectedStock)} rejected` : null].filter(Boolean).join(" · ")}
            </AppText>
          </Card>
        </Pressable>
      ))}
    </>
  );
}

function Moves() {
  const [status, setStatus] = useState<"IN_TRANSIT" | "ALL">("IN_TRANSIT");
  const q = useQuery({ queryKey: ["inv", "moves", status], queryFn: () => endpoints.movements(status === "ALL" ? undefined : status) });
  return (
    <>
      <Chips
        options={[
          { value: "IN_TRANSIT", label: "To receive" },
          { value: "ALL", label: "All movements" },
        ]}
        value={status}
        onChange={setStatus}
      />
      {q.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {q.error ? <Banner tone="danger" message={(q.error as Error).message} /> : null}
      {q.data?.length === 0 ? <AppText color={colors.textSecondary}>{status === "IN_TRANSIT" ? "No transfers on the way." : "No stock movements."}</AppText> : null}
      {q.data?.map((m) => (
        <Pressable key={m.id} accessibilityRole="button" onPress={() => router.push({ pathname: "/inventory/movement/[id]", params: { id: m.id } })}>
          <Card>
            <View style={styles.row}>
              <AppText variant="bodyStrong" style={styles.flex}>
                {m.movementNumber} · {m.movementType.replace(/_/g, " ").toLowerCase()}
              </AppText>
              <AppText variant="micro" color={m.status === "IN_TRANSIT" ? colors.warning : colors.success}>
                {m.status === "IN_TRANSIT" ? "ON THE WAY" : m.status === "RECEIVED" ? "RECEIVED" : "POSTED"}
              </AppText>
            </View>
            <AppText variant="caption" color={colors.textSecondary}>
              {[m.warehouse?.name, m.toWarehouse ? `→ ${m.toWarehouse.name}` : null, m._count ? `${m._count.items} line(s)` : null, formatDateTime(m.movementDate ?? m.createdAt)].filter(Boolean).join(" · ")}
            </AppText>
          </Card>
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  pair: { flexDirection: "row", marginHorizontal: -spacing.xs, marginBottom: spacing.md },
  cell: { flex: 1, paddingHorizontal: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1, marginRight: spacing.sm },
});
