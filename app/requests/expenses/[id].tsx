import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { canCancelExpense, formatMoney } from "@/features/requests/requests";
import { formatDateKey, formatDateTime } from "@/lib/dates";
import { openAuthedFile } from "@/lib/download";
import { colors, spacing } from "@/theme/tokens";

/** EMP-018 Expense request details: status timeline, bill photos, cancel while not paid. */
export default function ExpenseDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const auth = useAuth();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn" && !!id;
  const req = useQuery({ queryKey: ["expenses", "one", id], queryFn: () => endpoints.expenseRequest(id!), enabled });
  const files = useQuery({ queryKey: ["expenses", "files", id], queryFn: () => endpoints.expenseFiles(id!), enabled });
  const cancel = useMutation({
    mutationFn: () => endpoints.cancelExpense(id!),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["expenses"] }),
    onError: (err) => Alert.alert("Expense request", err instanceof ApiError ? err.message : strings.errors.generic),
  });

  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const r = req.data;
  const steps = r
    ? ([
        ["Sent", r.createdAt],
        r.approvedAt ? ["Approved", r.approvedAt] : null,
        r.rejectedAt ? ["Rejected", r.rejectedAt] : null,
        r.cancelledAt ? ["Cancelled", r.cancelledAt] : null,
      ].filter(Boolean) as [string, string][])
    : [];

  return (
    <Screen>
      {req.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {req.error ? <Banner tone="danger" message={(req.error as Error).message} /> : null}
      {r ? (
        <>
          <View style={styles.head}>
            <AppText variant="h2" style={styles.flex}>
              {formatMoney(r.amount)}
            </AppText>
            <StatusPill status={r.status} />
          </View>
          <Card>
            <ListRow label="Request no." value={r.requestNumber} />
            <ListRow label="Pay to" value={r.payToName} />
            <ListRow label="For" value={r.typeDataJson?.purposeName ?? r.typeDataJson?.expenseAccountName ?? null} />
            <ListRow label="Pay by" value={r.paymentDueDate ? formatDateKey(r.paymentDueDate.slice(0, 10)) : null} />
            {Number(r.paidAmount) > 0 ? <ListRow label="Paid so far" value={formatMoney(r.paidAmount)} /> : null}
            {r.remark ? <AppText style={styles.remark}>{r.remark}</AppText> : null}
          </Card>
          {r.rejectionReason ? <Banner tone="danger" message={`Rejected: ${r.rejectionReason}`} /> : null}
          <Card>
            <AppText variant="bodyStrong" style={styles.label}>
              Progress
            </AppText>
            {steps.map(([label, at]) => (
              <AppText key={label} variant="caption" color={colors.textSecondary}>
                {label} · {formatDateTime(at)}
              </AppText>
            ))}
          </Card>
          <Card>
            <AppText variant="bodyStrong" style={styles.label}>
              Bills & files
            </AppText>
            {files.data?.length === 0 ? <AppText color={colors.textSecondary}>No files.</AppText> : null}
            {files.data?.map((f) => (
              <ListRow
                key={f.id}
                label={f.fileName}
                onPress={() =>
                  void openAuthedFile(`/api/v1/record-attachments/file/${encodeURIComponent(f.id)}?disposition=inline`, f.fileName, f.mimeType).catch((err) =>
                    Alert.alert(f.fileName, err instanceof ApiError ? err.message : strings.errors.generic)
                  )
                }
              />
            ))}
          </Card>
          {canCancelExpense(r.status) ? (
            <Button
              kind="ghost"
              title="Cancel request"
              loading={cancel.isPending}
              onPress={() =>
                Alert.alert("Cancel this request?", "", [
                  { text: strings.common.cancel, style: "cancel" },
                  { text: "Cancel request", style: "destructive", onPress: () => cancel.mutate() },
                ])
              }
              testID="expense-cancel"
            />
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", marginTop: spacing.lg, marginBottom: spacing.lg },
  flex: { flex: 1 },
  remark: { marginTop: spacing.md },
  label: { marginBottom: spacing.sm },
});
