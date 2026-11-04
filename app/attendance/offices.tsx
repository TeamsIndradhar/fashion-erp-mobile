import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { Banner } from "@/components/Banner";
import { DataListCard } from "@/components/DataListCard";
import { InnerHeader } from "@/components/InnerHeader";
import { Screen } from "@/components/Screen";
import { StatusBadge } from "@/components/StatusBadge";
import { StateView } from "@/components/StateView";
import { endpoints } from "@/core/services";
import { distanceMeters } from "@/features/attendance/estimate";
import { useLiveLocation } from "@/features/attendance/useLiveLocation";
import { colors } from "@/theme/tokens";

/** Office Locations (home shortcut): the offices you can punch at, with your distance when GPS is on. */
export default function OfficeLocations() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn";
  const offices = useQuery({ queryKey: ["attendance", "offices"], queryFn: endpoints.officeLocations, enabled, staleTime: 10 * 60_000 });
  const { live } = useLiveLocation(enabled, 50);
  if (!enabled) return <Redirect href="/" />;

  const fix = live.state === "ready" ? live.fix : null;
  const list = (offices.data ?? [])
    .map((o) => ({ o, d: fix ? distanceMeters(fix, o) : null }))
    .sort((a, b) => (a.d ?? 0) - (b.d ?? 0));

  return (
    <Screen>
      <InnerHeader title="Office Locations" />
      {offices.isPending ? <ActivityIndicator color={colors.primary} style={styles.loading} /> : null}
      {offices.error ? <Banner tone="danger" message={(offices.error as Error).message} /> : null}
      {offices.data && offices.data.length === 0 ? (
        <StateView icon="pin" title="No office location yet" text="Ask HR to add your office location before punching." />
      ) : null}
      {list.map(({ o, d }) => {
        const inside = d !== null && d <= o.radiusMeters;
        return (
          <DataListCard
            key={o.id}
            icon="pin"
            tone={inside ? "success" : "primary"}
            title={o.name}
            sub={[`Allowed within ${Math.round(o.radiusMeters)} m`, d !== null ? `You are ${d >= 1000 ? `${(d / 1000).toFixed(1)} km` : `${Math.round(d)} m`} away` : null].filter(Boolean).join(" · ")}
            right={inside ? <StatusBadge label="You are here" tone="success" /> : null}
          />
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { marginVertical: 24 },
});
