import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import type { TicketCategory } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { FAQ, TICKET_CATEGORIES, TICKET_STATUS_LABEL, validateTicket } from "@/features/help/help";
import { formatDateTime } from "@/lib/dates";
import { colors, radius, spacing } from "@/theme/tokens";

/** EMP-026 Help & support: FAQ + my support tickets + raise a ticket (existing ERP tickets). */
export default function Help() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn";
  const [open, setOpen] = useState<number | null>(null);
  const [form, setForm] = useState(false);
  const tickets = useQuery({ queryKey: ["tickets"], queryFn: endpoints.myTickets, enabled });

  if (!enabled) return <Redirect href="/" />;

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Help & support
      </AppText>

      <AppText variant="h3" style={styles.section}>
        Common questions
      </AppText>
      {FAQ.map((item, i) => (
        <Pressable key={item.q} accessibilityRole="button" accessibilityState={{ expanded: open === i }} onPress={() => setOpen(open === i ? null : i)}>
          <Card>
            <AppText variant="bodyStrong">{item.q}</AppText>
            {open === i ? (
              <AppText color={colors.textSecondary} style={styles.answer}>
                {item.a}
              </AppText>
            ) : null}
          </Card>
        </Pressable>
      ))}

      <AppText variant="h3" style={styles.section}>
        My support tickets
      </AppText>
      {form ? (
        <TicketForm onDone={() => setForm(false)} />
      ) : (
        <Button title="Raise a ticket" onPress={() => setForm(true)} testID="help-raise-ticket" />
      )}
      <View style={styles.gap} />
      {tickets.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {tickets.error ? <Banner tone="danger" message={(tickets.error as Error).message} /> : null}
      {tickets.data?.tickets.length === 0 ? <AppText color={colors.textSecondary}>No tickets yet.</AppText> : null}
      {tickets.data?.tickets.map((t) => (
        <Card key={t.id}>
          <AppText variant="bodyStrong">
            {t.ticketNumber} · {t.subject}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {TICKET_STATUS_LABEL[t.status]} · {formatDateTime(t.lastMessageAt ?? t.createdAt)}
          </AppText>
        </Card>
      ))}
      {tickets.data && tickets.data.tickets.length > 0 ? (
        <AppText variant="caption" color={colors.textSecondary}>
          To read replies, open Support on the Fashion ERP website.
        </AppText>
      ) : null}
    </Screen>
  );
}

function TicketForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<TicketCategory>("GENERAL");
  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});
  const raise = useMutation({
    mutationFn: () => endpoints.raiseTicket({ subject: subject.trim(), category, body: body.trim() }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tickets"] });
      onDone();
    },
  });

  function submit() {
    const v = validateTicket(subject, body);
    setErrors(v);
    if (!v.subject && !v.body) raise.mutate();
  }

  return (
    <Card>
      <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
        Topic
      </AppText>
      <View style={styles.chips}>
        {TICKET_CATEGORIES.map((c) => (
          <Pressable
            key={c.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: category === c.value }}
            onPress={() => setCategory(c.value)}
            style={[styles.chip, category === c.value && styles.chipOn]}
          >
            <AppText variant="caption" color={category === c.value ? colors.white : colors.primaryDark}>
              {c.label}
            </AppText>
          </Pressable>
        ))}
      </View>
      <TextField label="Subject" value={subject} onChangeText={setSubject} error={errors.subject} maxLength={200} testID="ticket-subject" />
      <TextField label="What happened?" value={body} onChangeText={setBody} multiline error={errors.body} maxLength={10000} testID="ticket-body" />
      {raise.error ? <Banner tone="danger" message={raise.error instanceof ApiError ? raise.error.message : strings.errors.generic} /> : null}
      <View style={styles.gap} />
      <Button title="Send ticket" onPress={submit} loading={raise.isPending} testID="ticket-send" />
      <View style={styles.gapSm} />
      <Button kind="ghost" title={strings.common.cancel} onPress={onDone} />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.md },
  section: { marginTop: spacing.lg, marginBottom: spacing.md },
  answer: { marginTop: spacing.sm },
  gap: { height: spacing.md },
  gapSm: { height: spacing.sm },
  label: { marginBottom: spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.lg },
  chip: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginRight: spacing.sm, marginBottom: spacing.sm },
  chipOn: { backgroundColor: colors.primary },
});
