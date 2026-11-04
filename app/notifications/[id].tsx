import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { endpoints } from "@/core/services";
import { notificationTarget } from "@/features/notifications/links";
import { formatDateTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

/** EMP-021 Notification details: marks it read, opens the related screen when the app has one. */
export default function NotificationDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const auth = useAuth();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn";
  // Same cache as the list (the API has no single-notification read).
  const list = useQuery({ queryKey: ["notifications"], queryFn: endpoints.notifications, enabled });
  const n = list.data?.find((x) => x.id === id) ?? null;
  const marked = useRef(false);

  useEffect(() => {
    if (!n || n.isRead || marked.current) return;
    marked.current = true;
    endpoints
      .markNotificationRead(n.id)
      .then(() => qc.invalidateQueries({ queryKey: ["notifications"] }))
      .catch(() => undefined);
  }, [n, qc]);

  if (!enabled) return <Redirect href="/" />;
  const target = n ? notificationTarget(n) : null;

  return (
    <Screen>
      {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data && !n ? <Banner tone="warning" message="This alert is no longer available." /> : null}
      {n ? (
        <>
          <AppText variant="h2" style={styles.title}>
            {n.title}
          </AppText>
          <Card>
            <AppText>{n.body}</AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.when}>
              {formatDateTime(n.createdAt)}
            </AppText>
          </Card>
          {target ? (
            <Button title="Open" onPress={() => router.push(target)} testID="notification-open" />
          ) : n.relatedModule ? (
            <View>
              <AppText variant="caption" color={colors.textSecondary}>
                Open the Fashion ERP website to see this record.
              </AppText>
            </View>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  when: { marginTop: spacing.md },
});
