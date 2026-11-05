import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Crypto from "expo-crypto";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as Linking from "expo-linking";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import type { PunchResult } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DataListCard } from "@/components/DataListCard";
import { InnerHeader } from "@/components/InnerHeader";
import { Screen } from "@/components/Screen";
import { StateView } from "@/components/StateView";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { nearestOffice } from "@/features/attendance/estimate";
import { acquireFix, ensureLocationPermission, getLocationPermission, locationServicesOn, MAX_FIX_AGE_MS, type GpsFix } from "@/features/attendance/location";
import { signalsFromFix, submitPunch } from "@/features/attendance/submitPunch";
import { formatTime } from "@/lib/dates";
import { colors, radius, spacing } from "@/theme/tokens";

type Step =
  | { kind: "locating"; last: GpsFix | null }
  | { kind: "permission"; blocked: boolean; servicesOff: boolean; asking: boolean }
  | { kind: "weakGps"; fix: GpsFix | null }
  | { kind: "scanner"; fix: GpsFix; verifying: boolean; error: string | null }
  | { kind: "done"; result: PunchResult };

const GPS_TIMEOUT_MS = 20_000;
const AUTO_CAPTURE_DELAY_MS = 1_800;
const MANUAL_BUTTON_DELAY_MS = 5_000;

