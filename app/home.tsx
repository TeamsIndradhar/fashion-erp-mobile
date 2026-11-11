import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppHeader } from "@/components/AppHeader";
import { Banner } from "@/components/Banner";
import { BottomNavigation } from "@/components/BottomNavigation";
import { EmployeeProfileCard } from "@/components/EmployeeProfileCard";
import { InfoBanner } from "@/components/InfoBanner";
import { ModuleGrid, type ModuleTile } from "@/components/ModuleGrid";
import { Screen } from "@/components/Screen";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { gpsAccuracyText, PunchHero, TodayAttendanceCard, TrustChips } from "@/features/attendance/AttendanceWidgets";
import { MissingPunchOutBanners } from "@/features/attendance/MissingPunchOutForm";
import { useLiveLocation } from "@/features/attendance/useLiveLocation";
import { unreadCount } from "@/features/notifications/links";
import { formatTime, istDateKey } from "@/lib/dates";
import { spacing } from "@/theme/tokens";

const DEVICE_TEXT: Record<string, { ok: boolean; text: string }> = {
  ACTIVE: { ok: true, text: "Device verified" },
  PENDING_APPROVAL: { ok: false, text: "Device pending" },
  REVOKED: { ok: false, text: "Device blocked" },
};

/** EMP-001 Employee home (prototype EMP-001): header, profile, punch hero, trust chips, today, shortcuts, bottom nav. */
export default function Home() {
  const auth = useAuth();
  const signedIn = auth.status === "signedIn";
  const me = auth.me;
  const alerts = useQuery({ queryKey: ["notifications"], queryFn: endpoints.notifications, enabled: signedIn });
  const unread = unreadCount(alerts.data);
  const canApprove = !!me?.permissions.production?.approve;
  const pending = useQuery({ queryKey: ["team", "pending"], queryFn: endpoints.pendingEntries, enabled: signedIn && canApprove });
  const attendanceAllowed = !!(me?.employee && me.permissions.attendance.view && me.modulesEnabled.hrms);
  const today = useQuery({ queryKey: ["attendance", "today"], queryFn: endpoints.attendanceToday, enabled: signedIn && attendanceAllowed });
  const { live, refresh } = useLiveLocation(signedIn && attendanceAllowed, today.data?.rules.gpsAccuracyMeters ?? 50);

  if (!signedIn || !me) return <Redirect href="/" />;

  const t = today.data;
  const open = t?.sessions.find((s) => s.id === t.openSessionId) ?? null;
  const firstIn = t?.sessions[0]?.checkInAt ?? null;
  const lastClosed = [...(t?.sessions ?? [])].reverse().find((s) => s.checkOutAt)?.checkOutAt ?? null;
  const canPunch = attendanceAllowed && me.permissions.attendance.punch;
  const device = DEVICE_TEXT[me.device?.status ?? ""] ?? { ok: false, text: "Device not verified" };
  const modules = new Set(me.viewableModules);

  const tiles: ModuleTile[] = [];
  if (attendanceAllowed) {
    tiles.push({ key: "report", label: "My Report", icon: "calendar", tone: "accent", onPress: () => router.push("/attendance/report") });
    tiles.push({
      key: "remark",
      label: "Add Remark",
      icon: "edit",
      tone: "accent",
      onPress: () => router.push({ pathname: "/attendance/day/[date]", params: { date: istDateKey() } }),
    });
  }
  // Shown to everyone: the hub explains when the login has no employee record or no request permission.
  tiles.push({ key: "requests", label: "My Requests", icon: "rupee", tone: "warning", onPress: () => router.push("/requests") });
  if (me.employee && modules.has("hrms_leave")) tiles.push({ key: "leave", label: "Leave", icon: "calendar", tone: "success", onPress: () => router.push("/leave") });
  if (attendanceAllowed) tiles.push({ key: "offices", label: "Office Locations", icon: "pin", tone: "primary", onPress: () => router.push("/attendance/offices") });
  if (me.employee && me.permissions.production?.view && !canApprove) tiles.push({ key: "work", label: "My Work", icon: "brief", tone: "primary", onPress: () => router.push("/work") });
  if (canApprove) {
    tiles.push({ key: "approvals", label: "Production Approvals", icon: "clipboard", tone: "primary", count: pending.data?.length || undefined, onPress: () => router.push("/team/approvals") });
    tiles.push({ key: "team", label: "Team Work", icon: "layers", tone: "accent", onPress: () => router.push("/team/orders") });
  }
  if (me.permissions.approvals?.paymentRequest || me.permissions.approvals?.purchaseOrder || me.permissions.approvals?.materialRequest) {
    tiles.push({ key: "approvals-inbox", label: "Approvals", icon: "checkc", tone: "success", onPress: () => router.push("/approvals") });
  }
  if ([me.permissions.approvals?.leave, me.permissions.approvals?.correction, me.permissions.approvals?.outdoor, me.permissions.approvals?.overtime].some(Boolean)) {
    tiles.push({ key: "team-reviews", label: "Team Approvals", icon: "users", tone: "success", onPress: () => router.push("/team/reviews") });
  }
  if (me.permissions.attendance.team) tiles.push({ key: "team-attendance", label: "Team Attendance", icon: "users", tone: "primary", onPress: () => router.push("/team/attendance") });
  if (modules.has("reports")) tiles.push({ key: "dashboard", label: "Business Dashboard", icon: "chart", tone: "info", onPress: () => router.push("/dashboard") });
  if (modules.has("inventory") || modules.has("fg_inventory")) tiles.push({ key: "inventory", label: "Inventory", icon: "box", tone: "warning", onPress: () => router.push("/inventory") });

  // Always tappable: a reason is shown instead of a silent grey button (today not loaded yet, failed, or no punch permission).
  const punch = async () => {
    if (!canPunch) return Alert.alert(strings.home.punchTitle, strings.home.noPunchPermission);
    let data = t;
    if (!data) {
      const res = await today.refetch();
      data = res.data;
      if (!data) return Alert.alert(strings.home.punchTitle, (res.error as Error | null)?.message ?? strings.errors.generic);
    }
    router.push({ pathname: "/attendance/punch", params: { type: data.isPunchedIn ? "OUT" : "IN" } });
  };

  return (
    <Screen
      footer={<BottomNavigation active="Home" />}
      refreshing={today.isRefetching}
      onRefresh={() => {
        void today.refetch();
        void alerts.refetch();
        void auth.reload();
        refresh();
      }}
    >
      <AppHeader unread={unread} />
      <EmployeeProfileCard
        name={me.employee?.fullName ?? me.user.fullName}
        code={me.employee?.employeeCode}
        department={[me.employee?.departmentName, me.employee?.designationName].filter(Boolean).join(" · ") || me.employee?.branchName}
        status={me.employee ? "Active" : null}
      />

      {!me.employee ? <Banner tone="warning" message={strings.home.noEmployee} /> : null}
      {me.employee && !attendanceAllowed ? <Banner tone="info" message={strings.home.attendanceOff} /> : null}

      {attendanceAllowed ? (
        <>
          <PunchHero
            live={live}
            hasLocations={t?.hasLocations ?? true}
            label="Tap to Punch"
            sub="In / Out"
            onPunch={() => void punch()}
          />
          <TrustChips gps={gpsAccuracyText(live)} deviceOk={device.ok} deviceText={device.text} />
          {today.error ? <Banner tone="danger" message={(today.error as Error).message} /> : null}
          <MissingPunchOutBanners list={t?.missingPunchOuts} pendingToo={false} />
          <TodayAttendanceCard
            checkIn={firstIn ? formatTime(firstIn) : "--:--"}
            checkOut={!open && lastClosed ? formatTime(lastClosed) : "--:--"}
            onDetails={() => router.push("/attendance")}
          />
        </>
      ) : null}

      {tiles.length ? <ModuleGrid tiles={tiles} /> : null}
      <View style={styles.gap} />
      <InfoBanner tone="success" text="Attendance is securely recorded and protected" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { height: spacing.xs },
});
