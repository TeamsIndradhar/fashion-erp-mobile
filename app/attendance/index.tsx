import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import type { AttendanceSession } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Card } from "@/components/Card";
import { DataListCard } from "@/components/DataListCard";
import { Icon } from "@/components/Icon";
import { InfoBanner } from "@/components/InfoBanner";
import { InnerHeader } from "@/components/InnerHeader";
import { ModuleGrid, type ModuleTile } from "@/components/ModuleGrid";
import { Screen } from "@/components/Screen";
import { StatusBadge, type BadgeTone } from "@/components/StatusBadge";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { AttendanceHero, PunchPair } from "@/features/attendance/AttendanceWidgets";
import { MissingPunchOutBanners } from "@/features/attendance/MissingPunchOutForm";
import { useLiveLocation } from "@/features/attendance/useLiveLocation";
import { formatDateKey, formatHours, formatTime } from "@/lib/dates";
import { colors } from "@/theme/tokens";

const SESSION_BADGE: Record<string, { label: string; tone: BadgeTone }> = {
  PRESENT: { label: "Present", tone: "success" },
  PRESENT_FROM_OUTSIDE: { label: "Outside", tone: "warning" },
  REMOTE: { label: "Remote", tone: "info" },
};

function sessionPlace(fromOffice: boolean | null, distance: number | null) {
  return [fromOffice === null ? null : fromOffice ? "Inside office" : "Outside office", distance !== null ? `${Math.round(distance)} m` : null]
    .filter(Boolean)
    .join(" · ");
}

function SessionRow({ s }: { s: AttendanceSession }) {
  const badge = SESSION_BADGE[s.status] ?? { label: s.status.replace(/_/g, " ").toLowerCase(), tone: "neutral" as const };
  const place = s.inLocationName ?? s.inOffice?.name ?? null;
  const title = s.checkOutAt
    ? `${formatTime(s.checkInAt)} – ${formatTime(s.checkOutAt)}${place ? ` · ${place}` : ""}`
    : `In ${formatTime(s.checkInAt)}${place ? ` · ${place}` : ""}`;
  const sub = s.checkOutAt
    ? sessionPlace(s.isLogoutFromOffice, s.outDistanceMeters) || "Punched out"
    : sessionPlace(s.isLoginFromOffice, s.inDistanceMeters) || "Punched in";
  return (
    <DataListCard
      icon={s.checkOutAt ? "logout" : "login"}
      tone={s.checkOutAt ? "danger" : "success"}
      title={title}
      sub={sub}
      right={<StatusBadge label={badge.label} tone={badge.tone} />}
    />
  );
}

