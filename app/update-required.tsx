import * as Linking from "expo-linking";
import { Platform, StyleSheet, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { strings } from "@/config/strings";
import { colors, spacing } from "@/theme/tokens";

// Store pages (D-038). Play in-app update library is chosen once the app is on Play (needs a Play-installed build).
const STORE_URL = Platform.select({
  android: "market://details?id=in.indradhar.fashionerp",
  ios: "https://apps.apple.com/app/fashion-erp",
  default: "https://erp.indradhar.in",
});

/** AUTH-010 Update required. */
export default function UpdateRequired() {
  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <AppText variant="h2" style={styles.title}>
          {strings.update.requiredTitle}
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.body}>
          {strings.update.requiredBody}
        </AppText>
        <Button title={strings.update.open} onPress={() => void Linking.openURL(STORE_URL)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center" },
  title: { textAlign: "center", marginBottom: spacing.md },
  body: { textAlign: "center", marginBottom: spacing["2xl"] },
});
