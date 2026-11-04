import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Redirect } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import type { CorrectionType } from "@/api/types";
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
import { CORRECTION_LABEL, CORRECTION_TYPES } from "@/features/requests/requests";
import { formatDateKey, formatTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

/** EMP-029 Attendance correction (regularization) request. */
export default function Correction() {
  const auth = useAuth();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn";
  const mine = useQuery({ queryKey: ["corrections", "mine"], queryFn: endpoints.myCorrections, enabled });
  const [type, setType] = useState<CorrectionType>("MISSED_PUNCH");
  const [date, setDate] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState<{ uri: string; name: string; type: string } | null>(null);
  const needs = CORRECTION_TYPES.find((t) => t.value === type)!.needs;
  const day = useQuery({ queryKey: ["attendance", "day", date], queryFn: () => endpoints.attendanceDay(date!), enabled: enabled && !!date && needs.includes("session") });

  const send = useMutation({
    mutationFn: async () => {
      const created = await endpoints.requestCorrection({
        type,
        attendanceDate: needs.includes("date") ? (date ?? undefined) : undefined,
        sessionId: needs.includes("session") ? (sessionId ?? undefined) : undefined,
        checkIn: needs.includes("in") ? (checkIn ?? undefined) : undefined,
        checkOut: needs.includes("out") ? (checkOut ?? undefined) : undefined,
        reason: reason.trim(),
      });
      // Proof is optional; the request is already saved if this upload fails.
      if (proof) await endpoints.addCorrectionProof(created.id, proof);
      return created;
    },
    onSuccess: () => {
      setDate(null);
      setSessionId(null);
      setCheckIn(null);
      setCheckOut(null);
      setReason("");
      setProof(null);
      void qc.invalidateQueries({ queryKey: ["corrections"] });
    },
  });

  if (!enabled) return <Redirect href="/" />;

  async function pickProof() {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
    const a = r.assets?.[0];
    if (!r.canceled && a) setProof({ uri: a.uri, name: a.fileName ?? "proof.jpg", type: a.mimeType ?? "image/jpeg" });
  }

  const ready =
    !!date && reason.trim().length > 0 && (!needs.includes("session") || !!sessionId) && (!needs.includes("in") || !!checkIn) && (!needs.includes("out") || !!checkOut);
  const today = new Date();

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Attendance correction
      </AppText>
      <Card>
        <Chips options={CORRECTION_TYPES.map((t) => ({ value: t.value, label: t.label }))} value={type} onChange={(v) => { setType(v); setSessionId(null); }} testID="correction-type" />
        <PickerField label="Day" mode="date" value={date} onChange={(v) => { setDate(v); setSessionId(null); }} maximumDate={today} testID="correction-date" />
        {needs.includes("session") && date ? (
          <>
            <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
              Which punch?
            </AppText>
            {day.isPending ? <ActivityIndicator color={colors.primary} /> : null}
            {day.data && day.data.sessions.length === 0 ? <AppText color={colors.textSecondary}>No punches on this day — use “Missed punch”.</AppText> : null}
            <Chips
              options={(day.data?.sessions ?? []).map((s) => ({ value: s.id, label: `${formatTime(s.checkInAt)} – ${s.checkOutAt ? formatTime(s.checkOutAt) : "no logout"}` }))}
              value={sessionId}
              onChange={setSessionId}
            />
          </>
        ) : null}
        {needs.includes("in") ? <PickerField label="Login time" mode="time" value={checkIn} onChange={setCheckIn} testID="correction-in" /> : null}
        {needs.includes("out") ? <PickerField label="Logout time" mode="time" value={checkOut} onChange={setCheckOut} testID="correction-out" /> : null}
        <TextField label="Reason" value={reason} onChangeText={setReason} multiline maxLength={1000} placeholder="e.g. GPS did not work inside the factory" testID="correction-reason" />
        <Button kind="secondary" title={proof ? `Proof: ${proof.name}` : "Attach proof (optional)"} onPress={() => void pickProof()} />
        {send.error ? (
          <View style={styles.gapTop}>
            <Banner tone="danger" message={send.error instanceof ApiError ? send.error.message : strings.errors.generic} />
          </View>
        ) : null}
        {send.isSuccess ? (
          <View style={styles.gapTop}>
            <Banner tone="success" message="Correction sent for approval." />
          </View>
        ) : null}
        <View style={styles.gapTop}>
          <Button title="Send request" onPress={() => send.mutate()} loading={send.isPending} disabled={!ready} testID="correction-submit" />
        </View>
      </Card>

      <AppText variant="h3" style={styles.section}>
        My corrections
      </AppText>
      {mine.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {mine.data?.length === 0 ? <AppText color={colors.textSecondary}>No corrections yet.</AppText> : null}
      {mine.data?.map((c) => (
        <Card key={c.id}>
          <View style={styles.row}>
            <AppText variant="bodyStrong" style={styles.flex}>
              {CORRECTION_LABEL[c.type]} · {formatDateKey(c.attendanceDate.slice(0, 10))}
            </AppText>
            <StatusPill status={c.status} />
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            {[c.requestedPunchIn && `in ${formatTime(c.requestedPunchIn)}`, c.requestedPunchOut && `out ${formatTime(c.requestedPunchOut)}`].filter(Boolean).join(" · ") || c.reason}
          </AppText>
          {c.rejectionReason ? (
            <AppText variant="caption" color={colors.danger}>
              {c.rejectionReason}
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
  gapTop: { marginTop: spacing.md },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
});
