import { useNetInfo } from "@react-native-community/netinfo";
import { StyleSheet, View } from "react-native";
import { strings } from "../config/strings";
import { colors, spacing } from "../theme/tokens";
import { AppText } from "./AppText";

export function OfflineBanner() {
  const net = useNetInfo();
  // null = not known yet; only show when the OS says we are offline.
  if (net.isConnected !== false) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <AppText variant="caption" color={colors.text}>
        {strings.offline.banner}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: colors.warningTint, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
});
