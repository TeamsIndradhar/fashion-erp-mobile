import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { endpoints } from "@/core/services";
import { TONE_COLOR } from "@/features/attendance/labels";
import { approvalTone, pieces } from "@/features/work/work";
import { formatDateTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

/** WRK-006 My entries with approval status and the supervisor's remark. */
export default function WorkHistory() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn";
  const list = useQuery({ queryKey: ["work", "entries"], queryFn: endpoints.myEntries, enabled });
  if (!enabled) return <Redirect href="/" />;
  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        My entries
      </AppText>
      {list.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {list.error ? <Banner tone="danger" message={(list.error as Error).message} /> : null}
      {list.data?.length === 0 ? <AppText color={colors.textSecondary}>No entries yet.</AppText> : null}
      {list.data?.map((e) => {
        const t = approvalTone(e.approvalStatus);
        return (
          <Card key={e.id}>
            <View style={styles.row}>
              <AppText variant="bodyStrong" style={styles.flex}>
                {e.jobOrder?.productionStage.name ?? ""} · {e.jobOrder?.jobNumber ?? ""}
              </AppText>
              <AppText variant="micro" color={TONE_COLOR[t.tone]}>
                {t.label.toUpperCase()}
              </AppText>
            </View>
            <AppText variant="caption" color={colors.textSecondary}>
              Finished {pieces(e.completedQuantity)} · rejected {pieces(e.rejectedQuantity)} · damaged {pieces(e.damagedQuantity)}
              {pieces(e.extraQuantity) ? ` · extra ${pieces(e.extraQuantity)}` : ""} · {formatDateTime(e.createdAt)}
            </AppText>
            {e.approvalRemark ? <AppText style={styles.remark}>Supervisor: {e.approvalRemark}</AppText> : null}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  flex: { flex: 1 },
  remark: { marginTop: spacing.sm },
});
