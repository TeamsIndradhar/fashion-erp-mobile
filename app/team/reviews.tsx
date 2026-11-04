import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useState, type ReactNode } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chips } from "@/components/Chips";
import { OfflineBanner } from "@/components/OfflineBanner";
import { PickerField } from "@/components/PickerField";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { CORRECTION_LABEL, formatMoney } from "@/features/requests/requests";
import { formatDateKey, formatHours, formatTime, istHhmm, istTimeOnDayOf } from "@/lib/dates";
import { colors, layout, spacing } from "@/theme/tokens";

type Tab = "leave" | "correction" | "outside" | "clarify" | "overtime";

/** Team approvals (D-D06): leave, corrections, outside punches (+ clarifications) and overtime. */
export default function TeamReviews() {
  const auth = useAuth();
  const ap = auth.me?.permissions.approvals;
  const tabs = (
    [
      ["leave", "Leave", ap?.leave],
      ["correction", "Corrections", ap?.correction],
      ["outside", "Outside punches", ap?.outdoor],
      ["clarify", "Explanations", ap?.outdoor],
      ["overtime", "Overtime", ap?.overtime],
    ] as const
  )
    .filter(([, , ok]) => ok)
    .map(([value, label]) => ({ value: value as Tab, label }));
  const [tab, setTab] = useState<Tab | null>(null);
  const active = tab ?? tabs[0]?.value ?? null;
  if (auth.status !== "signedIn") return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="h2" style={styles.title}>
          Team approvals
        </AppText>
        {tabs.length === 0 ? <Banner tone="info" message="You don't approve any team requests." /> : <Chips options={tabs} value={active} onChange={setTab} testID="reviews-tab" />}
        {active === "leave" ? <LeaveList myEmployeeId={auth.me?.employee?.id ?? null} /> : null}
        {active === "correction" ? <CorrectionList myEmployeeId={auth.me?.employee?.id ?? null} /> : null}
        {active === "outside" ? <OutsideList myEmployeeId={auth.me?.employee?.id ?? null} /> : null}
        {active === "clarify" ? <ClarificationList myEmployeeId={auth.me?.employee?.id ?? null} /> : null}
        {active === "overtime" ? <OvertimeList myEmployeeId={auth.me?.employee?.id ?? null} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

/** One request card with Approve and Reject (reason required for reject). Own requests can't be decided. */
function Decide({
  title,
  lines,
  own,
  onApprove,
  onReject,
  queryKey,
  rejectNeedsReason = true,
  extra,
}: {
  title: string;
  lines: (string | null | undefined)[];
  own: boolean;
  onApprove: () => Promise<unknown>;
  onReject: ((reason: string) => Promise<unknown>) | null;
  queryKey: string[];
  rejectNeedsReason?: boolean;
  extra?: (close: () => void) => ReactNode;
}) {
  const qc = useQueryClient();
  const [mode, setMode] = useState<"view" | "reject" | "extra">("view");
  const [reason, setReason] = useState("");
  const done = () => void qc.invalidateQueries({ queryKey });
  const approve = useMutation({ mutationFn: onApprove, onSuccess: done });
  const reject = useMutation({ mutationFn: () => onReject!(reason.trim()), onSuccess: done });
  const err = approve.error ?? reject.error;
  return (
    <Card>
      <AppText variant="bodyStrong">{title}</AppText>
      {lines.filter(Boolean).map((l) => (
        <AppText key={l} variant="caption" color={colors.textSecondary}>
          {l}
        </AppText>
      ))}
      {err ? <Banner tone="danger" message={err instanceof ApiError ? err.message : strings.errors.generic} /> : null}
      {own ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.gapTop}>
          This is your own request — someone else must decide it.
        </AppText>
      ) : mode === "view" ? (
        <View style={styles.pair}>
          <View style={styles.cell}>
            <Button title="Approve" onPress={() => approve.mutate()} loading={approve.isPending} disabled={reject.isPending} />
          </View>
          {onReject || extra ? (
            <View style={styles.cell}>
              <Button kind="danger" title="Reject" onPress={() => setMode(extra ? "extra" : "reject")} disabled={approve.isPending} />
            </View>
          ) : null}
        </View>
      ) : mode === "reject" ? (
        <View style={styles.gapTop}>
          <TextField label="Reason (the employee will see it)" value={reason} onChangeText={setReason} maxLength={1000} />
          <Button kind="danger" title="Reject" onPress={() => reject.mutate()} loading={reject.isPending} disabled={rejectNeedsReason && !reason.trim()} />
          <View style={styles.gap} />
          <Button kind="ghost" title={strings.common.cancel} onPress={() => setMode("view")} />
        </View>
      ) : (
        <View style={styles.gapTop}>{extra?.(() => { setMode("view"); done(); })}</View>
      )}
    </Card>
  );
}

