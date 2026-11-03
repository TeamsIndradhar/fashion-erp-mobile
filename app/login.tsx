import { Redirect } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { validateLogin } from "@/auth/validation";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { colors, spacing } from "@/theme/tokens";

/** AUTH-002 / 003 / 004 / 005 / 007: sign in; shows the server's generic error, lockout and session-ended notices. */
export default function Login() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (auth.status !== "signedOut" && auth.status !== "booting") return <Redirect href="/" />;

  async function submit() {
    const v = validateLogin(email, password);
    setFieldErrors(v);
    if (v.email || v.password) return;
    setBusy(true);
    setError(null);
    try {
      await auth.signIn(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : strings.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  const notice = error ?? auth.notice;
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1" color={colors.primary}>
          {strings.appName}
        </AppText>
        <AppText variant="h2" style={styles.title}>
          {strings.login.title}
        </AppText>
        <AppText variant="body" color={colors.textSecondary}>
          {strings.login.subtitle}
        </AppText>
      </View>
      {notice ? (
        <View style={styles.notice}>
          <Banner tone={error ? "danger" : "warning"} message={notice} testID="login-notice" />
        </View>
      ) : null}
      <TextField
        testID="login-email"
        label={strings.login.email}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        textContentType="username"
        error={fieldErrors.email}
      />
      <TextField
        testID="login-password"
        label={strings.login.password}
        value={password}
        onChangeText={setPassword}
        secure
        autoComplete="password"
        textContentType="password"
        onSubmitEditing={() => void submit()}
        error={fieldErrors.password}
      />
      <Button testID="login-submit" title={strings.login.submit} onPress={() => void submit()} loading={busy} disabled={!email || !password} />
      <Pressable accessibilityRole="button" style={styles.forgot} onPress={() => Alert.alert(strings.login.forgotTitle, strings.login.forgotBody)}>
        <AppText variant="bodyStrong" color={colors.primaryDark}>
          {strings.login.forgot}
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: spacing["3xl"], marginBottom: spacing["2xl"] },
  title: { marginTop: spacing.xl, marginBottom: spacing.xs },
  notice: { marginBottom: spacing.lg },
  forgot: { alignSelf: "center", marginTop: spacing.lg, padding: spacing.md },
});
