import { Redirect, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { HeroCard } from "@/components/HeroCard";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { strings } from "@/config/strings";
import { colors, spacing } from "@/theme/tokens";

/** EMP-001 Employee home (release 1: profile + attendance entry). */
export default function Home() {
  const auth = useAuth();
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
