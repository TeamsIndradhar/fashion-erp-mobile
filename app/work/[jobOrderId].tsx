import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { assignmentProgress, validateHandBack, validateProgress } from "@/features/work/work";
import { colors, spacing } from "@/theme/tokens";

type Mode = "view" | "submit" | "handback" | "sent";

/** WRK-003 job order details · WRK-004/005 submit progress · WRK-007 hand back. */
export default function JobOrderScreen() {
  const { jobOrderId } = useLocalSearchParams<{ jobOrderId: string }>();
  const auth = useAuth();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn" && !!jobOrderId;
  const jo = useQuery({ queryKey: ["work", "job", jobOrderId], queryFn: () => endpoints.jobOrder(jobOrderId!), enabled });
  const entries = useQuery({ queryKey: ["work", "entries"], queryFn: endpoints.myEntries, enabled });
  const [mode, setMode] = useState<Mode>("view");
  const [q, setQ] = useState({ completed: "", rejected: "", damaged: "", extra: "" });
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [hb, setHb] = useState({ quantity: "", reason: "" });

  const refresh = () => void qc.invalidateQueries({ queryKey: ["work"] });
  const submit = useMutation({
    mutationFn: (quantities: NonNullable<ReturnType<typeof validateProgress>["quantities"]>) => endpoints.submitProgress(jobOrderId!, { ...quantities, remarks: remarks.trim() }),
    onSuccess: () => {
      setQ({ completed: "", rejected: "", damaged: "", extra: "" });
      setRemarks("");
      setMode("sent");
      refresh();
    },
  });
  const handBack = useMutation({
    mutationFn: (v: { id: string; quantity: number; reason: string }) => endpoints.handBack(v.id, v.quantity, v.reason),
    onSuccess: () => {
      setHb({ quantity: "", reason: "" });
      setMode("view");
      refresh();
    },
  });

  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const j = jo.data;
  const assignment = j?.assignments.find((a) => a.status === "ASSIGNED" || a.status === "IN_PROGRESS") ?? j?.assignments[0] ?? null;
  const p = assignment ? assignmentProgress(assignment, entries.data ?? []) : null;
  const open = !!assignment && (assignment.status === "ASSIGNED" || assignment.status === "IN_PROGRESS") && j?.status !== "ON_HOLD" && j?.status !== "CANCELLED";
  const err = submit.error ?? handBack.error;

  function sendProgress() {
    const v = validateProgress(q, { remaining: p?.remaining ?? 0, allowsExtra: !!j?.productionStage.allowsExtraQuantity });
    setErrors(v.errors);
    if (v.quantities) submit.mutate(v.quantities);
  }

  function sendHandBack() {
    const returnable = p?.remaining ?? 0;
    const v = validateHandBack(hb.quantity, hb.reason, returnable);
    setErrors(v);
    if (!v.quantity && !v.reason && assignment) handBack.mutate({ id: assignment.id, quantity: Number(hb.quantity), reason: hb.reason.trim() });
  }

  return (
    <Screen>
      {jo.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {jo.error ? <Banner tone="danger" message={(jo.error as Error).message} /> : null}
      {j ? (
        <>
          <AppText variant="h2" style={styles.title}>
            {j.productionStage.name}
          </AppText>
          <Card>
            <ListRow label="Job order" value={j.jobNumber} />
            <ListRow label="Lot" onPress={() => router.push({ pathname: "/work/lot/[id]", params: { id: j.lotId } })} value={j.lot.lotNumber} />
            {p ? (
              <>
                <ListRow label="Assigned to you" value={`${p.assigned} pcs`} />
                <ListRow label="Approved" value={`${p.approved} pcs`} />
                <ListRow label="Waiting for approval" value={`${p.pending} pcs`} />
                <ListRow label="Left to do" value={`${p.remaining} pcs`} />
              </>
            ) : null}
          </Card>
          {err ? <Banner tone="danger" message={err instanceof ApiError ? err.message : strings.errors.generic} /> : null}

          {mode === "sent" ? (
            <Card>
              <Banner tone="success" message="Sent. Your supervisor will check and approve it — it counts once approved." testID="work-sent" />
              <View style={styles.gap} />
              <Button title="Done" onPress={() => setMode("view")} />
            </Card>
          ) : null}

          {mode === "view" && open ? (
            <>
              <Button title="Enter my work" onPress={() => setMode("submit")} disabled={!p || p.remaining === 0} testID="work-enter" />
              <View style={styles.gap} />
              <Button kind="secondary" title="Hand back pieces" onPress={() => setMode("handback")} disabled={!p || p.remaining === 0} />
            </>
          ) : null}

          {mode === "submit" ? (
            <Card>
              <AppText variant="h3" style={styles.formTitle}>
                Enter pieces
              </AppText>
              <TextField label="Finished (good) pieces" value={q.completed} onChangeText={(v) => setQ({ ...q, completed: v })} keyboardType="number-pad" error={errors.completed} testID="work-completed" />
              <TextField label="Rejected pieces" value={q.rejected} onChangeText={(v) => setQ({ ...q, rejected: v })} keyboardType="number-pad" error={errors.rejected} />
              <TextField label="Damaged pieces" value={q.damaged} onChangeText={(v) => setQ({ ...q, damaged: v })} keyboardType="number-pad" error={errors.damaged} />
              {j.productionStage.allowsExtraQuantity ? (
                <TextField label="Extra pieces (more than planned)" value={q.extra} onChangeText={(v) => setQ({ ...q, extra: v })} keyboardType="number-pad" error={errors.extra} />
              ) : null}
              <TextField label="Note (optional)" value={remarks} onChangeText={setRemarks} maxLength={500} />
              {errors.form ? <Banner tone="warning" message={errors.form} /> : null}
              <View style={styles.gap} />
              {/* No server-side retry key for self-entries: one tap = one entry, so the button locks while sending. */}
              <Button title="Send to supervisor" onPress={sendProgress} loading={submit.isPending} testID="work-send" />
              <View style={styles.gap} />
              <Button kind="ghost" title={strings.common.cancel} onPress={() => setMode("view")} />
              {submit.error instanceof ApiError && (submit.error.code === "NETWORK_ERROR" || submit.error.code === "TIMEOUT") ? (
                <AppText variant="caption" color={colors.textSecondary} style={styles.note}>
                  Before sending again, open “My entries” to check it did not already reach the server.
                </AppText>
              ) : null}
            </Card>
          ) : null}

          {mode === "handback" ? (
            <Card>
              <AppText variant="h3" style={styles.formTitle}>
                Hand back unworked pieces
              </AppText>
              <AppText variant="caption" color={colors.textSecondary} style={styles.note}>
                Pieces you already entered can’t be handed back. Up to {p?.remaining ?? 0} pcs.
              </AppText>
              <TextField label="Pieces to return" value={hb.quantity} onChangeText={(v) => setHb({ ...hb, quantity: v })} keyboardType="number-pad" error={errors.quantity} />
              <TextField label="Reason" value={hb.reason} onChangeText={(v) => setHb({ ...hb, reason: v })} maxLength={500} error={errors.reason} />
              <Button title="Hand back" onPress={sendHandBack} loading={handBack.isPending} />
              <View style={styles.gap} />
              <Button kind="ghost" title={strings.common.cancel} onPress={() => setMode("view")} />
            </Card>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  formTitle: { marginBottom: spacing.md },
  gap: { height: spacing.sm },
  note: { marginTop: spacing.sm, marginBottom: spacing.sm },
});
