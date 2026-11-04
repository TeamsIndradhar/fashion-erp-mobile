import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { HeroCard } from "@/components/HeroCard";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { unreadCount } from "@/features/notifications/links";
import { colors, spacing } from "@/theme/tokens";

/** EMP-001 Employee home (release 1: profile + attendance entry). */
export default function Home() {
  const auth = useAuth();
  const alerts = useQuery({ queryKey: ["notifications"], queryFn: endpoints.notifications, enabled: auth.status === "signedIn" });
  const unread = unreadCount(alerts.data);
  const canApprove = !!auth.me?.permissions.production?.approve;
  const pending = useQuery({ queryKey: ["team", "pending"], queryFn: endpoints.pendingEntries, enabled: auth.status === "signedIn" && canApprove });
  if (auth.status !== "signedIn" || !auth.me) return <Redirect href="/" />;
  const { me } = auth;
  const attendanceAllowed = me.permissions.attendance.view && me.modulesEnabled.hrms;

  return (
    <Screen>
      <HeroCard>
        <AppText variant="caption" color={colors.white}>
          {me.company?.name ?? strings.appName}
        </AppText>
        <AppText variant="h1" color={colors.white} numberOfLines={1} style={styles.name}>
          {strings.home.greeting}, {me.employee?.fullName ?? me.user.fullName}
        </AppText>
        {me.employee ? (
          <AppText variant="caption" color={colors.white}>
            {[me.employee.employeeCode, me.employee.designationName, me.employee.branchName].filter(Boolean).join(" · ")}
          </AppText>
        ) : null}
      </HeroCard>

      {!me.employee ? <Banner tone="warning" message={strings.home.noEmployee} /> : null}
      {me.employee && !attendanceAllowed ? <Banner tone="info" message={strings.home.attendanceOff} /> : null}

      <View style={styles.actions}>
        {me.employee && attendanceAllowed ? <Button title="Attendance" onPress={() => router.push("/attendance")} testID="home-attendance" /> : null}
        <View style={styles.gap} />
        {me.employee && me.permissions.production?.view && !canApprove ? <Button title="My work" onPress={() => router.push("/work")} testID="home-work" /> : null}
        {canApprove ? <Button title={pending.data?.length ? `Approvals (${pending.data.length} waiting)` : "Approvals"} onPress={() => router.push("/team/approvals")} testID="home-approvals" /> : null}
        {canApprove ? <View style={styles.gap} /> : null}
        {canApprove ? <Button kind="secondary" title="Team work status" onPress={() => router.push("/team/orders")} testID="home-team" /> : null}
        <View style={styles.gap} />
        {me.employee ? <Button kind="secondary" title="My requests" onPress={() => router.push("/requests")} testID="home-requests" /> : null}
        <View style={styles.gap} />
        <Button kind="secondary" title={unread > 0 ? `Alerts (${unread} new)` : "Alerts"} onPress={() => router.push("/notifications")} testID="home-alerts" />
        <View style={styles.gap} />
        <Button kind="secondary" title={strings.profile.title} onPress={() => router.push("/profile")} testID="home-profile" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { marginVertical: spacing.xs },
  actions: { marginTop: spacing.lg },
  gap: { height: spacing.md },
});
