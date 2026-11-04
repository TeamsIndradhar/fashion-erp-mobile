import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { OfflineBanner } from "@/components/OfflineBanner";
import { endpoints } from "@/core/services";
import { unreadCount } from "@/features/notifications/links";
import { formatDateTime } from "@/lib/dates";
import { colors, layout, radius, spacing } from "@/theme/tokens";

/** EMP-020 Notifications (in-app; push is backend gap G-10). */
export default function Notifications() {
  const auth = useAuth();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn";
  const list = useQuery({ queryKey: ["notifications"], queryFn: endpoints.notifications, enabled });
  const markAll = useMutation({
    mutationFn: endpoints.markAllNotificationsRead,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (!enabled) return <Redirect href="/" />;
  const unread = unreadCount(list.data);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={list.isRefetching} onRefresh={() => void list.refetch()} />}>
        <View style={styles.head}>
          <AppText variant="h2">Alerts</AppText>
          {unread > 0 ? (
            <Button kind="ghost" title={`Mark all read (${unread})`} loading={markAll.isPending} onPress={() => markAll.mutate()} testID="notifications-mark-all" />
          ) : null}
        </View>
        {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
        {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
        {list.data?.length === 0 ? <AppText color={colors.textSecondary}>No alerts yet.</AppText> : null}
        {list.data?.map((n) => (
          <Pressable
            key={n.id}
            accessibilityRole="button"
            accessibilityLabel={`${n.isRead ? "" : "Unread. "}${n.title}`}
            onPress={() => router.push({ pathname: "/notifications/[id]", params: { id: n.id } })}
          >
            <Card style={n.isRead ? undefined : styles.unread}>
              <View style={styles.row}>
                {!n.isRead ? <View style={styles.dot} /> : null}
                <AppText variant={n.isRead ? "body" : "bodyStrong"} style={styles.title} numberOfLines={2}>
                  {n.title}
                </AppText>
              </View>
              <AppText variant="caption" color={colors.textSecondary} numberOfLines={2}>
                {n.body}
              </AppText>
              <AppText variant="micro" color={colors.textSecondary} style={styles.when}>
                {formatDateTime(n.createdAt)}
              </AppText>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: layout.gutter },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.lg, marginBottom: spacing.lg },
  unread: { borderColor: colors.primary },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: radius.full, backgroundColor: colors.primary, marginRight: spacing.sm },
  title: { flex: 1 },
  when: { marginTop: spacing.sm },
});
