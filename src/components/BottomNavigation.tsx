import { useQuery } from "@tanstack/react-query";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../auth/AuthProvider";
import { endpoints } from "../core/services";
import { unreadCount } from "../features/notifications/links";
import { colors } from "../theme/tokens";
import { AppText } from "./AppText";
import { Icon, type IconName } from "./Icon";

export type NavTab = "Home" | "My Work" | "Alerts" | "Profile";

/**
 * NAVIGATION.md bottom navigation (employee set: Home · My Work · Alerts · Profile).
 * My Work opens production work for users who have it, otherwise attendance.
 */
export function BottomNavigation({ active }: { active: NavTab }) {
  const auth = useAuth();
  const insets = useSafeAreaInsets();
  const signedIn = auth.status === "signedIn";
  const alerts = useQuery({ queryKey: ["notifications"], queryFn: endpoints.notifications, enabled: signedIn });
  const unread = unreadCount(alerts.data);
  const me = auth.me;
  const hasWork = !!(me?.employee && me.permissions.production?.view);
  const workHref: Href = hasWork ? "/work" : "/attendance";

  const tabs: { name: NavTab; icon: IconName; href: Href; badge?: number }[] = [
    { name: "Home", icon: "home", href: "/home" },
    { name: "My Work", icon: "brief", href: workHref },
    { name: "Alerts", icon: "bell", href: "/notifications", badge: unread },
    { name: "Profile", icon: "user", href: "/profile" },
  ];

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map((t) => {
        const on = t.name === active;
        return (
          <Pressable
            key={t.name}
            testID={`nav-${t.name.toLowerCase().replace(" ", "-")}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={t.badge ? `${t.name}, ${t.badge} new` : t.name}
            onPress={() => {
              if (on) return;
              if (t.name === "Home") router.dismissTo("/home");
              else router.push(t.href);
            }}
            style={styles.tab}
          >
            <View style={styles.icon}>
              <Icon name={t.icon} tone={on ? "primary" : "muted"} size={24} />
              {t.badge ? (
                <View style={styles.badge}>
                  <AppText variant="micro" color={colors.white} style={styles.badgeText}>
                    {t.badge > 99 ? "99+" : t.badge}
                  </AppText>
                </View>
              ) : null}
            </View>
            <AppText variant="micro" color={on ? colors.primary : colors.textSecondary} style={styles.label}>
              {t.name}
            </AppText>
            {on ? <View style={styles.underline} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", justifyContent: "space-around", backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8 },
  tab: { width: 72, alignItems: "center", minHeight: 48 },
  icon: { height: 28, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 11.5, lineHeight: 15, fontWeight: "600" },
  underline: { height: 3, borderRadius: 2, backgroundColor: colors.primary, alignSelf: "stretch", marginTop: 4, marginHorizontal: 14 },
  badge: { position: "absolute", top: -4, left: 16, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, backgroundColor: colors.danger, alignItems: "center", justifyContent: "center" },
  badgeText: { fontSize: 9.5, lineHeight: 12 },
});
