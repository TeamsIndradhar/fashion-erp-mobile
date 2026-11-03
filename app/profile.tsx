import { Redirect, router } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { env } from "@/config/env";
import { strings } from "@/config/strings";
import { colors, spacing } from "@/theme/tokens";

/** EMP-022 My profile + AUTH-008 sign-out confirmation. */
export default function Profile() {
  const auth = useAuth();
  if (auth.status !== "signedIn" || !auth.me) return <Redirect href="/" />;
  const { me } = auth;

  function confirm(message: string, run: () => Promise<void>) {
    Alert.alert(strings.profile.signOut, message, [
      { text: strings.common.cancel, style: "cancel" },
      {
        text: strings.profile.signOut,
        style: "destructive",
        onPress: () =>
          void run().catch((err) => Alert.alert(strings.profile.signOut, err instanceof ApiError ? err.message : strings.errors.generic)),
      },
    ]);
  }

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        {strings.profile.title}
      </AppText>
      <Card>
        <AppText variant="h3">{me.employee?.fullName ?? me.user.fullName}</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {me.user.email}
        </AppText>
      </Card>
      <Card>
        <ListRow label="Company" value={me.company?.name} />
        <ListRow label="Employee code" value={me.employee?.employeeCode} />
        <ListRow label="Department" value={me.employee?.departmentName} />
        <ListRow label="Designation" value={me.employee?.designationName} />
        <ListRow label="Branch" value={me.employee?.branchName} />
        <ListRow label="Shift" value={me.employee?.shift ? `${me.employee.shift.name} (${me.employee.shift.startTime}–${me.employee.shift.endTime})` : null} />
        <ListRow label="Phone" value={me.user.phone} />
      </Card>
      <Card>
        <ListRow label={strings.profile.devices} onPress={() => router.push("/devices")} testID="profile-devices" />
        <ListRow label="Change password" onPress={() => router.push("/change-password")} testID="profile-change-password" />
        <ListRow label="App version" value={`${env.appVersion} (${env.appVariant})`} />
      </Card>
      <View style={styles.actions}>
        <Button kind="danger" title={strings.profile.signOut} onPress={() => confirm(strings.profile.confirmSignOut, auth.signOut)} testID="profile-sign-out" />
        <View style={styles.gap} />
        <Button kind="ghost" title={strings.profile.signOutAll} onPress={() => confirm(strings.profile.confirmSignOutAll, auth.signOutEverywhere)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  actions: { marginTop: spacing.md },
  gap: { height: spacing.sm },
});
