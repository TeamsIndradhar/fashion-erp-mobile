import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme/tokens";
import { AppText } from "./AppText";
import { Card } from "./Card";
import { StatusBadge, type BadgeTone } from "./StatusBadge";

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

/** COMPONENTS.md `EmployeeProfileCard`: avatar with online dot, name, employee ID, department, status badge. */
export function EmployeeProfileCard({
  name,
  code,
  department,
  status = "Active",
  tone = "success",
}: {
  name: string;
  code?: string | null;
  department?: string | null;
  status?: string | null;
  tone?: BadgeTone;
}) {
  return (
    <Card style={styles.card}>
      <View>
        <LinearGradient colors={["#C9C2F7", "#8F80E8"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
          <AppText variant="h2" color={colors.white}>
            {initials(name)}
          </AppText>
        </LinearGradient>
        <View style={styles.online} />
      </View>
      <View style={styles.who}>
        <AppText variant="h3" numberOfLines={1} style={styles.name}>
          {name}
        </AppText>
        {code ? (
          <AppText variant="caption" color={colors.textSecondary} style={styles.line}>
            {code}
          </AppText>
        ) : null}
        {department ? (
          <AppText variant="caption" color={colors.textSecondary} style={styles.line} numberOfLines={1}>
            {department}
          </AppText>
        ) : null}
      </View>
      {status ? <StatusBadge label={status} tone={tone} testID="profile-status" /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  avatar: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center" },
  online: { position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.white },
  who: { flex: 1, minWidth: 0 },
  name: { fontWeight: "700" },
  line: { fontSize: 12.5, lineHeight: 16 },
});
