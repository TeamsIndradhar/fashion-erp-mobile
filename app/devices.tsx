import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { formatDateTime } from "@/lib/dates";
import { colors, spacing } from "@/theme/tokens";

/** EMP-025 My devices: own phones, remove one (signs it out). */
export default function Devices() {
  const auth = useAuth();
  const qc = useQueryClient();
  const devices = useQuery({ queryKey: ["devices"], queryFn: endpoints.devices, enabled: auth.status === "signedIn" });
  const remove = useMutation({
    mutationFn: endpoints.removeDevice,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devices"] }),
    onError: (err) => Alert.alert(strings.profile.devices, err instanceof ApiError ? err.message : strings.errors.generic),
  });

  if (auth.status !== "signedIn") return <Redirect href="/" />;

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        {strings.profile.devices}
      </AppText>
      {devices.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {devices.error ? <Banner tone="danger" message={(devices.error as Error).message} /> : null}
      {devices.data?.length === 0 ? <AppText color={colors.textSecondary}>{strings.profile.noDevices}</AppText> : null}
      {devices.data?.map((d) => (
        <Card key={d.id}>
          <AppText variant="h3">
            {d.model ?? d.platform}
            {d.isCurrent ? ` · ${strings.profile.thisPhone}` : ""}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {[d.platform, d.osVersion, d.appVersion && `app ${d.appVersion}`, d.status].filter(Boolean).join(" · ")}
          </AppText>
          {d.lastSeenAt ? (
            <AppText variant="caption" color={colors.textSecondary}>
              Last used {formatDateTime(d.lastSeenAt)}
            </AppText>
          ) : null}
          {!d.isCurrent && d.status === "ACTIVE" ? (
            <View style={styles.remove}>
              <Button
                kind="secondary"
                title={strings.profile.remove}
                loading={remove.isPending && remove.variables === d.id}
                onPress={() =>
                  Alert.alert(strings.profile.remove, strings.profile.confirmRemove, [
                    { text: strings.common.cancel, style: "cancel" },
                    { text: strings.profile.remove, style: "destructive", onPress: () => remove.mutate(d.id) },
                  ])
                }
              />
            </View>
          ) : null}
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  remove: { marginTop: spacing.md },
});
