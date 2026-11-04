import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import type { PaymentRequestStatus } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chips } from "@/components/Chips";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { endpoints } from "@/core/services";
import { EXPENSE_FILTERS, formatMoney } from "@/features/requests/requests";
import { formatDateTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

/** EMP-017 My expense requests with status filter. */
export default function Expenses() {
  const auth = useAuth();
  const [filter, setFilter] = useState<PaymentRequestStatus | "ALL">("ALL");
  const enabled = auth.status === "signedIn";
  const list = useQuery({
    queryKey: ["expenses", "mine", filter],
    queryFn: () => endpoints.myExpenseRequests(filter === "ALL" ? undefined : filter),
    enabled,
  });
  if (!enabled) return <Redirect href="/" />;
  const canCreate = auth.me?.viewableModules.includes("payment_requests");

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Expense requests
      </AppText>
      {canCreate ? <Button title="New expense request" onPress={() => router.push("/requests/expenses/new")} testID="expenses-new" /> : null}
      <View style={styles.gap} />
      <Chips options={EXPENSE_FILTERS} value={filter} onChange={setFilter} />
      {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data?.length === 0 ? <AppText color={colors.textSecondary}>No requests.</AppText> : null}
      {list.data?.map((r) => (
        <Pressable key={r.id} accessibilityRole="button" onPress={() => router.push({ pathname: "/requests/expenses/[id]", params: { id: r.id } })}>
          <Card>
            <View style={styles.row}>
              <AppText variant="bodyStrong" style={styles.flex}>
                {formatMoney(r.amount)} · {r.payToName ?? ""}
              </AppText>
              <StatusPill status={r.status} />
            </View>
            <AppText variant="caption" color={colors.textSecondary}>
              {r.requestNumber} · {r.typeDataJson?.purposeName ?? r.typeDataJson?.expenseAccountName ?? r.requestType} · {formatDateTime(r.createdAt)}
            </AppText>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  gap: { height: spacing.md },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
});
