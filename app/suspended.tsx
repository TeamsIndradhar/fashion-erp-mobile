import { Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { strings } from "@/config/strings";
import { colors, spacing } from "@/theme/tokens";

/** AUTH-011 Account / company suspended. Text from the server. */
export default function Suspended() {
  const auth = useAuth();
  if (auth.status !== "suspended") return <Redirect href="/" />;
  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <AppText variant="h2" style={styles.title}>
          {strings.suspended.title}
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.body}>
          {auth.error?.message ?? strings.suspended.fallback}
        </AppText>
        <Button title={strings.common.retry} onPress={() => void auth.reload()} />
        <View style={styles.gap} />
        <Button kind="ghost" title={strings.profile.signOut} onPress={() => void auth.signOut()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center" },
  title: { textAlign: "center", marginBottom: spacing.md },
  body: { textAlign: "center", marginBottom: spacing["2xl"] },
  gap: { height: spacing.md },
});
