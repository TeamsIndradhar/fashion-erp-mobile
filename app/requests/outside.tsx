import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Redirect } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import type { OutdoorRejection } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { formatDateTime, formatTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

/** EMP-031 Outside punch rejected: accept the trimmed time, or clarify with reason + proof. */
export default function OutsideReviews() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn";
  const list = useQuery({ queryKey: ["outside", "mine"], queryFn: endpoints.myOutsideReviews, enabled });
  if (!enabled) return <Redirect href="/" />;

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Outside punch reviews
      </AppText>
      <AppText color={colors.textSecondary} style={styles.intro}>
        When a manager trims a punch made outside the office, it shows here. Accept the new time, or explain and add proof.
      </AppText>
      {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data?.length === 0 ? <AppText color={colors.textSecondary}>Nothing to review.</AppText> : null}
      {list.data?.map((r) => <ReviewCard key={r.id} r={r} />)}
    </Screen>
  );
}

function ReviewCard({ r }: { r: OutdoorRejection }) {
  const qc = useQueryClient();
  const [clarifying, setClarifying] = useState(false);
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState<{ uri: string; name: string; type: string } | null>(null);
  const done = () => void qc.invalidateQueries({ queryKey: ["outside"] });
  const accept = useMutation({ mutationFn: () => endpoints.acceptOutsideReview(r.id), onSuccess: done });
  const clarify = useMutation({ mutationFn: () => endpoints.clarifyOutsideReview(r.id, reason.trim(), proof), onSuccess: done });
  const error = accept.error ?? clarify.error;

  async function pickProof() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
    const a = res.assets?.[0];
    if (!res.canceled && a) setProof({ uri: a.uri, name: a.fileName ?? "proof.jpg", type: a.mimeType ?? "image/jpeg" });
  }

  return (
    <Card>
      <View style={styles.row}>
        <AppText variant="bodyStrong" style={styles.flex}>
          {formatDateTime(r.originalCheckIn).split(",")[0]}
        </AppText>
        <StatusPill status={r.status} />
      </View>
      <AppText variant="caption" color={colors.textSecondary}>
        Your punch: {formatTime(r.originalCheckIn)} – {r.originalCheckOut ? formatTime(r.originalCheckOut) : "…"}
      </AppText>
      <AppText variant="caption" color={colors.textSecondary}>
        Counted as: {formatTime(r.trimmedCheckIn)} – {r.trimmedCheckOut ? formatTime(r.trimmedCheckOut) : "…"}
      </AppText>
      {r.rejectedReason ? <AppText style={styles.reason}>Manager: {r.rejectedReason}</AppText> : null}
      {r.clarificationReason ? <AppText style={styles.reason}>You: {r.clarificationReason}</AppText> : null}
      {error ? <Banner tone="danger" message={error instanceof ApiError ? error.message : strings.errors.generic} /> : null}
      {r.status === "PENDING" && !clarifying ? (
        <View style={styles.actions}>
          <Button
            title="Accept new time"
            loading={accept.isPending}
            onPress={() =>
              Alert.alert("Accept new time?", "Your attendance will count the trimmed time.", [
                { text: strings.common.cancel, style: "cancel" },
                { text: "Accept", onPress: () => accept.mutate() },
              ])
            }
          />
          <View style={styles.gap} />
          <Button kind="secondary" title="Explain" onPress={() => setClarifying(true)} />
        </View>
      ) : null}
      {clarifying ? (
        <View style={styles.actions}>
          <TextField label="Why were you outside?" value={reason} onChangeText={setReason} multiline maxLength={1000} />
          <Button kind="secondary" title={proof ? `Proof: ${proof.name}` : "Add proof photo (optional)"} onPress={() => void pickProof()} />
          <View style={styles.gap} />
          <Button title="Send explanation" loading={clarify.isPending} disabled={reason.trim().length === 0} onPress={() => clarify.mutate()} />
          <View style={styles.gap} />
          <Button kind="ghost" title={strings.common.cancel} onPress={() => setClarifying(false)} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.sm },
  intro: { marginBottom: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
  reason: { marginTop: spacing.sm },
  actions: { marginTop: spacing.md },
  gap: { height: spacing.sm },
});
