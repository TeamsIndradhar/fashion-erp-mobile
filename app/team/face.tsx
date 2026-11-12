import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApiError } from "@/api/errors";
import type { FaceRejectInput, FaceVerificationRow } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { AuthImage } from "@/components/AuthImage";
import { Banner } from "@/components/Banner";
import { BottomSheet } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chips } from "@/components/Chips";
import { InnerHeader } from "@/components/InnerHeader";
import { ListFilters, Pager, useListFilters } from "@/components/ListFilters";
import { PickerField } from "@/components/PickerField";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { rangeQuery } from "@/features/attendance/summaries";
import { formatDateKey, formatTime } from "@/lib/dates";
import { colors, radius, spacing } from "@/theme/tokens";

const STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ALL", label: "All" },
];

const FACE_LABEL: Record<string, string> = { NOT_MATCHED: "Face did not match", NO_FACE: "No face in photo", UNAVAILABLE: "Face check was down" };

type Decision = { row: FaceVerificationRow; kind: "approve" | "reject" } | null;

/** D-047 Face Verification for approvers: punches whose face did not match. Approve (remark optional) or reject (remark + times or hours). */
export default function FaceVerification() {
  const auth = useAuth();
  const f = useListFilters({ status: "PENDING" });
  const enabled = auth.status === "signedIn" && !!auth.me?.permissions.approvals?.faceVerification;
  const q = rangeQuery(f.range, { status: f.status === "ALL" ? undefined : f.status, page: f.page, pageSize: f.pageSize });
  const list = useQuery({ queryKey: ["face-verifications", q], queryFn: () => endpoints.faceVerificationsPage(q), enabled });
  const [decision, setDecision] = useState<Decision>(null);

  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;

  return (
    <Screen refreshing={list.isRefetching} onRefresh={() => void list.refetch()}>
      <InnerHeader title="Face Verification" />
      {!enabled ? <Banner tone="info" message="You are not an approver for face verification." /> : null}
      {enabled ? <ListFilters f={f} statuses={STATUSES} testID="face" /> : null}
      {list.isPending && enabled ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data && rows.length === 0 ? <AppText color={colors.textSecondary}>No face verifications in these dates.</AppText> : null}
      {rows.map((r) => (
        <Card key={r.id}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{r.employee.fullName}</AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {r.employee.employeeCode} · {formatDateKey(r.dateKey)}
              </AppText>
            </View>
            <StatusPill status={r.status} />
          </View>
          <View style={styles.photos}>
            {r.session.hasInSelfie ? <AuthImage path={`/api/v1/attendance/sessions/${r.session.id}/selfie/in`} style={styles.photo} /> : null}
            {r.session.hasOutSelfie ? <AuthImage path={`/api/v1/attendance/sessions/${r.session.id}/selfie/out`} style={styles.photo} /> : null}
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            Punch {formatTime(r.originalCheckIn ?? r.session.checkInAt)} – {r.originalCheckOut || r.session.checkOutAt ? formatTime((r.originalCheckOut ?? r.session.checkOutAt)!) : "…"}
          </AppText>
          {r.inFaceStatus ? <AppText variant="caption">In: {FACE_LABEL[r.inFaceStatus] ?? r.inFaceStatus}</AppText> : null}
          {r.outFaceStatus ? <AppText variant="caption">Out: {FACE_LABEL[r.outFaceStatus] ?? r.outFaceStatus}</AppText> : null}
          {r.status === "REJECTED" ? (
            <AppText variant="caption" color={colors.textSecondary}>
              Set to {formatTime(r.session.checkInAt)} – {r.session.checkOutAt ? formatTime(r.session.checkOutAt) : "…"}
              {r.manualMode === "HOURS" ? ` (${r.manualHours} h from shift start)` : ""}
            </AppText>
          ) : null}
          {r.remark ? <AppText variant="caption">Remark: {r.remark}</AppText> : null}
          {r.status === "PENDING" ? (
            <View style={styles.actions}>
              <View style={styles.flex}>
                <Button title="Approve" onPress={() => setDecision({ row: r, kind: "approve" })} testID={`face-approve-${r.id}`} />
              </View>
              <View style={styles.gapX} />
              <View style={styles.flex}>
                <Button kind="danger" title="Reject" onPress={() => setDecision({ row: r, kind: "reject" })} testID={`face-reject-${r.id}`} />
              </View>
            </View>
          ) : null}
        </Card>
      ))}
      {meta ? <Pager page={meta.page} totalPages={meta.totalPages} total={meta.totalCount} onPage={f.setPage} testID="face-pager" /> : null}
      <Modal visible={!!decision} transparent animationType="slide" onRequestClose={() => setDecision(null)}>
        <SafeAreaProvider>{decision ? <DecisionSheet decision={decision} onClose={() => setDecision(null)} /> : null}</SafeAreaProvider>
      </Modal>
    </Screen>
  );
}

