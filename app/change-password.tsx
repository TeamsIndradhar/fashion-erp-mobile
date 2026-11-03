import { Redirect, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { validatePasswordChange } from "@/auth/validation";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { colors, spacing } from "@/theme/tokens";

/** AUTH-006 (forced, no back) and EMP-023 (voluntary). Re-signs in with the new password afterwards (docs/05). */
export default function ChangePassword() {
  const auth = useAuth();
  const forced = auth.status === "mustChangePassword";
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (auth.status !== "mustChangePassword" && auth.status !== "signedIn") return <Redirect href="/" />;

  async function submit() {
    const v = validatePasswordChange(current, next, confirm);
    setErrors(v);
    if (v.current || v.next || v.confirm) return;
    const email = auth.me?.user.email;
    setBusy(true);
    setError(null);
    try {
      await endpoints.changePassword(current, next);
      if (email) await auth.afterPasswordChange(email, next);
      else await auth.signOut();
      if (!forced) router.back();
    } catch (err) {
      if (err instanceof ApiError) {
        const field = err.fieldErrors.newPassword?.[0] ?? err.fieldErrors.currentPassword?.[0];
        setError(field ?? err.message);
      } else setError(strings.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        {strings.changePassword.title}
      </AppText>
      {forced ? (
        <AppText variant="body" color={colors.textSecondary} style={styles.body}>
          {strings.changePassword.forcedBody}
        </AppText>
      ) : null}
      {error ? (
        <View style={styles.body}>
          <Banner tone="danger" message={error} />
        </View>
      ) : null}
      <TextField label={strings.changePassword.current} value={current} onChangeText={setCurrent} secure error={errors.current} testID="cp-current" />
      <TextField label={strings.changePassword.next} value={next} onChangeText={setNext} secure error={errors.next} textContentType="newPassword" testID="cp-next" />
      <TextField label={strings.changePassword.confirm} value={confirm} onChangeText={setConfirm} secure error={errors.confirm} textContentType="newPassword" testID="cp-confirm" />
      <Button title={strings.changePassword.submit} onPress={() => void submit()} loading={busy} testID="cp-submit" />
      {forced ? (
        <View style={styles.signOut}>
          <Button kind="ghost" title={strings.profile.signOut} onPress={() => void auth.signOut()} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing["2xl"], marginBottom: spacing.sm },
  body: { marginBottom: spacing.lg },
  signOut: { marginTop: spacing.lg },
});
