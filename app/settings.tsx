import * as Linking from "expo-linking";
import { Redirect, router } from "expo-router";
import { StyleSheet } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { colors, spacing } from "@/theme/tokens";

/** EMP-024 Settings: phone-only preferences; no business settings. */
export default function Settings() {
  const auth = useAuth();
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Settings
      </AppText>
      <Card>
        <ListRow label="Language" value="English" />
        <AppText variant="caption" color={colors.textSecondary} style={styles.note}>
          Hindi will be added in a later update.
        </AppText>
      </Card>
      <Card>
        <ListRow label="Location & camera permissions" onPress={() => void Linking.openSettings()} testID="settings-permissions" />
        <AppText variant="caption" color={colors.textSecondary} style={styles.note}>
          Location is used only while you punch. The app never tracks you in the background.
        </AppText>
      </Card>
      <Card>
        <ListRow label="Help & support" onPress={() => router.push("/help")} />
        <ListRow label="About this app" onPress={() => router.push("/about")} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  note: { marginTop: spacing.sm },
});
