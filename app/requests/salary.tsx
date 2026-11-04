import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import type { SalaryLine, SalaryRun } from "@/api/types";
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
import { formatMoney, MONTHS } from "@/features/requests/requests";
import { openAuthedFile } from "@/lib/download";
import { colors, spacing } from "@/theme/tokens";

/** EMP-030 My salary slips: open the PDF, accept or discuss (same as the web). */
export default function SalarySlips() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn";
  const history = useQuery({ queryKey: ["salary", "history"], queryFn: () => endpoints.salaryHistory(), enabled });
  if (!enabled) return <Redirect href="/" />;
  const mine = (history.data?.runs ?? []).flatMap((run) => run.lines.filter((l) => l.isMine).map((line) => ({ run, line })));

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Salary slips
      </AppText>
      {history.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {history.error ? <Banner tone="danger" message={(history.error as Error).message} /> : null}
      {history.data && mine.length === 0 ? <AppText color={colors.textSecondary}>No approved salary yet.</AppText> : null}
      {mine.map(({ run, line }) => (
        <SlipCard key={line.id} run={run} line={line} />
      ))}
    </Screen>
  );
}

function SlipCard({ run, line }: { run: SalaryRun; line: SalaryLine }) {
  const qc = useQueryClient();
  const [discussing, setDiscussing] = useState(false);
  const [remark, setRemark] = useState(line.employeeRemark ?? "");
  const [opening, setOpening] = useState(false);
  const respond = useMutation({
    mutationFn: (v: { response: "APPROVED" | "DISCUSS"; remark: string | null }) => endpoints.respondToSalary(line.id, v.response, v.remark),
    onSuccess: () => {
      setDiscussing(false);
      void qc.invalidateQueries({ queryKey: ["salary"] });
    },
  });

  async function openPdf() {
    setOpening(true);
    try {
      await openAuthedFile(endpoints.salarySlipPath(line.id), `Payslip-${line.employeeCode}-${run.year}-${String(run.month).padStart(2, "0")}.pdf`, "application/pdf");
    } catch (err) {
      Alert.alert("Salary slip", err instanceof ApiError ? err.message : strings.errors.generic);
    } finally {
      setOpening(false);
    }
  }

  return (
    <Card>
      <AppText variant="h3">
        {MONTHS[run.month - 1]} {run.year}
      </AppText>
      <ListRow label="Net pay" value={formatMoney(line.net)} />
      <ListRow label="Gross" value={formatMoney(line.gross)} />
      <ListRow label="Deductions" value={formatMoney(line.deductions)} />
      <ListRow label="Paid days" value={`${line.paidDays} of ${line.calendarDays}`} />
      {line.employeeResponse ? (
        <AppText variant="caption" color={line.employeeResponse === "APPROVED" ? colors.success : colors.warning} style={styles.resp}>
          {line.employeeResponse === "APPROVED" ? "You accepted this salary." : `You asked to discuss: ${line.employeeRemark ?? ""}`}
        </AppText>
      ) : null}
      {respond.error ? <Banner tone="danger" message={respond.error instanceof ApiError ? respond.error.message : strings.errors.generic} /> : null}
      <View style={styles.actions}>
        {run.status === "FINALISED" ? <Button kind="secondary" title="Open slip (PDF)" loading={opening} onPress={() => void openPdf()} /> : null}
        {run.status !== "FINALISED" ? (
          <AppText variant="caption" color={colors.textSecondary}>
            The PDF slip is available once the salary is finalised.
          </AppText>
        ) : null}
        <View style={styles.gap} />
        {!discussing ? (
          <View style={styles.pair}>
            <View style={styles.cell}>
              <Button title="Accept" loading={respond.isPending && respond.variables?.response === "APPROVED"} onPress={() => respond.mutate({ response: "APPROVED", remark: null })} />
            </View>
            <View style={styles.cell}>
              <Button kind="secondary" title="Discuss" onPress={() => setDiscussing(true)} />
            </View>
          </View>
        ) : (
          <>
            <TextField label="What would you like to discuss?" value={remark} onChangeText={setRemark} multiline maxLength={1000} />
            <Button
              title="Send"
              disabled={remark.trim().length === 0}
              loading={respond.isPending}
              onPress={() => respond.mutate({ response: "DISCUSS", remark: remark.trim() })}
            />
            <View style={styles.gap} />
            <Button kind="ghost" title={strings.common.cancel} onPress={() => setDiscussing(false)} />
          </>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  resp: { marginTop: spacing.sm },
  actions: { marginTop: spacing.md },
  gap: { height: spacing.sm },
  pair: { flexDirection: "row", marginHorizontal: -spacing.xs },
  cell: { flex: 1, paddingHorizontal: spacing.xs },
});
