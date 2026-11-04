import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "@/api/errors";
import type { ProgressEntry } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { OfflineBanner } from "@/components/OfflineBanner";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { pieces, validateProgress } from "@/features/work/work";
import { formatDateTime } from "@/lib/dates";
import { colors, layout, spacing } from "@/theme/tokens";

/** SUP-004 pending production approvals · SUP-005 approve / reject / correct an entry. */
export default function Approvals() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn" && !!auth.me?.permissions.production?.approve;
  const list = useQuery({ queryKey: ["team", "pending"], queryFn: endpoints.pendingEntries, enabled });
  if (auth.status !== "signedIn") return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={list.isRefetching} onRefresh={() => void list.refetch()} />}>
        <AppText variant="h2" style={styles.title}>
          Production approvals
        </AppText>
        {!enabled ? <Banner tone="info" message="You don't have permission to approve production entries." /> : null}
        {list.isPending && enabled ? <ActivityIndicator color={colors.primary} /> : null}
        {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
        {list.data?.length === 0 ? <AppText color={colors.textSecondary}>Nothing waiting for approval.</AppText> : null}
        {list.data?.map((e) => <EntryCard key={e.id} e={e} isMine={e.recordedByUserId === auth.me?.user.id} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

function EntryCard({ e, isMine }: { e: ProgressEntry; isMine: boolean }) {
  const qc = useQueryClient();
  const [mode, setMode] = useState<"view" | "reject" | "edit">("view");
  const [remark, setRemark] = useState("");
  const [q, setQ] = useState({ completed: String(pieces(e.completedQuantity)), rejected: String(pieces(e.rejectedQuantity)), damaged: String(pieces(e.damagedQuantity)), extra: String(pieces(e.extraQuantity)) });
  const [formError, setFormError] = useState<string | null>(null);
  const done = () => void qc.invalidateQueries({ queryKey: ["team", "pending"] });
  const approve = useMutation({ mutationFn: () => endpoints.approveEntry(e.id, remark.trim()), onSuccess: done });
  const reject = useMutation({ mutationFn: () => endpoints.rejectEntry(e.id, remark.trim()), onSuccess: done });
  const correct = useMutation({
    mutationFn: (v: NonNullable<ReturnType<typeof validateProgress>["quantities"]>) => endpoints.correctEntry(e.id, v),
    onSuccess: () => {
      setMode("view");
      done();
    },
  });
  const err = approve.error ?? reject.error ?? correct.error;
  const busy = approve.isPending || reject.isPending || correct.isPending;

  function saveCorrection() {
    // Capacity is re-checked by the server; here only the shape (whole numbers, ≥ 1 piece).
    const v = validateProgress(q, { remaining: Number.MAX_SAFE_INTEGER, allowsExtra: true });
    setFormError(Object.values(v.errors)[0] ?? null);
    if (v.quantities) correct.mutate(v.quantities);
  }

  return (
    <Card>
      <AppText variant="bodyStrong">
        {e.employee?.fullName ?? ""} ({e.employee?.employeeCode ?? ""})
      </AppText>
      <AppText variant="caption" color={colors.textSecondary}>
        {e.jobOrder?.productionStage.name} · {e.jobOrder?.jobNumber} · Lot {e.jobOrder?.lot?.lotNumber ?? ""} · {formatDateTime(e.createdAt)}
      </AppText>
      <AppText style={styles.qty}>
        Finished {pieces(e.completedQuantity)} · rejected {pieces(e.rejectedQuantity)} · damaged {pieces(e.damagedQuantity)}
        {pieces(e.extraQuantity) ? ` · extra ${pieces(e.extraQuantity)}` : ""}
      </AppText>
      {e.remarks ? <AppText variant="caption" color={colors.textSecondary}>Worker: {e.remarks}</AppText> : null}
      {err ? <Banner tone="danger" message={err instanceof ApiError ? err.message : strings.errors.generic} /> : null}

      {mode === "view" ? (
        <View style={styles.actions}>
          <TextField label="Remark (optional for approve)" value={remark} onChangeText={setRemark} maxLength={500} />
          {isMine ? <AppText variant="caption" color={colors.textSecondary}>You recorded this entry, so someone else must approve it.</AppText> : null}
          <View style={styles.pair}>
            <View style={styles.cell}>
              <Button title="Approve" onPress={() => approve.mutate()} loading={approve.isPending} disabled={busy || isMine} testID={`approve-${e.id}`} />
            </View>
            <View style={styles.cell}>
              <Button kind="danger" title="Reject" onPress={() => (remark.trim() ? reject.mutate() : setMode("reject"))} loading={reject.isPending} disabled={busy} />
            </View>
          </View>
          <View style={styles.gap} />
          <Button kind="ghost" title="Correct quantities" onPress={() => setMode("edit")} disabled={busy} />
        </View>
      ) : null}

      {mode === "reject" ? (
        <View style={styles.actions}>
          <TextField label="Why is it rejected? (required)" value={remark} onChangeText={setRemark} maxLength={500} />
          <Button kind="danger" title="Reject entry" onPress={() => reject.mutate()} loading={reject.isPending} disabled={!remark.trim()} />
          <View style={styles.gap} />
          <Button kind="ghost" title={strings.common.cancel} onPress={() => setMode("view")} />
        </View>
      ) : null}

      {mode === "edit" ? (
        <View style={styles.actions}>
          <TextField label="Finished" value={q.completed} onChangeText={(v) => setQ({ ...q, completed: v })} keyboardType="number-pad" />
          <TextField label="Rejected" value={q.rejected} onChangeText={(v) => setQ({ ...q, rejected: v })} keyboardType="number-pad" />
          <TextField label="Damaged" value={q.damaged} onChangeText={(v) => setQ({ ...q, damaged: v })} keyboardType="number-pad" />
          <TextField label="Extra" value={q.extra} onChangeText={(v) => setQ({ ...q, extra: v })} keyboardType="number-pad" />
          {formError ? <Banner tone="warning" message={formError} /> : null}
          <Button title="Save correction" onPress={saveCorrection} loading={correct.isPending} />
          <View style={styles.gap} />
          <Button kind="ghost" title={strings.common.cancel} onPress={() => setMode("view")} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: layout.gutter },
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  qty: { marginTop: spacing.sm },
  actions: { marginTop: spacing.md },
  pair: { flexDirection: "row", marginHorizontal: -spacing.xs, marginTop: spacing.sm },
  cell: { flex: 1, paddingHorizontal: spacing.xs },
  gap: { height: spacing.sm },
});
