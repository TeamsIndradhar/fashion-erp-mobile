import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import type { LeaveDuration } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chips } from "@/components/Chips";
import { PickerField } from "@/components/PickerField";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { dateRange, LEAVE_DURATIONS } from "@/features/requests/requests";
import { formatDateKey } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

/** EMP-028 Leave request + my leave. */
export default function Leave() {
  const auth = useAuth();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn";
  const employeeId = auth.me?.employee?.id ?? null;
  const types = useQuery({ queryKey: ["leave", "types"], queryFn: endpoints.leaveTypes, enabled });
  const mine = useQuery({ queryKey: ["leave", "mine"], queryFn: endpoints.myLeaveRequests, enabled });
  const [typeId, setTypeId] = useState<string | null>(null);
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [durations, setDurations] = useState<Record<string, LeaveDuration>>({});
  const [reason, setReason] = useState("");
  const year = Number((from ?? new Date().toISOString()).slice(0, 4));
  const balance = useQuery({
    queryKey: ["leave", "balance", typeId, year],
    queryFn: () => endpoints.leaveBalance(employeeId!, typeId!, year),
    enabled: enabled && !!typeId && !!employeeId,
  });
  const days = useMemo(() => (from && to ? dateRange(from, to) : []), [from, to]);
  const apply = useMutation({
    mutationFn: () => endpoints.applyLeave({ leaveTypeId: typeId!, days: days.map((d) => ({ date: d, duration: durations[d] ?? "FULL" })), reason: reason.trim() }),
    onSuccess: () => {
      setFrom(null);
      setTo(null);
      setDurations({});
      setReason("");
      void qc.invalidateQueries({ queryKey: ["leave"] });
    },
  });

  if (!enabled) return <Redirect href="/" />;
  const active = (types.data ?? []).filter((t) => t.isActive);
  const canSubmit = !!typeId && days.length > 0;

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Leave
      </AppText>
      <Card>
        <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
          Leave type
        </AppText>
        {types.isPending ? <ActivityIndicator color={colors.primary} /> : null}
        {types.error ? <Banner tone="danger" message={(types.error as Error).message} /> : null}
        <Chips options={active.map((t) => ({ value: t.id, label: t.name }))} value={typeId} onChange={setTypeId} testID="leave-type" />
        {balance.data ? (
          <AppText variant="caption" color={colors.textSecondary} style={styles.balance}>
            Balance {year}: {balance.data.remainingDays} of {balance.data.annualDays} days left ({balance.data.usedDays} used)
          </AppText>
        ) : null}
        <PickerField label="From" mode="date" value={from} onChange={(v) => { setFrom(v); if (!to || to < v) setTo(v); }} testID="leave-from" />
        <PickerField label="To" mode="date" value={to} onChange={setTo} minimumDate={from ? new Date(`${from}T00:00:00`) : undefined} testID="leave-to" />
        {days.map((d) => (
          <View key={d} style={styles.day}>
            <AppText variant="bodyStrong">{formatDateKey(d)}</AppText>
            <Chips options={LEAVE_DURATIONS} value={durations[d] ?? "FULL"} onChange={(v) => setDurations((s) => ({ ...s, [d]: v }))} />
          </View>
        ))}
        <TextField label="Reason (optional)" value={reason} onChangeText={setReason} multiline maxLength={1000} testID="leave-reason" />
        {apply.error ? <Banner tone="danger" message={apply.error instanceof ApiError ? apply.error.message : strings.errors.generic} /> : null}
        {apply.isSuccess ? <Banner tone="success" message="Leave request sent for approval." /> : null}
        <View style={styles.gap} />
        <Button title="Apply for leave" onPress={() => apply.mutate()} loading={apply.isPending} disabled={!canSubmit} testID="leave-submit" />
        <AppText variant="caption" color={colors.textSecondary} style={styles.note}>
          Weekly offs and holidays are worked out by the ERP. Balance and locked salary months are checked when you send.
        </AppText>
      </Card>

      <AppText variant="h3" style={styles.section}>
        Leave requests
      </AppText>
      {mine.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {mine.data?.length === 0 ? <AppText color={colors.textSecondary}>No leave requests yet.</AppText> : null}
      {mine.data?.map((r) => (
        <Card key={r.id}>
          <View style={styles.row}>
            <AppText variant="bodyStrong" style={styles.flex}>
              {r.leaveType.name}
            </AppText>
            <StatusPill status={r.status} />
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            {formatDateKey(r.startDate.slice(0, 10))}
            {r.endDate.slice(0, 10) !== r.startDate.slice(0, 10) ? ` – ${formatDateKey(r.endDate.slice(0, 10))}` : ""} · {r.days.length} day(s)
          </AppText>
          {r.rejectionReason ? (
            <AppText variant="caption" color={colors.danger}>
              {r.rejectionReason}
            </AppText>
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
  balance: { marginBottom: spacing.md },
  day: { marginBottom: spacing.sm },
  gap: { height: spacing.md },
  note: { marginTop: spacing.md },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
});
