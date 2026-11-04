import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { HeroCard } from "../../components/HeroCard";
import { Icon, type IconName, type IconTone } from "../../components/Icon";
import { colors } from "../../theme/tokens";
import { agoText, type LiveLocation } from "./useLiveLocation";

/** Hero texts for the live location (display estimate only; the server decides on the punch). */
export function locationLines(live: LiveLocation, hasLocations: boolean): { over: string; place: string; status: string; icon: IconName; tone: IconTone } {
  switch (live.state) {
    case "ready":
      if (!hasLocations || !live.office) return { over: "Your location", place: "No office set up", status: "Ask HR to add an office location", icon: "alert", tone: "warning" };
      if (live.office.inside) return { over: "You are at", place: live.office.office.name, status: `Location verified · ${agoText(live.ageSeconds)}`, icon: "checkc", tone: "glow" };
      return { over: "Nearest office", place: live.office.office.name, status: `Outside office · ${Math.round(live.office.distance)} m away`, icon: "alert", tone: "warning" };
    case "checking":
      return { over: "Checking your location…", place: "Finding GPS", status: live.fix?.accuracy ? `GPS ± ${Math.round(live.fix.accuracy)} m so far` : "Please wait a few seconds", icon: "clock", tone: "white" };
    case "noPermission":
      return { over: "Location", place: "Not allowed yet", status: "Tap to Punch to allow location", icon: "alert", tone: "warning" };
    case "servicesOff":
      return { over: "Location", place: "GPS is turned off", status: "Turn on Location to punch", icon: "alert", tone: "warning" };
    default:
      return { over: "Location", place: "GPS is weak", status: "Move near a door or window", icon: "alert", tone: "warning" };
  }
}

export function gpsAccuracyText(live: LiveLocation): string {
  if (live.state === "ready" && live.fix.accuracy !== null) return `${Math.round(live.fix.accuracy)} m`;
  if (live.state === "checking" && live.fix?.accuracy) return `${Math.round(live.fix.accuracy)} m`;
  return "—";
}