/** EMP-002 Attendance dashboard (prototype EMP-002): live location hero, In/Out pair, today's sessions, shift. */
export default function AttendanceDashboard() {
  const auth = useAuth();
  const signedIn = auth.status === "signedIn";
  const me = auth.me;
  // Opened from Home for every employee: say why when attendance is not allowed instead of a raw error.
  const allowed = !!(me?.employee && me.permissions.attendance.view && me.modulesEnabled.hrms);
  const enabled = signedIn && allowed;
  const today = useQuery({ queryKey: ["attendance", "today"], queryFn: endpoints.attendanceToday, enabled });
  const { live, refresh } = useLiveLocation(enabled, today.data?.rules.gpsAccuracyMeters ?? 50);

  if (!signedIn) return <Redirect href="/" />;

  const t = today.data;
  const open = t?.sessions.find((s) => s.id === t.openSessionId) ?? null;
  const lastOut = [...(t?.sessions ?? [])].reverse().find((s) => s.checkOutAt)?.checkOutAt ?? null;
  const ringState = open ? "in" : lastOut ? "out" : "none";
  const ringTime = open ? formatTime(open.checkInAt) : lastOut ? formatTime(lastOut) : "--:--";
  const shift = t?.employee.shift;
  const canPunch = !!auth.me?.permissions.attendance.punch;
  // D-045: My Attendance is the module; punch is one part, these are the others.
  const modules = new Set(auth.me?.viewableModules ?? []);
  const more: ModuleTile[] = [
    { key: "dashboard", label: "Monthly Dashboard", icon: "chart", tone: "info", onPress: () => router.push("/attendance/dashboard") },
    { key: "report", label: "My Report", icon: "file", tone: "accent", onPress: () => router.push("/attendance/report") },
    { key: "overtime", label: "Overtime", icon: "clock", tone: "info", onPress: () => router.push("/attendance/overtime") },
    { key: "outdoor", label: "Rejected Outdoor", icon: "pin", tone: "danger", onPress: () => router.push("/attendance/outdoor") },
  ];
  if (modules.has("hrms_attendance_regularization")) more.push({ key: "regularization", label: "Regularization", icon: "edit", tone: "warning", onPress: () => router.push("/attendance/regularizations") });
  more.push({ key: "leave", label: "My Leave", icon: "calendar", tone: "success", onPress: () => router.push("/leave") });

  return (
    <Screen
      // "My Work" points here only for users without production work; for the others no tab is current.
      footer={<BottomNavigation active={auth.me?.employee && auth.me.permissions.production?.view ? null : "My Work"} />}
      refreshing={today.isRefetching}
      onRefresh={() => {
        void today.refetch();
        refresh();
      }}
    >
      <InnerHeader
        title="My Attendance"
        right={
          <Pressable testID="attendance-report" accessibilityRole="button" accessibilityLabel="My report" hitSlop={8} onPress={() => router.push("/attendance/report")} style={styles.ib}>
            <Icon name="calendar" tone="text" size={22} />
          </Pressable>
        }
      />

      {!allowed ? <Banner tone="info" message={me?.employee ? strings.home.attendanceOff : strings.home.noEmployee} /> : null}
      {enabled && today.isPending ? <ActivityIndicator color={colors.primary} style={styles.loading} /> : null}
      {today.error ? <Banner tone="danger" message={(today.error as Error).message} /> : null}

      {t ? (
        <>
          <AttendanceHero live={live} hasLocations={t.hasLocations} dateText={formatDateKey(t.dateKey)} ringState={ringState} ringTime={ringTime} />
          {canPunch ? (
            <PunchPair
              punchedIn={t.isPunchedIn}
              onIn={() => router.push({ pathname: "/attendance/punch", params: { type: "IN" } })}
              onOut={() => router.push({ pathname: "/attendance/punch", params: { type: "OUT" } })}
            />
          ) : null}
          {!t.hasLocations ? <Banner tone="warning" message="No office location is set up yet. Ask HR to add one before punching." /> : null}
          <MissingPunchOutBanners list={t.missingPunchOuts} />

          <Card style={styles.card}>
            <AppText variant="h3" style={styles.sech}>
              {"Today's sessions"}
            </AppText>
            {t.sessions.length ? (
              t.sessions.map((s) => <SessionRow key={s.id} s={s} />)
            ) : (
              <AppText variant="caption" color={colors.textSecondary} style={styles.empty}>
                No punches yet today.
              </AppText>
            )}
            <View style={styles.kv}>
              <AppText variant="caption" color={colors.textSecondary} style={styles.kvText}>
                {open ? "Worked so far" : "Worked today"}
              </AppText>
              <AppText variant="bodyStrong" style={styles.kvText}>
                {formatHours(t.liveHours)}
              </AppText>
            </View>
            <View style={[styles.kv, styles.kvLast]}>
              <AppText variant="caption" color={colors.textSecondary} style={styles.kvText}>
                Shift
              </AppText>
              <AppText variant="bodyStrong" style={[styles.kvText, styles.kvValue]}>
                {shift ? `${shift.name} ${shift.startTime} – ${shift.endTime} (${shift.graceMinutes} min grace)` : "Not assigned"}
              </AppText>
            </View>
          </Card>
        </>
      ) : null}

      <ModuleGrid tiles={allowed ? more : more.filter((m) => m.key === "leave")} />
      <InfoBanner tone="success" text="Your attendance is securely recorded with fraud prevention." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  ib: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  loading: { marginVertical: 24 },
  card: { padding: 14 },
  sech: { fontWeight: "700", marginTop: 4, marginBottom: 8 },
  empty: { marginBottom: 8 },
  kv: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 },
  kvLast: { borderBottomWidth: 0 },
  kvText: { fontSize: 13.5, lineHeight: 18 },
  kvValue: { flexShrink: 1, textAlign: "right", fontWeight: "600" },
});
