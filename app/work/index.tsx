import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { OfflineBanner } from "@/components/OfflineBanner";
import { endpoints } from "@/core/services";
import { assignmentProgress, groupAssignments } from "@/features/work/work";
import { colors, layout, spacing } from "@/theme/tokens";

/** WRK-002 My assigned work (+ WRK-010 when self-entry is off). */
export default function MyWork() {
  const auth = useAuth();
  const selfEntry = auth.me?.employee?.selfEntryEnabled !== false;
  const enabled = auth.status === "signedIn" && !!auth.me?.employee && selfEntry;
  const list = useQuery({ queryKey: ["work", "assignments"], queryFn: endpoints.myAssignments, enabled });
  const entries = useQuery({ queryKey: ["work", "entries"], queryFn: endpoints.myEntries, enabled });

  if (auth.status !== "signedIn") return <Redirect href="/" />;
  // The server answers PERMISSION_DENIED when self-entry is off (WRK-010).
  const off = !selfEntry || (list.error instanceof ApiError && list.error.code === "PERMISSION_DENIED");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <OfflineBanner />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={list.isRefetching} onRefresh={() => void Promise.all([list.refetch(), entries.refetch()])} />}
      >
        <AppText variant="h2" style={styles.title}>
          My work
        </AppText>
        {off ? (
          <Banner
            tone="info"
            testID="work-self-entry-off"
            message="Entering your own production from the phone is not turned on for you. Your supervisor records your work — ask them or HR if you should enter it yourself."
          />
        ) : (
          <>
            <View style={styles.links}>
              <View style={styles.cell}>
                <Button kind="secondary" title="My entries" onPress={() => router.push("/work/history")} />
              </View>
              {auth.me?.permissions.pieceRate?.view ? (
                <View style={styles.cell}>
                  <Button kind="secondary" title="My earnings" onPress={() => router.push("/work/earnings")} />
                </View>
              ) : null}
            </View>
            {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
            {list.error && !off ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
            {list.data?.length === 0 ? <AppText color={colors.textSecondary}>No work is assigned to you right now.</AppText> : null}
            {list.data
              ? groupAssignments(list.data)
                  .filter((g) => g.items.length > 0)
                  .map((g) => (
                    <View key={g.key}>
                      <AppText variant="h3" style={styles.group}>
                        {g.label} ({g.items.length})
                      </AppText>
                      {g.items.map((a) => {
                        const p = assignmentProgress(a, entries.data ?? []);
                        return (
                          <Pressable key={a.id} accessibilityRole="button" onPress={() => router.push({ pathname: "/work/[jobOrderId]", params: { jobOrderId: a.jobOrderId } })}>
                            <Card>
                              <AppText variant="bodyStrong">
                                {a.jobOrder.productionStage.name} · Lot {a.jobOrder.lot.lotNumber}
                              </AppText>
                              <AppText variant="caption" color={colors.textSecondary}>
                                {a.jobOrder.jobNumber} · assigned {p.assigned} · done {p.approved}
                                {p.pending ? ` · waiting ${p.pending}` : ""} · left {p.remaining}
                              </AppText>
                            </Card>
                          </Pressable>
                        );
                      })}
                    </View>
                  ))
              : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: layout.gutter },
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  links: { flexDirection: "row", marginHorizontal: -spacing.xs, marginBottom: spacing.md },
  cell: { flex: 1, paddingHorizontal: spacing.xs },
  group: { marginTop: spacing.md, marginBottom: spacing.sm },
});
