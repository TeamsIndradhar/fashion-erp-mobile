import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Crypto from "expo-crypto";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as Linking from "expo-linking";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import type { PunchResult } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { nearestOffice } from "@/features/attendance/estimate";
import { acquireFix, ensureLocationPermission, MAX_FIX_AGE_MS, type GpsFix } from "@/features/attendance/location";
import { signalsFromFix, submitPunch } from "@/features/attendance/submitPunch";
import { formatTime } from "@/lib/dates";
import { colors, radius, spacing } from "@/theme/tokens";

type Step =
  | { kind: "start" }
  | { kind: "locating"; last: GpsFix | null }
  | { kind: "permission"; blocked: boolean }
  | { kind: "weakGps"; fix: GpsFix | null }
  | { kind: "selfie"; fix: GpsFix }
  | { kind: "confirm"; fix: GpsFix; photoUri: string }
  | { kind: "sending"; fix: GpsFix; photoUri: string }
  | { kind: "failed"; fix: GpsFix; photoUri: string; message: string; retryable: boolean }
  | { kind: "done"; result: PunchResult };

const GPS_TIMEOUT_MS = 20_000;

/** EMP-003 permission · EMP-004 GPS check · EMP-005 selfie · EMP-006/008 confirm · EMP-007/009 result. */
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
  const [step, setStep] = useState<Step>({ kind: "start" });
  // One id per punch attempt, reused on every retry so the server can replay.
  const [clientPunchId] = useState(() => Crypto.randomUUID());

  if (!enabled) return <Redirect href="/" />;
  const rules = today.data?.rules;
  const target = rules?.gpsAccuracyMeters ?? 50;
  const title = type === "IN" ? "Punch In" : "Punch Out";

  async function locate() {
    const perm = await ensureLocationPermission();
    if (perm !== "granted") return setStep({ kind: "permission", blocked: perm === "blocked" });
    setStep({ kind: "locating", last: null });
    const fix = await acquireFix(target, GPS_TIMEOUT_MS, (f) => setStep((s) => (s.kind === "locating" ? { kind: "locating", last: f } : s)));
    if (!fix || fix.accuracy === null || fix.accuracy > target) return setStep({ kind: "weakGps", fix });
    if (!camPerm?.granted) await requestCamPerm();
    setStep({ kind: "selfie", fix });
  }

  async function takeSelfie(fix: GpsFix) {
    const shot = await camera.current?.takePictureAsync({ quality: 0.8, skipProcessing: false });
    if (!shot) return;
    // Resize: the server takes up to 5 MB; 720 px wide JPEG is ~100 KB.
    const rendered = await ImageManipulator.manipulate(shot.uri).resize({ width: 720 }).renderAsync();
    const saved = await rendered.saveAsync({ compress: 0.7, format: SaveFormat.JPEG });
    setStep({ kind: "confirm", fix, photoUri: saved.uri });
  }

  async function send(fix: GpsFix, photoUri: string) {
    // A fix older than a minute is refreshed first (the server records its age).
    let useFix = fix;
    if (Date.now() - fix.timestamp > MAX_FIX_AGE_MS) {
      const fresh = await acquireFix(target, GPS_TIMEOUT_MS, () => undefined);
      if (!fresh || fresh.accuracy === null || fresh.accuracy > target) return setStep({ kind: "weakGps", fix: fresh });
      useFix = fresh;
    }
    setStep({ kind: "sending", fix: useFix, photoUri });
    try {
      const result = await submitPunch(endpoints, {
        type,
        clientPunchId,
        fix: useFix,
        selfie: { uri: photoUri, name: "selfie.jpg", type: "image/jpeg" },
        facePhotoId: null,
        signals: signalsFromFix(useFix),
      });
      await qc.invalidateQueries({ queryKey: ["attendance"] });
      setStep({ kind: "done", result });
    } catch (err) {
      const e = err instanceof ApiError ? err : null;
      const retryable = !e || e.code === "NETWORK_ERROR" || e.code === "TIMEOUT" || e.status >= 500;
      setStep({ kind: "failed", fix: useFix, photoUri, message: e?.message ?? strings.errors.generic, retryable });
    }
  }

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

  // Face check (D-037): the server compares the selfie with the enrolled photos.
  // The app sends no facePhotoId of its own — it never claims a match it didn't make.
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

  const estimate = step.kind === "confirm" || step.kind === "sending" ? (offices.data ? nearestOffice(step.fix, offices.data) : null) : null;

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        {title}
      </AppText>

      {step.kind === "start" ? (
        <>
          <Card>
            <AppText>The app checks your location and takes a selfie. Location is used only for this punch.</AppText>
            {faceRequired ? (
              <AppText variant="caption" color={colors.textSecondary} style={styles.faceNote}>
                Your face is checked from the selfie: look straight at the camera in good light, no mask or sunglasses.
              </AppText>
            ) : null}
          </Card>
          <Button title="Check my location" onPress={() => void locate()} testID="punch-start" />
        </>
      ) : null}

      {step.kind === "permission" ? (
        <>
          <Banner tone="warning" message="Location permission is needed to punch. Allow location “While using the app”." />
          <View style={styles.gap} />
          {step.blocked ? <Button title="Open settings" onPress={() => void Linking.openSettings()} /> : <Button title="Allow location" onPress={() => void locate()} />}
        </>
      ) : null}

      {step.kind === "locating" ? (
        <Card>
          <ActivityIndicator color={colors.primary} />
          <AppText style={styles.center}>
            Getting your location…{step.last?.accuracy ? ` ±${Math.round(step.last.accuracy)} m (need ±${target} m)` : ""}
          </AppText>
        </Card>
      ) : null}

      {step.kind === "weakGps" ? (
        <>
          <Banner
            tone="warning"
            message={`GPS is too weak${step.fix?.accuracy ? ` (±${Math.round(step.fix.accuracy)} m)` : ""}. It must be within ±${target} m — move near a window or an open area and try again.`}
          />
          <View style={styles.gap} />
          <Button title={strings.common.retry} onPress={() => void locate()} />
        </>
      ) : null}

      {step.kind === "selfie" ? (
        camPerm?.granted ? (
          <>
            <View style={styles.cameraBox}>
              <CameraView ref={camera} style={styles.camera} facing="front" />
            </View>
            <Button title="Take selfie" onPress={() => void takeSelfie(step.fix)} testID="punch-take-selfie" />
          </>
        ) : (
          <>
            <Banner tone="warning" message="Camera permission is needed for the attendance selfie." />
            <View style={styles.gap} />
            <Button title={camPerm?.canAskAgain === false ? "Open settings" : "Allow camera"} onPress={() => void (camPerm?.canAskAgain === false ? Linking.openSettings() : requestCamPerm())} />
          </>
        )
      ) : null}

      {step.kind === "confirm" || step.kind === "sending" || step.kind === "failed" ? (
        <>
          <Image source={{ uri: step.photoUri }} style={styles.preview} />
          <Card>
            <AppText variant="bodyStrong">Location ±{Math.round(step.fix.accuracy ?? 0)} m</AppText>
            {estimate ? (
              <AppText variant="caption" color={colors.textSecondary}>
                About {Math.round(estimate.distance)} m from {estimate.office.name}
                {estimate.inside ? " (looks inside)" : " (looks outside — your punch may go for review)"}
              </AppText>
            ) : null}
          </Card>
          {step.kind === "failed" ? (
            <>
              <Banner tone="danger" message={step.message} testID="punch-error" />
              <View style={styles.gap} />
            </>
          ) : null}
          {step.kind === "failed" && !step.retryable ? (
            <Button kind="secondary" title="Start again" onPress={() => setStep({ kind: "start" })} />
          ) : (
            <Button
              kind={type === "IN" ? "primary" : "danger"}
              title={step.kind === "failed" ? strings.common.retry : `Confirm ${title}`}
              loading={step.kind === "sending"}
              onPress={() => void send(step.fix, step.photoUri)}
              testID="punch-confirm"
            />
          )}
        </>
      ) : null}

      {step.kind === "done" ? (
        <>
          <Banner
            tone={step.result.review.needsReview ? "warning" : "success"}
            message={step.result.review.employeeMessage ?? step.result.message}
            testID="punch-result"
          />
          <Card style={styles.resultCard}>
            <AppText variant="display">{formatTime(type === "IN" ? step.result.session.checkInAt : (step.result.session.checkOutAt ?? step.result.session.checkInAt))}</AppText>
            <AppText color={colors.textSecondary}>
              {step.result.fromOffice ? (step.result.locationName ?? "Office") : "Outside office"}
              {step.result.distanceMeters !== null ? ` · ${Math.round(step.result.distanceMeters)} m` : ""}
            </AppText>
          </Card>
          <Button title="Done" onPress={() => router.back()} testID="punch-done" />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  gap: { height: spacing.md },
  center: { textAlign: "center", marginTop: spacing.md },
  faceNote: { marginTop: spacing.sm },
  cameraBox: { aspectRatio: 3 / 4, borderRadius: radius.lg, overflow: "hidden", marginBottom: spacing.lg, backgroundColor: colors.text },
  camera: { flex: 1 },
  preview: { width: "100%", aspectRatio: 3 / 4, borderRadius: radius.lg, marginBottom: spacing.lg },
  resultCard: { alignItems: "center", marginTop: spacing.lg },
});