function ListState({ q, empty }: { q: { isPending: boolean; error: unknown; data?: unknown[] }; empty: string }) {
  if (q.isPending) return <ActivityIndicator color={colors.primary} />;
  if (q.error) return <Banner tone="danger" message={(q.error as Error).message} />;
  if (q.data?.length === 0) return <AppText color={colors.textSecondary}>{empty}</AppText>;
  return null;
}

function LeaveList({ myEmployeeId }: { myEmployeeId: string | null }) {
  const q = useQuery({ queryKey: ["team", "review", "leave"], queryFn: endpoints.teamLeave });
  return (
    <>
      <ListState q={q} empty="No leave waiting for you." />
      {q.data?.map((r) => (
        <Decide
          key={r.id}
          title={`${r.employee.fullName} · ${r.leaveType.name}`}
          lines={[`${formatDateKey(r.startDate.slice(0, 10))}${r.endDate.slice(0, 10) !== r.startDate.slice(0, 10) ? ` – ${formatDateKey(r.endDate.slice(0, 10))}` : ""} · ${r.days.length} day(s)`, r.reason]}
          own={r.employee.id === myEmployeeId}
          onApprove={() => endpoints.approveLeave(r.id)}
          onReject={(reason) => endpoints.rejectLeave(r.id, reason)}
          queryKey={["team", "review", "leave"]}
        />
      ))}
    </>
  );
}

function CorrectionList({ myEmployeeId }: { myEmployeeId: string | null }) {
  const q = useQuery({ queryKey: ["team", "review", "correction"], queryFn: endpoints.teamCorrections });
  return (
    <>
      <ListState q={q} empty="No corrections waiting for you." />
      {q.data?.map((c) => (
        <Decide
          key={c.id}
          title={`${c.employee.fullName} · ${CORRECTION_LABEL[c.type]}`}
          lines={[
            `${formatDateKey(c.attendanceDate.slice(0, 10))}${c.requestedPunchIn ? ` · in ${formatTime(c.requestedPunchIn)}` : ""}${c.requestedPunchOut ? ` · out ${formatTime(c.requestedPunchOut)}` : ""}`,
            c.reason,
          ]}
          own={c.employee.id === myEmployeeId}
          onApprove={() => endpoints.approveCorrection(c.id)}
          onReject={(reason) => endpoints.rejectCorrection(c.id, reason)}
          queryKey={["team", "review", "correction"]}
        />
      ))}
    </>
  );
}

function OutsideList({ myEmployeeId }: { myEmployeeId: string | null }) {
  const q = useQuery({ queryKey: ["team", "review", "outside"], queryFn: endpoints.teamOutside });
  return (
    <>
      <ListState q={q} empty="No outside punches waiting for you." />
      {q.data?.map((s) => (
        <Decide
          key={s.id}
          title={`${s.employee.fullName} · ${formatDateKey((s.attendanceRecord?.attendanceDate ?? s.checkInAt).slice(0, 10))}`}
          lines={[
            `In ${formatTime(s.checkInAt)}${s.inDistanceMeters !== null ? ` (${Math.round(s.inDistanceMeters)} m from ${s.inLocation?.name ?? "office"})` : ""}`,
            s.checkOutAt ? `Out ${formatTime(s.checkOutAt)}${s.outDistanceMeters !== null ? ` (${Math.round(s.outDistanceMeters)} m)` : ""}` : "Still punched in",
          ]}
          own={s.employee.id === myEmployeeId}
          onApprove={() => endpoints.approveOutside([s.id])}
          onReject={null}
          queryKey={["team", "review", "outside"]}
          extra={s.checkOutAt ? (close) => <TrimForm sessionId={s.id} checkInAt={s.checkInAt} checkOutAt={s.checkOutAt!} onDone={close} /> : undefined}
        />
      ))}
    </>
  );
}

