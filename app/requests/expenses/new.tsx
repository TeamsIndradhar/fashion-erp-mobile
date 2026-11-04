import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import * as ImagePicker from "expo-image-picker";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chips } from "@/components/Chips";
import { localDateKey, PickerField } from "@/components/PickerField";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { parseAmount, validateExpense } from "@/features/requests/requests";
import { colors, radius, spacing } from "@/theme/tokens";

type Photo = { uri: string; name: string; type: string };

/** EMP-016 Expense request (Payment Request type VOUCHER_SINGLE) with bill photos. */
export default function NewExpense() {
  const auth = useAuth();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn";
  const accounts = useQuery({ queryKey: ["expenses", "accounts"], queryFn: endpoints.expenseAccounts, enabled, staleTime: 10 * 60_000 });
  const today = localDateKey(new Date());
  const [amount, setAmount] = useState("");
  const [payToName, setPayToName] = useState(auth.me?.employee?.fullName ?? auth.me?.user.fullName ?? "");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(today);
  const [remark, setRemark] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<ReturnType<typeof validateExpense>>({});
  // Same key on every retry of this form → the server returns the first request.
  const [idempotencyKey] = useState(() => `mobile-expense:${Crypto.randomUUID()}`);

  const send = useMutation({
    mutationFn: async () => {
      const created = await endpoints.raiseExpense({ amount: parseAmount(amount)!, payToName: payToName.trim(), accountId: accountId!, paymentDueDate: dueDate!, remark: remark.trim(), idempotencyKey });
      let failed = 0;
      for (const p of photos) {
        try {
          await endpoints.addExpenseFile(created.id, p);
        } catch {
          failed++;
        }
      }
      return { created, failed };
    },
    onSuccess: ({ created, failed }) => {
      void qc.invalidateQueries({ queryKey: ["expenses"] });
      if (failed > 0) Alert.alert("Expense request", `The request was sent, but ${failed} photo(s) did not upload. Please send them to Accounts another way.`);
      router.replace({ pathname: "/requests/expenses/[id]", params: { id: created.id } });
    },
  });

  if (!enabled) return <Redirect href="/" />;

  async function addPhoto(fromCamera: boolean) {
    const perm = fromCamera ? await ImagePicker.requestCameraPermissionsAsync() : { granted: true };
    if (!perm.granted) return;
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], quality: 0.6 };
    const r = fromCamera ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
    const a = r.assets?.[0];
    if (!r.canceled && a) setPhotos((p) => [...p, { uri: a.uri, name: a.fileName ?? `bill-${p.length + 1}.jpg`, type: a.mimeType ?? "image/jpeg" }].slice(0, 10));
  }

  function submit() {
    const v = validateExpense({ amount, payToName, accountId, dueDate, today });
    setErrors(v);
    if (Object.keys(v).length === 0) send.mutate();
  }

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        New expense request
      </AppText>
      <Card>
        <TextField label="Amount (₹)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" error={errors.amount} testID="expense-amount" />
        <TextField label="Pay to" value={payToName} onChangeText={setPayToName} maxLength={200} error={errors.payToName} testID="expense-payto" />
        <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
          What is it for?
        </AppText>
        {accounts.isPending ? <ActivityIndicator color={colors.primary} /> : null}
        {accounts.error ? <Banner tone="danger" message={(accounts.error as Error).message} /> : null}
        <Chips options={(accounts.data ?? []).map((a) => ({ value: a.id, label: a.name.replace(/^\S+\s+—\s+/, "") }))} value={accountId} onChange={setAccountId} testID="expense-purpose" />
        {errors.accountId ? (
          <AppText variant="caption" color={colors.danger} style={styles.label}>
            {errors.accountId}
          </AppText>
        ) : null}
        <PickerField label="Pay by" mode="date" value={dueDate} onChange={setDueDate} minimumDate={new Date()} error={errors.dueDate} />
        <TextField label="Details (optional)" value={remark} onChangeText={setRemark} multiline maxLength={2000} />
        <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
          Bill / receipt photos
        </AppText>
        <View style={styles.photos}>
          {photos.map((p) => (
            <Image key={p.uri} source={{ uri: p.uri }} style={styles.thumb} />
          ))}
        </View>
        <View style={styles.pair}>
          <View style={styles.cell}>
            <Button kind="secondary" title="Take photo" onPress={() => void addPhoto(true)} />
          </View>
          <View style={styles.cell}>
            <Button kind="secondary" title="From gallery" onPress={() => void addPhoto(false)} />
          </View>
        </View>
        {send.error ? (
          <View style={styles.gapTop}>
            <Banner tone="danger" message={send.error instanceof ApiError ? send.error.message : strings.errors.generic} />
          </View>
        ) : null}
        <View style={styles.gapTop}>
          <Button title="Send for approval" onPress={submit} loading={send.isPending} testID="expense-submit" />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  label: { marginBottom: spacing.sm },
  photos: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.sm },
  thumb: { width: 72, height: 72, borderRadius: radius.sm, marginRight: spacing.sm, marginBottom: spacing.sm },
  pair: { flexDirection: "row", marginHorizontal: -spacing.xs },
  cell: { flex: 1, paddingHorizontal: spacing.xs },
  gapTop: { marginTop: spacing.md },
});