/** EMP-003 permission · EMP-004 GPS check · EMP-005 face scanner · EMP-007/009 result. */
export default function Punch() {
  const { type: rawType } = useLocalSearchParams<{ type: string }>();
  const type = rawType === "OUT" ? "OUT" : "IN";
  const auth = useAuth();
  const qc = useQueryClient();
  const enabled = auth.status === "signedIn";
  const today = useQuery({ queryKey: ["attendance", "today"], queryFn: endpoints.attendanceToday, enabled });
  const offices = useQuery({ queryKey: ["attendance", "offices"], queryFn: endpoints.officeLocations, enabled, staleTime: 10 * 60_000 });
  const [camPerm, requestCamPerm] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [step, setStep] = useState<Step>({ kind: "locating", last: null });
  const [clientPunchId] = useState(() => Crypto.randomUUID());
  const [showManualCapture, setShowManualCapture] = useState(false);
  const autoCaptureTriggered = useRef(false);
  const submittingRef = useRef(false);

  const rules = today.data?.rules;
  const target = rules?.gpsAccuracyMeters ?? 50;
  const title = type === "IN" ? "Punch In" : "Punch Out";

  // Auto-start: acquire location and check camera permission immediately.
  useEffect(() => {
    if (!enabled) return;
    void startLocating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Show manual capture button after 5 seconds if not already submitted.
  useEffect(() => {
    if (step.kind !== "scanner") return;
    const timer = setTimeout(() => {
      setShowManualCapture(true);
    }, MANUAL_BUTTON_DELAY_MS);
    return () => clearTimeout(timer);
  }, [step.kind]);

  /** Shows EMP-003 first when location is not granted or GPS is off; the OS prompt comes only from "Allow location". */
  async function startLocating() {
    const [perm, servicesOn] = await Promise.all([getLocationPermission(), locationServicesOn()]);
    if (perm !== "granted" || !servicesOn) {
      return setStep({ kind: "permission", blocked: perm === "blocked", servicesOff: !servicesOn, asking: false });
    }
    await locate();
  }

  async function allowLocation() {
    setStep((s) => (s.kind === "permission" ? { ...s, asking: true } : s));
    const perm = await ensureLocationPermission();
    const servicesOn = await locationServicesOn();
    if (perm !== "granted" || !servicesOn) {
      return setStep({ kind: "permission", blocked: perm === "blocked", servicesOff: !servicesOn, asking: false });
    }
    await locate();
  }

  async function locate() {
    setStep({ kind: "locating", last: null });
    const fix = await acquireFix(target, GPS_TIMEOUT_MS, (f) => {
      setStep((s) => (s.kind === "locating" ? { kind: "locating", last: f } : s));
    });
    if (!fix || fix.accuracy === null || fix.accuracy > target) {
      return setStep({ kind: "weakGps", fix });
    }

    if (!camPerm?.granted) {
      const res = await requestCamPerm();
      if (!res.granted) {
        // Wait for user to grant camera
        return;
      }
    }

    setStep({ kind: "scanner", fix, verifying: false, error: null });
    autoCaptureTriggered.current = false;
  }

  // Auto-capture after camera settles on screen
  function handleCameraReady(fix: GpsFix) {
    if (autoCaptureTriggered.current || submittingRef.current) return;
    autoCaptureTriggered.current = true;
    setTimeout(() => {
      if (!submittingRef.current) {
        void captureAndSubmit(fix);
      }
    }, AUTO_CAPTURE_DELAY_MS);
  }

  async function captureAndSubmit(fix: GpsFix) {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setStep((s) => (s.kind === "scanner" ? { ...s, verifying: true, error: null } : s));

    try {
      const shot = await camera.current?.takePictureAsync({ quality: 0.8, skipProcessing: false });
      if (!shot) {
        submittingRef.current = false;
        setShowManualCapture(true);
        setStep((s) => (s.kind === "scanner" ? { ...s, verifying: false, error: "Could not take photo. Tap Capture." } : s));
        return;
      }

      // Resize: server takes up to 5 MB; 720 px JPEG is ~100 KB.
      const rendered = await ImageManipulator.manipulate(shot.uri).resize({ width: 720 }).renderAsync();
      const saved = await rendered.saveAsync({ compress: 0.7, format: SaveFormat.JPEG });

      // Ensure fix is fresh (< 60s)
      let useFix = fix;
      if (Date.now() - fix.timestamp > MAX_FIX_AGE_MS) {
        const fresh = await acquireFix(target, GPS_TIMEOUT_MS, () => undefined);
        if (fresh && fresh.accuracy !== null && fresh.accuracy <= target) {
          useFix = fresh;
        }
      }

      const result = await submitPunch(endpoints, {
        type,
        clientPunchId,
        fix: useFix,
        selfie: { uri: saved.uri, name: "selfie.jpg", type: "image/jpeg" },
        facePhotoId: null,
        signals: signalsFromFix(useFix),
      });

      await qc.invalidateQueries({ queryKey: ["attendance"] });
      setStep({ kind: "done", result });
    } catch (err) {
      submittingRef.current = false;
      setShowManualCapture(true);
      const e = err instanceof ApiError ? err : null;
      const message = e?.message ?? (err instanceof Error ? err.message : strings.errors.generic);
      setStep((s) => (s.kind === "scanner" ? { ...s, verifying: false, error: message } : s));
    }
  }

  if (!enabled) return <Redirect href="/" />;

  if (today.isPending) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  if (today.error) {
    return (
      <Screen>
        <Banner tone="danger" message={(today.error as Error).message} />
      </Screen>
    );
  }

  // Face enrolled check
  const faceRequired = !!rules?.requireFace;
  if (faceRequired && today.data && today.data.facePhotoIds.length === 0) {
    return (
      <Screen>
        <AppText variant="h2" style={styles.title}>
          {title}
        </AppText>
        <Banner tone="warning" testID="punch-no-face-photo" message="No face photo is enrolled for you yet. Ask HR to add your face photos, then punch." />
        <View style={styles.gap} />
        <Button kind="secondary" title="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  // EMP-003: Location permission — explained before the OS prompt (prototype EMP-003).
  if (step.kind === "permission") {
    const openSettings = () => void Linking.openSettings();
    return (
      <Screen>
        <InnerHeader title="Location needed" />
        <View style={styles.permSpacer} />
        <StateView
          icon="pin"
          tone="primary"
          title="Allow location while punching"
          text="Fashion ERP uses your location only while you check in or out, to confirm you are at your office. It never tracks you in the background."
        >
          <Button
            icon="pin"
            title="Allow location"
            loading={step.asking}
            testID="punch-allow-location"
            onPress={() => (step.blocked ? openSettings() : void allowLocation())}
          />
          <View style={styles.permGap} />
          <Card style={styles.permCard}>
            {step.servicesOff ? (
              <DataListCard
                icon="gps"
                tone="warning"
                title="Location is turned off"
                sub="Turn on GPS / Location in your phone settings"
                testID="punch-gps-off"
                onPress={openGpsSettings}
              />
            ) : null}
            <DataListCard
              icon="alert"
              tone="warning"
              title="Approximate location is on"
              sub="Turn on Precise location for Fashion ERP"
              testID="punch-precise"
              onPress={openSettings}
            />
            <DataListCard
              icon="lock"
              tone="danger"
              title="Location denied"
              sub="Open Settings → Location → While using"
              testID="punch-open-settings"
              onPress={openSettings}
            />
          </Card>
        </StateView>
      </Screen>
    );
  }

  // Step 1: Locating (EMP-004)
  if (step.kind === "locating") {
    return (
      <Screen>
        <AppText variant="h2" style={styles.title}>
          {title} · Step 1 / 3
        </AppText>
        <Card style={styles.centerCard}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText variant="h3" style={styles.locatingText}>
            Checking location…
          </AppText>
          <AppText color={colors.textSecondary}>
            {step.last?.accuracy ? `±${Math.round(step.last.accuracy)} m (need ≤ ${target} m)` : "Acquiring GPS fix…"}
          </AppText>
        </Card>
      </Screen>
    );
  }

  // EMP-004: Weak GPS
  if (step.kind === "weakGps") {
    return (
      <Screen>
        <AppText variant="h2" style={styles.title}>
          {title} · Step 1 / 3
        </AppText>
        <Card style={styles.centerCard}>
          <View style={styles.accuracyRing}>
            <AppText variant="h2" style={styles.accuracyNumber}>
              ±{Math.round(step.fix?.accuracy ?? 0)} m
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              need ≤ {target} m
            </AppText>
          </View>
          <Banner tone="warning" message="GPS signal is too weak. Move near a window or door and try again." />
        </Card>
        <Card>
          <AppText variant="bodyStrong">Tips for better GPS</AppText>
          <AppText color={colors.textSecondary} style={styles.bullet}>• Move near an open door or window</AppText>
          <AppText color={colors.textSecondary} style={styles.bullet}>• Step out from under metal-roof sheds</AppText>
          <AppText color={colors.textSecondary} style={styles.bullet}>• Turn on Wi-Fi (helps indoor location accuracy)</AppText>
        </Card>
        <View style={styles.gap} />
        <Button title="Try again" onPress={() => void startLocating()} />
      </Screen>
    );
  }

  // Step 2 & 3: Camera Scanner (EMP-005)
  if (step.kind === "scanner") {
    if (!camPerm?.granted) {
      return (
        <Screen>
          <AppText variant="h2" style={styles.title}>
            Camera permission needed
          </AppText>
          <Banner tone="warning" message="Camera access is needed to verify your face during attendance punch." />
          <View style={styles.gap} />
          <Button title="Allow camera" onPress={() => void requestCamPerm()} />
        </Screen>
      );
    }

    const office = offices.data ? nearestOffice(step.fix, offices.data) : null;

    return (
      <Screen>
        <View style={styles.headerRow}>
          <AppText variant="h2">{title}</AppText>
          <AppText variant="caption" color={colors.primary}>
            Step 2 / 3
          </AppText>
        </View>

        {/* Location chip */}
        <View style={styles.locationBadge}>
          <AppText variant="caption" color={colors.textSecondary}>
            📍 Location ±{Math.round(step.fix.accuracy ?? 0)} m{office ? ` · ${office.office.name}` : ""}
          </AppText>
        </View>

        {/* Camera container with oval face guide */}
        <View style={styles.cameraBox}>
          <CameraView
            ref={camera}
            style={styles.camera}
            facing="front"
            onCameraReady={() => handleCameraReady(step.fix)}
          />
          <View style={styles.overlayContainer}>
            <View style={styles.ovalGuide} />
            <AppText variant="caption" style={styles.guideHint}>
              Look at the camera · good light
            </AppText>
          </View>

          {step.verifying ? (
            <View style={styles.verifyingOverlay}>
              <ActivityIndicator size="large" color={colors.white} />
              <AppText variant="bodyStrong" color={colors.white} style={styles.verifyingText}>
                Verifying face with server…
              </AppText>
            </View>
          ) : null}
        </View>

        {step.error ? (
          <>
            <Banner tone="danger" message={step.error} />
            <View style={styles.gap} />
          </>
        ) : null}

        {/* Manual capture button (appears after 5s or on error) */}
        {showManualCapture || step.error ? (
          <Button
            kind="primary"
            title={step.verifying ? "Verifying…" : "Capture"}
            loading={step.verifying}
            disabled={step.verifying}
            onPress={() => void captureAndSubmit(step.fix)}
          />
        ) : (
          <View style={styles.autoHintBox}>
            <ActivityIndicator size="small" color={colors.primary} />
            <AppText variant="caption" color={colors.textSecondary} style={styles.autoHintText}>
              Hold still · verifying automatically…
            </AppText>
          </View>
        )}
      </Screen>
    );
  }

  // Done: Success (EMP-007) or Sent for Review (EMP-009)
  if (step.kind === "done") {
    const isReview = step.result.review.needsReview;
    return (
      <Screen>
        <View style={styles.gap} />
        <Banner
          tone={isReview ? "warning" : "success"}
          message={step.result.review.employeeMessage ?? step.result.message}
          testID="punch-result"
        />
        <Card style={styles.resultCard}>
          <AppText variant="display">
            {formatTime(type === "IN" ? step.result.session.checkInAt : (step.result.session.checkOutAt ?? step.result.session.checkInAt))}
          </AppText>
          <AppText color={colors.textSecondary} style={styles.resultSub}>
            {step.result.fromOffice ? (step.result.locationName ?? "Office") : "Outside office"}
            {step.result.distanceMeters !== null ? ` · ${Math.round(step.result.distanceMeters)} m` : ""}
          </AppText>
        </Card>
        <View style={styles.gap} />
        <Button title="Done" onPress={() => router.back()} testID="punch-done" />
      </Screen>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.md, marginBottom: spacing.md },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm, marginBottom: spacing.sm },
  gap: { height: spacing.md },
  subtext: { marginTop: spacing.xs },
  bullet: { marginTop: spacing.xs },
  centerCard: { alignItems: "center", paddingVertical: spacing.xl, marginBottom: spacing.md },
  locatingText: { marginTop: spacing.md, marginBottom: spacing.xs },
  accuracyRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    borderColor: colors.warningTint,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  accuracyNumber: { fontWeight: "700" },
  locationBadge: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignSelf: "flex-start",
    marginBottom: spacing.md,
  },
  cameraBox: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: spacing.md,
    backgroundColor: colors.text,
    position: "relative",
  },
  camera: { flex: 1 },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  ovalGuide: {
    width: 220,
    height: 290,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: colors.white,
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  guideHint: {
    color: colors.white,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    marginTop: spacing.md,
    overflow: "hidden",
  },
  verifyingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  verifyingText: {
    marginTop: spacing.md,
  },
  autoHintBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
  },
  autoHintText: {
    marginLeft: spacing.sm,
  },
  resultCard: { alignItems: "center", marginTop: spacing.lg, paddingVertical: spacing.xl },
  resultSub: { marginTop: spacing.xs },
  permSpacer: { height: 30 },
  permGap: { height: 10 },
  permCard: { padding: 14, paddingBottom: 6 },
});

/** Android: open the phone's Location (GPS) switch; iOS has no deep link, so open app settings. */
function openGpsSettings() {
  if (Platform.OS === "android") {
    Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS").catch(() => void Linking.openSettings());
  } else {
    void Linking.openSettings();
  }
}