/** Reject an outside punch = count only the allowed times (originals are kept). */
function TrimForm({ sessionId, checkInAt, checkOutAt, onDone }: { sessionId: string; checkInAt: string; checkOutAt: string; onDone: () => void }) {
  const [inT, setIn] = useState(istHhmm(checkInAt));
  const [outT, setOut] = useState(istHhmm(checkOutAt));
  const [reason, setReason] = useState("");
  const send = useMutation({
    mutationFn: () => endpoints.rejectOutside(sessionId, { reason: reason.trim(), trimmedCheckInAt: istTimeOnDayOf(checkInAt, inT), trimmedCheckOutAt: istTimeOnDayOf(checkOutAt, outT) }),
    onSuccess: onDone,
  });
  return (
    <>
      <AppText variant="caption" color={colors.textSecondary} style={styles.gap}>
        Set the time to count. The employee can accept it or explain.
      </AppText>
      <PickerField label="Count from" mode="time" value={inT} onChange={setIn} />
      <PickerField label="Count until" mode="time" value={outT} onChange={setOut} />
      <TextField label="Reason (the employee will see it)" value={reason} onChangeText={setReason} maxLength={1000} />
      {send.error ? <Banner tone="danger" message={send.error instanceof ApiError ? send.error.message : strings.errors.generic} /> : null}
      <Button kind="danger" title="Reject and trim" onPress={() => send.mutate()} loading={send.isPending} disabled={!reason.trim()} />
    </>
  );
}

function ClarificationList({ myEmployeeId }: { myEmployeeId: string | null }) {
  const q = useQuery({ queryKey: ["team", "review", "clarify"], queryFn: endpoints.teamClarifications });
  return (
    <>
      <ListState q={q} empty="No explanations waiting for you." />
      {q.data?.map((r) => (
        <Decide
          key={r.id}
          title={`${r.employee.fullName} · explained a trimmed punch`}
          lines={[
            `Punch ${formatTime(r.originalCheckIn)} – ${r.originalCheckOut ? formatTime(r.originalCheckOut) : "…"} · counted ${formatTime(r.trimmedCheckIn)} – ${r.trimmedCheckOut ? formatTime(r.trimmedCheckOut) : "…"}`,
            r.clarificationReason ? `“${r.clarificationReason}”` : null,
            r.hasProof ? "Proof attached (open it on the website)" : null,
          ]}
          own={r.employee.id === myEmployeeId}
          onApprove={() => endpoints.decideClarification(r.id, "approve")}
          onReject={() => endpoints.decideClarification(r.id, "reject")}
          rejectNeedsReason={false}
          queryKey={["team", "review", "clarify"]}
        />
      ))}
    </>
  );
}

function OvertimeList({ myEmployeeId }: { myEmployeeId: string | null }) {
  const q = useQuery({ queryKey: ["team", "review", "overtime"], queryFn: endpoints.teamOvertime });
  return (
    <>
      <ListState q={q} empty="No overtime waiting for you." />
      {q.data?.map((o) => (
        <Decide
          key={o.id}
          title={`${o.employee.fullName} · ${formatHours(o.hours)} overtime`}
          lines={[`${formatDateKey(o.attendanceDate.slice(0, 10))} · worked ${formatHours(o.workedHours)} of ${formatHours(o.shiftHours)} shift`, o.amount !== null ? formatMoney(o.amount) : null, o.reason]}
          own={o.employee.id === myEmployeeId}
          onApprove={() => endpoints.approveOvertime(o.id)}
          onReject={(reason) => endpoints.rejectOvertime(o.id, reason)}
          queryKey={["team", "review", "overtime"]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: layout.gutter },
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  pair: { flexDirection: "row", marginHorizontal: -spacing.xs, marginTop: spacing.md },
  cell: { flex: 1, paddingHorizontal: spacing.xs },
  gap: { height: spacing.sm, marginBottom: spacing.sm },
  gapTop: { marginTop: spacing.md },
});
