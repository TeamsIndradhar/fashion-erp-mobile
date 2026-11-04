import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { Redirect } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chips } from "@/components/Chips";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { canCancelAdvance, formatMoney, installmentAmount, parseAmount, validateAdvance } from "@/features/requests/requests";
import { formatDateTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

const INSTALMENTS = [1, 2, 3, 4, 6, 9, 12].map((n) => ({ value: String(n), label: `${n}` }));

/** EMP-019 Salary advance: one open advance at a time, recovered from salary in instalments. */
export default function Advance() {
  const auth = useAuth();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn";
  const list = useQuery({ queryKey: ["advances"], queryFn: endpoints.salaryAdvances, enabled });
  const [amount, setAmount] = useState("");
  const [installments, setInstallments] = useState("3");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; installments?: string; reason?: string }>({});
  // One key per filled form: a retry after a lost response reuses the same request.
  const [requestKey, setRequestKey] = useState(() => Crypto.randomUUID());
  const ask = useMutation({
    mutationFn: () => endpoints.requestAdvance({ amount: parseAmount(amount)!, installments: Number(installments), reason: reason.trim(), requestKey }),
    onSuccess: () => {
      setAmount("");
      setReason("");
      setRequestKey(Crypto.randomUUID());
      void qc.invalidateQueries({ queryKey: ["advances"] });
    },
  });
  const cancel = useMutation({
    mutationFn: endpoints.cancelAdvance,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["advances"] }),
    onError: (err) => Alert.alert("Salary advance", err instanceof ApiError ? err.message : strings.errors.generic),
  });

  if (!enabled) return <Redirect href="/" />;
  const parsed = parseAmount(amount);

  function submit() {
    const v = validateAdvance({ amount, installments: Number(installments), reason });
    setErrors(v);
    if (!v.amount && !v.installments && !v.reason) ask.mutate();
  }

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Salary advance
      </AppText>
      <Card>
        <TextField label="Amount (₹)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" error={errors.amount} testID="advance-amount" />
        <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
          Recover from salary in (months)
        </AppText>
        <Chips options={INSTALMENTS} value={installments} onChange={setInstallments} />
        {parsed ? (
          <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
            About {formatMoney(installmentAmount(parsed, Number(installments)))} will be cut each month.
          </AppText>
        ) : null}
        <TextField label="Reason" value={reason} onChangeText={setReason} multiline maxLength={500} error={errors.reason} testID="advance-reason" />
        {ask.error ? <Banner tone="danger" message={ask.error instanceof ApiError ? ask.error.message : strings.errors.generic} /> : null}
        {ask.isSuccess ? <Banner tone="success" message="Advance request sent for approval." /> : null}
        <View style={styles.gap} />
        <Button title="Ask for advance" onPress={submit} loading={ask.isPending} testID="advance-submit" />
      </Card>

      <AppText variant="h3" style={styles.section}>
        My advances
      </AppText>
      {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data?.advances.length === 0 ? <AppText color={colors.textSecondary}>No advances yet.</AppText> : null}
      {list.data?.advances.map((a) => (
        <Card key={a.id}>
          <View style={styles.row}>
            <AppText variant="bodyStrong" style={styles.flex}>
              {formatMoney(a.amount)} · {a.installments} month(s)
            </AppText>
            <StatusPill status={a.status} />
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            {a.paymentRequest?.requestNumber ?? ""} · {formatDateTime(a.createdAt)}
          </AppText>
          {a.recovered > 0 ? (
            <AppText variant="caption" color={colors.textSecondary}>
              Recovered {formatMoney(a.recovered)}, left {formatMoney(a.remaining)}
            </AppText>
          ) : null}
          {a.paymentRequest?.rejectionReason ? (
            <AppText variant="caption" color={colors.danger}>
              {a.paymentRequest.rejectionReason}
            </AppText>
          ) : null}
          {canCancelAdvance(a) ? (
            <View style={styles.gapTop}>
              <Button
                kind="ghost"
                title="Cancel request"
                loading={cancel.isPending && cancel.variables === a.id}
                onPress={() =>
                  Alert.alert("Cancel this advance?", "", [
                    { text: strings.common.cancel, style: "cancel" },
                    { text: "Cancel request", style: "destructive", onPress: () => cancel.mutate(a.id) },
                  ])
                }
              />
            </View>
          ) : null}
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  section: { marginTop: spacing.lg, marginBottom: spacing.md },
  label: { marginBottom: spacing.sm },
  gap: { height: spacing.md },
  gapTop: { marginTop: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
});