/** EMP-001 hero: "You are at …" + the round "Tap to Punch / In · Out" button (BUTTONS.md round punch). */
export function PunchHero({
  live,
  hasLocations,
  label,
  sub,
  disabled,
  onPunch,
}: {
  live: LiveLocation;
  hasLocations: boolean;
  label: string;
  sub: string;
  disabled?: boolean;
  onPunch?: () => void;
}) {
  const l = locationLines(live, hasLocations);
  return (
    <HeroCard style={styles.punchHero}>
      <View style={styles.locRow}>
        <Icon name="pin" tone="white" size={28} />
        <View style={styles.locText}>
          <AppText variant="caption" color={colors.white} style={styles.over}>
            {l.over}
          </AppText>
          <AppText variant="h2" color={colors.white} numberOfLines={1} style={styles.place}>
            {l.place}
          </AppText>
          <View style={styles.statusRow}>
            <Icon name={l.icon} tone={l.tone === "warning" ? "white" : l.tone} size={14} />
            <AppText variant="caption" color={colors.white} numberOfLines={1} style={styles.status}>
              {l.status}
            </AppText>
          </View>
        </View>
      </View>
      <Pressable
        testID="home-punch"
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${sub}`}
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled || !onPunch}
        onPress={onPunch}
        style={({ pressed }) => [styles.halo, (disabled || !onPunch) && styles.dim, pressed && styles.pressed]}
      >
        <LinearGradient colors={["#6F5BF0", colors.primary]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.round}>
          <Icon name="finger" tone="white" size={46} />
          <AppText variant="bodyStrong" color={colors.white} style={styles.roundLabel}>
            {label}
          </AppText>
          <AppText variant="caption" color={colors.white} style={styles.roundSub}>
            {sub}
          </AppText>
        </LinearGradient>
      </Pressable>
    </HeroCard>
  );
}

/** COMPONENTS.md `TrustChips`, overlapping the bottom of the hero. */
export function TrustChips({ gps, deviceOk, deviceText }: { gps: string; deviceOk: boolean; deviceText: string }) {
  return (
    <View style={styles.chips}>
      <View style={styles.chip}>
        <Icon name="shieldCheck" tone="success" size={18} />
        <AppText variant="caption" style={styles.chipText} numberOfLines={1}>
          GPS accuracy: {gps}
        </AppText>
      </View>
      <View style={[styles.chip, styles.chipSep]}>
        <Icon name={deviceOk ? "checkc" : "alert"} tone={deviceOk ? "success" : "warning"} size={18} />
        <AppText variant="caption" style={styles.chipText} numberOfLines={1}>
          {deviceText}
        </AppText>
      </View>
    </View>
  );
}

/** COMPONENTS.md `TodayAttendanceCard`: section header + Check In / Check Out. */
export function TodayAttendanceCard({ checkIn, checkOut, onDetails }: { checkIn: string; checkOut: string; onDetails?: () => void }) {
  return (
    <Card style={styles.todayCard}>
      <View style={styles.sech}>
        <View style={styles.sechTitle}>
          <Icon name="calendar" tone="primary" size={22} />
          <AppText variant="h3" style={styles.sechText}>
            {"Today's Attendance"}
          </AppText>
        </View>
        {onDetails ? (
          <Pressable testID="home-view-details" accessibilityRole="link" hitSlop={8} onPress={onDetails} style={styles.link}>
            <AppText variant="caption" color={colors.primaryDark} style={styles.linkText}>
              View details
            </AppText>
            <Icon name="chev" tone="primary" size={16} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.today}>
        <View style={styles.todayCol}>
          <View style={[styles.todayIc, { backgroundColor: colors.successTint }]}>
            <Icon name="login" tone="success" size={20} />
          </View>
          <View>
            <AppText variant="caption" color={colors.textSecondary} style={styles.todaySmall}>
              Check In
            </AppText>
            <AppText variant="h3" style={styles.todayValue}>
              {checkIn}
            </AppText>
          </View>
        </View>
        <View style={styles.vline} />
        <View style={styles.todayCol}>
          <View style={[styles.todayIc, { backgroundColor: colors.dangerTint }]}>
            <Icon name="logout" tone="danger" size={20} />
          </View>
          <View>
            <AppText variant="caption" color={colors.textSecondary} style={styles.todaySmall}>
              Check Out
            </AppText>
            <AppText variant="h3" style={styles.todayValue}>
              {checkOut}
            </AppText>
          </View>
        </View>
      </View>
    </Card>
  );
}

/** EMP-002 hero: place + verification + GPS, today's date, and the checked-in ring. */
export function AttendanceHero({
  live,
  hasLocations,
  dateText,
  ringState,
  ringTime,
}: {
  live: LiveLocation;
  hasLocations: boolean;
  dateText: string;
  ringState: "in" | "out" | "none";
  ringTime: string;
}) {
  const l = locationLines(live, hasLocations);
  const verified = live.state === "ready" && l.tone === "glow";
  return (
    <HeroCard>
      <View style={styles.attRow}>
        <View style={styles.attLeft}>
          <View style={styles.locRow}>
            <Icon name="pin" tone={verified ? "glow" : "white"} size={30} />
            <View style={styles.locText}>
              <AppText variant="bodyStrong" color={colors.white} numberOfLines={1} style={styles.attPlace}>
                {l.place}
              </AppText>
              <View style={styles.statusRow}>
                <Icon name={l.icon} tone={l.tone === "warning" ? "white" : l.tone} size={14} />
                <AppText variant="caption" color={colors.white} numberOfLines={1} style={styles.status}>
                  {verified && live.state === "ready" ? `Verified · ${agoText(live.ageSeconds)}` : l.status}
                </AppText>
              </View>
              <AppText variant="caption" color={colors.white} style={styles.status}>
                GPS accuracy: {gpsAccuracyText(live)}
              </AppText>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.locRow}>
            <Icon name="clock" tone="white" size={22} />
            <AppText variant="caption" color={colors.white} style={styles.dateText}>
              <AppText variant="caption" color={colors.white} style={styles.dateBold}>
                Today:
              </AppText>
              {`  ${dateText}`}
            </AppText>
          </View>
        </View>
        <View style={[styles.ring, ringState === "in" ? styles.ringIn : styles.ringOut]} testID="attendance-ring">
          <Icon name={ringState === "in" ? "calendar" : ringState === "out" ? "checkc" : "clock"} tone="white" size={26} />
          <AppText variant="caption" color={colors.white} style={styles.ringSmall}>
            {ringState === "in" ? "Checked In" : ringState === "out" ? "Checked Out" : "Not checked in"}
          </AppText>
          <AppText variant="h3" color={colors.white} style={styles.ringTime} numberOfLines={1} adjustsFontSizeToFit>
            {ringTime}
          </AppText>
        </View>
      </View>
    </HeroCard>
  );
}

/** BUTTONS.md In/Out pair: only the valid one is enabled. */
export function PunchPair({ punchedIn, onIn, onOut }: { punchedIn: boolean; onIn: () => void; onOut: () => void }) {
  return (
    <View style={styles.pair}>
      <BigButton kind="in" disabled={punchedIn} onPress={onIn} />
      <BigButton kind="out" disabled={!punchedIn} onPress={onOut} />
    </View>
  );
}

function BigButton({ kind, disabled, onPress }: { kind: "in" | "out"; disabled: boolean; onPress: () => void }) {
  const isIn = kind === "in";
  return (
    <Pressable
      testID={isIn ? "attendance-punch-in" : "attendance-punch-out"}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.bigWrap, disabled && styles.bigDis, pressed && styles.pressed]}
    >
      <LinearGradient colors={isIn ? ["#25B762", colors.success] : ["#EF3A47", colors.danger]} style={styles.big}>
        <Icon name={isIn ? "login" : "logout"} tone="white" size={30} />
        <View style={styles.bigText}>
          <AppText variant="h3" color={colors.white} style={styles.bigTitle}>
            {isIn ? "Punch In" : "Punch Out"}
          </AppText>
          <AppText variant="micro" color={colors.white} numberOfLines={1} style={styles.bigSub}>
            {isIn ? "Start your attendance" : "End your attendance"}
          </AppText>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  punchHero: { marginBottom: 0 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  locText: { flex: 1, minWidth: 0 },
  over: { fontSize: 12.5, lineHeight: 16, opacity: 0.9 },
  place: { fontSize: 20, lineHeight: 25 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  status: { fontSize: 12, lineHeight: 16, opacity: 0.9, flexShrink: 1 },
  halo: { alignSelf: "center", marginTop: 12, marginBottom: 22, width: 148, height: 148, borderRadius: 74, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center", shadowColor: "#A0F0FF", shadowOpacity: 0.7, shadowRadius: 13, shadowOffset: { width: 0, height: 0 }, elevation: 10 },
  round: { width: 132, height: 132, borderRadius: 66, borderWidth: 4, borderColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" },
  roundLabel: { fontSize: 15, lineHeight: 19, fontWeight: "700", marginTop: 2 },
  roundSub: { fontSize: 11.5, lineHeight: 14, opacity: 0.85 },
  dim: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  chips: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    marginTop: -22,
    marginHorizontal: 14,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: "#4130CC",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 12,
    zIndex: 2,
  },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, flexShrink: 1 },
  chipSep: { borderLeftWidth: 1, borderLeftColor: colors.border },
  chipText: { fontSize: 12.5, lineHeight: 16, fontWeight: "600", flexShrink: 1 },
  todayCard: { padding: 14 },
  sech: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4, marginBottom: 8 },
  sechTitle: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1 },
  sechText: { fontWeight: "700" },
  link: { flexDirection: "row", alignItems: "center", gap: 2 },
  linkText: { fontWeight: "600" },
  today: { flexDirection: "row", alignItems: "center" },
  todayCol: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  todayIc: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  todaySmall: { fontSize: 12, lineHeight: 15 },
  todayValue: { fontSize: 18, lineHeight: 23, fontWeight: "700" },
  vline: { width: 1, height: 40, backgroundColor: colors.border, marginHorizontal: 10 },
  attRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  attLeft: { flex: 1, minWidth: 0 },
  attPlace: { fontSize: 16, lineHeight: 21, fontWeight: "700" },
  divider: { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.25)", marginVertical: 12 },
  dateText: { fontSize: 14, lineHeight: 19 },
  dateBold: { fontSize: 14, lineHeight: 19, fontWeight: "700" },
  ring: { width: 118, height: 118, borderRadius: 59, borderWidth: 6, backgroundColor: "#2D1FA8", alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  ringIn: { borderColor: colors.successGlow, shadowColor: colors.successGlow, shadowOpacity: 0.6, shadowRadius: 9, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  ringOut: { borderColor: "rgba(255,255,255,0.53)" },
  ringSmall: { fontSize: 12, lineHeight: 15, opacity: 0.9 },
  ringTime: { fontSize: 19, lineHeight: 24, fontWeight: "700" },
  pair: { flexDirection: "row", gap: 10, marginBottom: 14 },
  bigWrap: { flex: 1, borderRadius: 16, overflow: "hidden" },
  bigDis: { opacity: 0.38 },
  big: { minHeight: 62, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  bigText: { flex: 1, minWidth: 0 },
  bigTitle: { fontSize: 16, lineHeight: 20, fontWeight: "700" },
  bigSub: { fontSize: 10.5, lineHeight: 13, fontWeight: "400", opacity: 0.9 },
});