function DecisionSheet({ decision, onClose }: { decision: NonNullable<Decision>; onClose: () => void }) {
  const qc = useQueryClient();
  const { row, kind } = decision;
  const start = row.employee.shift?.startTime ?? "09:00";
  const [remark, setRemark] = useState("");
  const [mode, setMode] = useState<"TIMES" | "HOURS">("TIMES");
  const [checkIn, setCheckIn] = useState<string | null>(start);
  const [checkOut, setCheckOut] = useState<string | null>(row.employee.shift?.endTime ?? "18:00");
  const [hours, setHours] = useState("8");
  const [error, setError] = useState<string | null>(null);

  const send = useMutation({
    mutationFn: async () => {
      if (kind === "approve") return endpoints.approveFace(row.id, remark.trim() || null);
      const input: FaceRejectInput = mode === "TIMES" ? { remark: remark.trim(), mode, checkIn: checkIn!, checkOut: checkOut! } : { remark: remark.trim(), mode, hours: Number(hours) };
      return endpoints.rejectFace(row.id, input);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["face-verifications"] });
      onClose();
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : strings.errors.generic),
  });

  function submit() {
    setError(null);
    if (kind === "reject") {
      if (!remark.trim()) return setError("A remark is required to reject.");
      if (mode === "TIMES" && (!checkIn || !checkOut)) return setError("Choose both punch-in and punch-out times.");
      const h = Number(hours);
      if (mode === "HOURS" && !(h > 0 && h <= 24)) return setError("Enter the hours worked (more than 0, at most 24).");
    }
    send.mutate();
  }

  return (
    <BottomSheet onClose={send.isPending ? undefined : onClose} testID="face-sheet">
      <AppText variant="h3" style={styles.sheetTitle}>
        {kind === "approve" ? "Approve" : "Reject"} · {row.employee.fullName}, {formatDateKey(row.dateKey)}
      </AppText>
      {kind === "approve" ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.note}>
          The punch stays as recorded.
        </AppText>
      ) : null}
      <TextField label={kind === "approve" ? "Remark (optional)" : "Remark (required)"} value={remark} onChangeText={setRemark} multiline maxLength={500} testID="face-remark" />
      {kind === "reject" ? (
        <>
          <AppText variant="bodyStrong" style={styles.note}>
            Attendance for this punch
          </AppText>
          <Chips
            options={[
              { value: "TIMES", label: "Punch-in / out" },
              { value: "HOURS", label: `Hours from ${start}` },
            ]}
            value={mode}
            onChange={(v) => setMode(v as "TIMES" | "HOURS")}
            testID="face-mode"
          />
          {mode === "TIMES" ? (
            <View style={styles.actions}>
              <View style={styles.flex}>
                <PickerField label="Punch-in" mode="time" value={checkIn} onChange={setCheckIn} testID="face-in" />
              </View>
              <View style={styles.gapX} />
              <View style={styles.flex}>
                <PickerField label="Punch-out" mode="time" value={checkOut} onChange={setCheckOut} testID="face-out" />
              </View>
            </View>
          ) : (
            <TextField label="Hours worked" value={hours} onChangeText={setHours} keyboardType="decimal-pad" testID="face-hours" />
          )}
        </>
      ) : null}
      {error ? <Banner tone="danger" message={error} testID="face-error" /> : null}
      <View style={styles.gapY} />
      <Button
        kind={kind === "approve" ? "primary" : "danger"}
        title={kind === "approve" ? "Approve" : "Reject and set attendance"}
        loading={send.isPending}
        onPress={submit}
        testID="face-submit"
      />
      <View style={styles.gapY} />
      <Button kind="ghost" title={strings.common.cancel} onPress={onClose} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  flex: { flex: 1 },
  photos: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm },
  photo: { width: 72, height: 72, borderRadius: radius.md },
  actions: { flexDirection: "row", marginTop: spacing.sm },
  gapX: { width: spacing.sm },
  gapY: { height: spacing.md },
  sheetTitle: { marginBottom: spacing.sm },
  note: { marginTop: spacing.sm, marginBottom: spacing.sm },
});
