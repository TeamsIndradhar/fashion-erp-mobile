import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { strings } from "@/config/strings";
import { colors, spacing } from "@/theme/tokens";

/** AUTH-001 Splash: app-config + session check, then routes by auth state (docs/02 §5). */
export default function Splash() {
  const auth = useAuth();
  switch (auth.status) {
    case "updateRequired":
      return <Redirect href="/update-required" />;
    case "signedOut":
      return <Redirect href="/login" />;
    case "mustChangePassword":
      return <Redirect href="/change-password" />;
    case "suspended":
      return <Redirect href="/suspended" />;
    case "signedIn":
      return <Redirect href="/home" />;
    case "offline":
      return (
        <Screen scroll={false}>
          <View style={styles.center}>
            <AppText variant="h3" style={styles.gap}>
              {auth.error?.message ?? strings.errors.network}
            </AppText>
            <Button title={strings.common.retry} onPress={() => void auth.reload()} />
          </View>
        </Screen>
      );
    default:
      return (
        <View style={[styles.center, { backgroundColor: colors.bg }]}>
          <AppText variant="h1" color={colors.primary} style={styles.gap}>
            {strings.appName}
          </AppText>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  gap: { marginBottom: spacing.lg, textAlign: "center" },
});
