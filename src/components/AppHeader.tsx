import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { colors } from "../theme/tokens";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

/** AppHeader `home` variant (COMPONENTS.md): hanger logo, "Fashion ERP" + subtitle, bell with unread badge. */
export function AppHeader({ subtitle = "Attendance Mobile", unread = 0 }: { subtitle?: string; unread?: number }) {
  return (
    <View style={styles.row}>
      <Icon name="hanger" tone="primary" size={46} />
      <View style={styles.title}>
        <AppText variant="h1" style={styles.name}>
          Fashion ERP
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={styles.sub}>
          {subtitle}
        </AppText>
      </View>
      <Pressable
        testID="header-bell"
        accessibilityRole="button"
        accessibilityLabel={unread > 0 ? `Alerts, ${unread} new` : "Alerts"}
        hitSlop={8}
        onPress={() => router.push("/notifications")}
        style={styles.bell}
      >
        <Icon name="bell" tone="text" size={24} />
        {unread > 0 ? (
          <View style={styles.badge}>
            <AppText variant="micro" color={colors.white} style={styles.badgeText}>
              {unread > 99 ? "99+" : unread}
            </AppText>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 6, paddingBottom: 12 },
  title: { flex: 1 },
  name: { fontSize: 22, lineHeight: 27, letterSpacing: -0.2 },
  sub: { fontSize: 12.5, lineHeight: 16 },
  bell: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 10, lineHeight: 12, fontWeight: "700" },
});
