import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chips } from "@/components/Chips";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { fmtQty, receiveReady } from "@/features/inventory/inventory";
import { formatDateTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

/** INV-006 Stock movement details + receive an incoming transfer (choose the rack for each line). */
export default function Movement() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const auth = useAuth();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn" && !!id;
  const q = useQuery({ queryKey: ["inv", "move", id], queryFn: () => endpoints.movement(id!), enabled });
  const m = q.data;
  const canReceive = !!auth.me?.permissions.inventory?.receive && m?.status === "IN_TRANSIT" && m.movementType === "TRANSFER" && !!m.toWarehouseId;
  const locs = useQuery({ queryKey: ["inv", "locs", m?.toWarehouseId], queryFn: () => endpoints.warehouseLocations(m!.toWarehouseId!), enabled: canReceive });
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const receive = useMutation({
    mutationFn: () => endpoints.receiveMovement(id!, (m?.items ?? []).map((i) => ({ itemId: i.id, toWarehouseLocationId: chosen[i.id] }))),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["inv"] }),
    // A retry after a lost response finds it already received: refresh instead of showing a scary error.
    onError: (e) => {
      if (e instanceof ApiError && /already been received/i.test(e.message)) void qc.invalidateQueries({ queryKey: ["inv"] });
    },
  });
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const activeLocs = (locs.data ?? []).filter((l) => l.isActive).map((l) => ({ value: l.id, label: l.code }));

  return (
    <Screen>
      {q.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {q.error ? <Banner tone="danger" message={(q.error as Error).message} /> : null}
      {m ? (
        <>
          <AppText variant="h2" style={styles.title}>
            {m.movementNumber}
          </AppText>
          <Card>
            <ListRow label="Type" value={m.movementType.replace(/_/g, " ").toLowerCase()} />
            <ListRow label="Status" value={m.status.replace(/_/g, " ").toLowerCase()} />
            <ListRow label="From" value={m.warehouse?.name ?? null} />
            {m.toWarehouse ? <ListRow label="To" value={m.toWarehouse.name} /> : null}
            <ListRow label="By" value={m.performedBy?.fullName ?? null} />
            {m.receivedBy ? <ListRow label="Received by" value={m.receivedBy.fullName} /> : null}
            <ListRow label="Date" value={formatDateTime(m.movementDate ?? m.createdAt)} />
          </Card>
          {m.items.map((i) => (
            <Card key={i.id}>
              <AppText variant="bodyStrong">{[i.product?.styleName, i.color?.name].filter(Boolean).join(" · ")}</AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {fmtQty(i.quantity, i.uom?.code)}
                {i.warehouseLocation ? ` · from ${i.warehouseLocation.code}` : ""}
                {i.toWarehouseLocation ? ` · to ${i.toWarehouseLocation.code}` : ""}
              </AppText>
              {canReceive ? (
                <View style={styles.gapTop}>
                  <AppText variant="caption" color={colors.textSecondary}>
                    Put on rack
                  </AppText>
                  {locs.isPending ? <ActivityIndicator color={colors.primary} /> : <Chips options={activeLocs} value={chosen[i.id] ?? null} onChange={(v) => setChosen((s) => ({ ...s, [i.id]: v }))} />}
                </View>
              ) : null}
            </Card>
          ))}
          {canReceive && locs.data && activeLocs.length === 0 ? <Banner tone="warning" message="The receiving warehouse has no active rack locations. Ask the store manager to add one." /> : null}
          {receive.error && !(receive.error instanceof ApiError && /already been received/i.test(receive.error.message)) ? (
            <Banner tone="danger" message={receive.error instanceof ApiError ? receive.error.message : strings.errors.generic} />
          ) : null}
          {receive.isSuccess ? <Banner tone="success" message="Transfer received. Stock is now in the receiving warehouse." /> : null}
          {canReceive ? (
            <Button title="Receive transfer" onPress={() => receive.mutate()} loading={receive.isPending} disabled={!receiveReady(m.items.map((i) => i.id), chosen)} testID="movement-receive" />
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  gapTop: { marginTop: spacing.sm },
});
