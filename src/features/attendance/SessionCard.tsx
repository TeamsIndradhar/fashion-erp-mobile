import { StyleSheet, View } from "react-native";
import type { AttendanceSession } from "../../api/types";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { formatTime } from "../../lib/dates";
import { colors, spacing } from "../../theme/tokens";
import { sessionStatus, TONE_COLOR } from "./labels";

function place(name: string | null, distance: number | null) {
  return [name, distance !== null ? `${Math.round(distance)} m` : null].filter(Boolean).join(" · ") || "—";
}

export function SessionCard({ session, index }: { session: AttendanceSession; index: number }) {
  const st = sessionStatus(session);
  return (
    <Card>
      <View style={styles.head}>
        <AppText variant="h3">Punch {index + 1}</AppText>
        <AppText variant="micro" color={TONE_COLOR[st.tone]}>
          {st.label.toUpperCase()}
        </AppText>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <AppText variant="caption" color={colors.textSecondary}>
            In
          </AppText>
          <AppText variant="bodyStrong">{formatTime(session.checkInAt)}</AppText>
          <AppText variant="caption" color={colors.textSecondary} numberOfLines={2}>
            {place(session.inLocationName, session.inDistanceMeters)}
          </AppText>
        </View>
        <View style={styles.col}>
          <AppText variant="caption" color={colors.textSecondary}>
            Out
          </AppText>
          <AppText variant="bodyStrong">{session.checkOutAt ? formatTime(session.checkOutAt) : "—"}</AppText>
          <AppText variant="caption" color={colors.textSecondary} numberOfLines={2}>
            {session.checkOutAt ? place(session.outLocationName, session.outDistanceMeters) : "Still punched in"}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  row: { flexDirection: "row" },
  col: { flex: 1, paddingRight: spacing.sm },
});
