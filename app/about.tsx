import { StyleSheet } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { env } from "@/config/env";
import { strings } from "@/config/strings";
import { colors, spacing } from "@/theme/tokens";

const LICENCES = ["React Native (MIT)", "Expo (MIT)", "TanStack Query (MIT)", "React Native NetInfo (MIT)"];

/** EMP-027 About: version, server, privacy, licences. */
export default function About() {
  const auth = useAuth();
  const cfg = auth.appConfig;
  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        About {strings.appName}
      </AppText>
      <Card>
        <ListRow label="App version" value={`${env.appVersion} (${env.platform}, ${env.appVariant})`} />
        <ListRow label="Server" value={env.apiBaseUrl.replace(/^https?:\/\//, "")} />
        <ListRow label="Oldest supported version" value={cfg?.minAppVersion ?? "—"} />
        <ListRow label="Latest version" value={cfg?.latestAppVersion ?? "—"} />
        {auth.me?.company ? <ListRow label="Company" value={auth.me.company.name} /> : null}
      </Card>
      <Card>
        <AppText variant="bodyStrong">Privacy</AppText>
        <AppText color={colors.textSecondary} style={styles.para}>
          The app uses your location and a selfie only when you punch in or out, to record attendance for your company. Your sign-in is stored securely on this phone. Your company’s
          privacy notice will be linked here once it is published.
        </AppText>
      </Card>
      <Card>
        <AppText variant="bodyStrong">Open-source licences</AppText>
        {LICENCES.map((l) => (
          <AppText key={l} variant="caption" color={colors.textSecondary} style={styles.lic}>
            {l}
          </AppText>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  para: { marginTop: spacing.sm },
  lic: { marginTop: spacing.xs },
});
