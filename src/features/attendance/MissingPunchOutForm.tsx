import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ApiError } from "../../api/errors";
import type { MissingPunchOut } from "../../api/types";
import { AppText } from "../../components/AppText";
import { Banner } from "../../components/Banner";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { IconTile } from "../../components/Icon";
import { InfoBanner } from "../../components/InfoBanner";
import { InnerHeader } from "../../components/InnerHeader";
import { PickerField } from "../../components/PickerField";
import { Screen } from "../../components/Screen";
import { TextField } from "../../components/TextField";
import { strings } from "../../config/strings";
import { endpoints } from "../../core/services";
import { formatDateKey, formatTime } from "../../lib/dates";
import { colors } from "../../theme/tokens";

/** Earlier punches the employee still has to report before the next Punch In. */
export function unreportedPunchOuts(list: MissingPunchOut[] | undefined): MissingPunchOut[] {
  return (list ?? []).filter((m) => !m.requestId);
}

/**
 * Shown before Punch In when an earlier day has a punch-in but no punch-out:
 * the employee gives the punch-out time and a remark, which goes for approval
 * as a Missed logout regularization (same as Requests → Attendance correction).
 * The server refuses the Punch In until this is sent.
 */
export function MissingPunchOutForm({ item, remaining }: { item: MissingPunchOut; remaining: number }) {
  const qc = useQueryClient();
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const send = useMutation({
    mutationFn: () => endpoints.requestCorrection({ type: "MISSED_LOGOUT", sessionId: item.sessionId, checkOut: checkOut!, reason: reason.trim() }),
    onSuccess: async () => {
      setError(null);
      await Promise.all([qc.invalidateQueries({ queryKey: ["attendance"] }), qc.invalidateQueries({ queryKey: ["corrections"] })]);
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : strings.errors.generic),
  });

  function submit() {
    if (!checkOut) return setError("Choose the time you punched out.");
    if (!reason.trim()) return setError("Write a remark — why the punch-out was missed.");
    send.mutate();
  }

  const day = formatDateKey(item.dateKey);
  return (
    <Screen>
      <InnerHeader title="Punch-out missing" />
      <View style={styles.head}>
        <IconTile name="alert" tone="warning" size={76} round={24} />
        <AppText variant="h3" style={styles.title}>
          {day}: no punch-out
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={styles.text}>
          You punched in at {formatTime(item.checkInAt)}
          {item.locationName ? ` at ${item.locationName}` : ""} on {day} but did not punch out. Tell us when you left — it goes for approval, then you can punch in.
        </AppText>
      </View>

      <Card>
        <PickerField label={`Punch-out time on ${day} (or the next morning)`} mode="time" value={checkOut} onChange={setCheckOut} testID="missing-out-time" />
        <TextField
          label="Remark"
          value={reason}
          onChangeText={setReason}
          multiline
          maxLength={1000}
          placeholder="e.g. Forgot to punch out, left at 6:30 PM"
          testID="missing-out-remark"
        />
        {error ? <Banner tone="danger" message={error} testID="missing-out-error" /> : null}
        <View style={styles.gap} />
        <Button icon="checkc" title="Send for approval" loading={send.isPending} onPress={submit} testID="missing-out-send" />
      </Card>
      {remaining > 1 ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.more}>
          {remaining - 1} more day{remaining - 1 > 1 ? "s" : ""} without punch-out after this one.
        </AppText>
      ) : null}
      <Button kind="ghost" title="Not now" onPress={() => router.back()} testID="missing-out-cancel" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: "center", paddingVertical: 18, paddingHorizontal: 12 },
  title: { textAlign: "center", fontWeight: "700", marginTop: 14, marginBottom: 6 },
  text: { textAlign: "center", fontSize: 13.5, lineHeight: 19 },
  gap: { height: 10 },
  more: { textAlign: "center", marginBottom: 8 },
});

/** Home / attendance banners: one per earlier day without a punch-out (reported ones show as waiting for approval). */
export function MissingPunchOutBanners({ list, pendingToo = true }: { list: MissingPunchOut[] | undefined; pendingToo?: boolean }) {
  const rows = (list ?? []).filter((m) => pendingToo || !m.requestId);
  if (rows.length === 0) return null;
  return (
    <>
      {rows.map((m) =>
        m.requestId ? (
          <InfoBanner
            key={m.sessionId}
            tone="info"
            title={`Punch-out sent for approval · ${formatDateKey(m.dateKey)}`}
            text={`In ${formatTime(m.checkInAt)}${m.requestedPunchOut ? ` · Out ${formatTime(m.requestedPunchOut)} (requested)` : ""}`}
            testID={`missing-out-pending-${m.dateKey}`}
          />
        ) : (
          <InfoBanner
            key={m.sessionId}
            tone="warning"
            title={`Punch-out missing · ${formatDateKey(m.dateKey)}`}
            text={`You punched in at ${formatTime(m.checkInAt)} but did not punch out. Tap Punch In to send the punch-out time for approval.`}
            testID={`missing-out-${m.dateKey}`}
          />
        ),
      )}
    </>
  );
}
