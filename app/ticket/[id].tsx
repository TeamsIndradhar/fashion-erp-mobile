import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import type { TicketUpload } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { InnerHeader } from "@/components/InnerHeader";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import type { VoiceNote } from "@/components/VoiceNoteField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { TICKET_STATUS_LABEL, ticketAuthor } from "@/features/help/help";
import { TicketMessageCard, TicketUploads, uploadsOf } from "@/features/help/TicketParts";
import { colors, spacing } from "@/theme/tokens";

type DeskAction = "IN_PROGRESS" | "RESOLVED" | "FORWARD";

const DESK_TITLE: Record<DeskAction, string> = { IN_PROGRESS: "Mark in progress", RESOLVED: "Mark resolved", FORWARD: "Forward to support team" };

/** D-048 ticket conversation: replies with screenshots / voice notes; the company desk resolves or forwards. */
export default function TicketScreen() {
  const auth = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn" && !!id;
  const ticket = useQuery({ queryKey: ["tickets", id], queryFn: () => endpoints.ticket(id!), enabled });
  const list = useQuery({ queryKey: ["tickets"], queryFn: endpoints.myTickets, enabled });
  const [body, setBody] = useState("");
  const [screenshots, setScreenshots] = useState<TicketUpload[]>([]);
  const [voice, setVoice] = useState<VoiceNote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [desk, setDesk] = useState<DeskAction | null>(null);
  const [deskRemark, setDeskRemark] = useState("");

  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ["tickets"] })]);

  const reply = useMutation({
    mutationFn: () => endpoints.replyTicket(id!, body.trim(), uploadsOf(screenshots, voice)),
    onSuccess: async () => {
      setBody("");
      setScreenshots([]);
      setVoice(null);
      setError(null);
      await refresh();
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : strings.errors.generic),
  });
  const close = useMutation({ mutationFn: () => endpoints.closeTicket(id!), onSuccess: refresh });
  const deskMutation = useMutation({
    mutationFn: (action: DeskAction) => endpoints.deskTicket(id!, action, deskRemark.trim()),
    onSuccess: async () => {
      setDesk(null);
      setDeskRemark("");
      setError(null);
      await refresh();
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : strings.errors.generic),
  });

  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const t = ticket.data;
  const myUserId = auth.me?.user.id ?? null;
  const isDesk = !!list.data?.isTicketDesk;
  const closed = t?.status === "CLOSED";
  const canDesk = isDesk && !!t && !closed && t.stage === "COMPANY";

  function send() {
    if (!body.trim() && screenshots.length === 0 && !voice) return setError("Write a message, record a voice note or add a screenshot.");
    reply.mutate();
  }

  function runDesk() {
    if (!desk) return;
    if (desk === "FORWARD" && !deskRemark.trim()) return setError("Write a remark for the support team before forwarding.");
    deskMutation.mutate(desk);
  }

  return (
    <Screen refreshing={ticket.isRefetching} onRefresh={() => void ticket.refetch()}>
      <InnerHeader title={t?.ticketNumber ?? "Ticket"} />
      {ticket.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {ticket.error ? <Banner tone="danger" message={(ticket.error as Error).message} /> : null}
      {t ? (
        <>
          <Card>
            <AppText variant="h3">{t.subject}</AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.meta}>
              {TICKET_STATUS_LABEL[t.status]} · {t.stage === "PLATFORM" ? "With the support team" : "With your company's ticket desk"}
            </AppText>
            {t.createdBy ? (
              <AppText variant="caption" color={colors.textSecondary}>
                Raised by {t.createdBy.fullName}
              </AppText>
            ) : null}
            {t.stage === "PLATFORM" && t.forwardRemark ? (
              <AppText variant="caption" color={colors.accent} style={styles.meta}>
                Forwarded: {t.forwardRemark}
              </AppText>
            ) : null}
          </Card>

          {canDesk ? (
            <Card>
              <AppText variant="bodyStrong" style={styles.meta}>
                Ticket desk
              </AppText>
              {desk ? (
                <>
                  <TextField
                    label={desk === "FORWARD" ? "Remark for the support team (required)" : "Remark (optional)"}
                    value={deskRemark}
                    onChangeText={setDeskRemark}
                    multiline
                    maxLength={2000}
                    testID="ticket-desk-remark"
                  />
                  <Button title={DESK_TITLE[desk]} loading={deskMutation.isPending} onPress={runDesk} testID="ticket-desk-confirm" />
                  <View style={styles.gap} />
                  <Button kind="ghost" title={strings.common.cancel} onPress={() => setDesk(null)} />
                </>
              ) : (
                <>
                  {t.status !== "IN_PROGRESS" ? <Button kind="secondary" title={DESK_TITLE.IN_PROGRESS} onPress={() => setDesk("IN_PROGRESS")} testID="ticket-desk-progress" /> : null}
                  <View style={styles.gap} />
                  <Button title={DESK_TITLE.RESOLVED} onPress={() => setDesk("RESOLVED")} testID="ticket-desk-resolve" />
                  <View style={styles.gap} />
                  <Button kind="secondary" title={DESK_TITLE.FORWARD} onPress={() => setDesk("FORWARD")} testID="ticket-desk-forward" />
                </>
              )}
            </Card>
          ) : null}

          <AppText variant="h3" style={styles.section}>
            Conversation
          </AppText>
          {t.messages.map((m) => (
            <TicketMessageCard key={m.id} m={m} author={ticketAuthor(m, myUserId)} />
          ))}

          {error ? <Banner tone="danger" message={error} testID="ticket-error" /> : null}

          {closed ? (
            <AppText color={colors.textSecondary}>This ticket is closed. If you still need help, raise a new ticket.</AppText>
          ) : (
            <Card>
              <TextField label="Reply" value={body} onChangeText={setBody} multiline maxLength={10000} testID="ticket-reply" />
              <TicketUploads screenshots={screenshots} onScreenshots={setScreenshots} voice={voice} onVoice={setVoice} voiceLabel="Voice reply (optional)" />
              <View style={styles.gap} />
              <Button title="Send reply" loading={reply.isPending} onPress={send} testID="ticket-send-reply" />
              <View style={styles.gap} />
              <Button
                kind="ghost"
                title="Close ticket"
                onPress={() =>
                  Alert.alert("Close this ticket?", "Close it if your problem is solved. A closed ticket can't be reopened.", [
                    { text: strings.common.cancel, style: "cancel" },
                    { text: "Close ticket", style: "destructive", onPress: () => close.mutate() },
                  ])
                }
              />
            </Card>
          )}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { marginTop: spacing.xs },
  section: { marginTop: spacing.lg, marginBottom: spacing.md },
  gap: { height: spacing.sm },
});
