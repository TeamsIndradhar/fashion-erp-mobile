import { useEffect, useRef, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { strings } from "../config/strings";
import type { SecurityReason } from "../device/deviceSecurity";
import { colors, spacing } from "../theme/tokens";
import { AppText } from "./AppText";
import { Card } from "./Card";
import { Icon, IconTile } from "./Icon";
import { Screen } from "./Screen";

export const SECURITY_LOCK_SECONDS = 10;

/**
 * D-043: the only thing a blocked phone sees — what is wrong, how to fix it,
 * and a 10-second countdown, then `onDone` signs out. No buttons, no way into the app.
 */
export function SecurityBlockedScreen({ reasons, onDone, seconds = SECURITY_LOCK_SECONDS }: { reasons: SecurityReason[]; onDone: () => void; seconds?: number }) {
  const [left, setLeft] = useState(seconds);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => {
      const remaining = Math.max(0, seconds - Math.floor((Date.now() - started) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        done.current();
      }
    }, 250);
    // Back button does nothing while the warning is up.
    const back = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => {
      clearInterval(timer);
      back.remove();
    };
  }, [seconds]);

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <View style={styles.icon}>
          <IconTile name="alert" tone="danger" size={72} round={36} />
        </View>
        <AppText variant="h2" style={styles.title}>
          {strings.security.title}
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.body}>
          {strings.security.body}
        </AppText>
        <Card style={styles.card}>
          {reasons.map((r) => (
            <View key={r} style={styles.reason}>
              <Icon name="alert" tone="danger" size={18} />
              <AppText variant="bodyStrong" style={styles.reasonText}>
                {strings.security.reasons[r]}
              </AppText>
            </View>
          ))}
          <AppText variant="caption" color={colors.textSecondary} style={styles.howTo}>
            {strings.security.howTo}
          </AppText>
        </Card>
        <AppText variant="caption" color={colors.textSecondary} style={styles.body}>
          {strings.security.recorded}
        </AppText>
        <AppText variant="h3" color={colors.danger} style={styles.title} accessibilityLiveRegion="polite">
          {strings.security.countdown(left)}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", padding: spacing.lg },
  icon: { alignItems: "center", marginBottom: spacing.lg },
  title: { textAlign: "center", marginBottom: spacing.md },
  body: { textAlign: "center", marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  reason: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  reasonText: { marginLeft: spacing.sm, flex: 1 },
  howTo: { marginTop: spacing.sm },
});
