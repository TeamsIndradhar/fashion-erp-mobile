import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import * as Linking from "expo-linking";
import { Redirect, router } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import type { ResolvedBarcode } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { describeScan } from "@/features/inventory/inventory";
import { colors, radius, spacing } from "@/theme/tokens";

/** INV-007 Barcode scanner: roll, lot, carton, item, SKU or piece → what it is and where to open it. */
export default function Scan() {
  const auth = useAuth();
  const [perm, requestPerm] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResolvedBarcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const lastCode = useRef<string | null>(null);
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  if (!auth.me?.permissions.inventory?.scan) {
    return (
      <Screen>
        <Banner tone="info" message="You don't have permission to scan barcodes." />
      </Screen>
    );
  }

  async function look(code: string) {
    const c = code.trim();
    if (!c || busy || c === lastCode.current) return;
    lastCode.current = c;
    setBusy(true);
    setError(null);
    try {
      setResult(await endpoints.resolveBarcode(c));
    } catch (e) {
      setResult(null);
      setError(e instanceof ApiError && e.code === "NOT_FOUND" ? `No barcode matches “${c}”.` : e instanceof ApiError ? e.message : strings.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  function again() {
    lastCode.current = null;
    setResult(null);
    setError(null);
  }

  const d = result ? describeScan(result) : null;
  const scanning = !result && !error;

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Scan barcode
      </AppText>
      {perm?.granted ? (
        scanning ? (
          <View style={styles.cameraBox}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr", "code128", "code39", "ean13", "ean8", "datamatrix"] }}
              onBarcodeScanned={(e: BarcodeScanningResult) => void look(e.data)}
            />
          </View>
        ) : null
      ) : (
        <>
          <Banner tone="warning" message="Camera permission is needed to scan." />
          <View style={styles.gap} />
          <Button title={perm?.canAskAgain === false ? "Open settings" : "Allow camera"} onPress={() => void (perm?.canAskAgain === false ? Linking.openSettings() : requestPerm())} />
        </>
      )}
      {busy ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <Banner tone="warning" message={error} testID="scan-error" /> : null}
      {d ? (
        <Card>
          <AppText variant="h3">{d.title}</AppText>
          {d.lines.filter(Boolean).map((l) => (
            <AppText key={l} variant="caption" color={colors.textSecondary}>
              {l}
            </AppText>
          ))}
          {d.link ? (
            <View style={styles.gap}>
              <Button title="Open" onPress={() => router.push(d.link!)} testID="scan-open" />
            </View>
          ) : null}
        </Card>
      ) : null}
      {!scanning ? <Button kind="secondary" title="Scan another" onPress={again} /> : null}
      <View style={styles.gap} />
      <TextField label="Or type the code" value={typed} onChangeText={setTyped} autoCapitalize="characters" onSubmitEditing={() => { lastCode.current = null; void look(typed); }} />
      <Button kind="ghost" title="Look up" onPress={() => { lastCode.current = null; void look(typed); }} disabled={!typed.trim()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  cameraBox: { aspectRatio: 1, borderRadius: radius.lg, overflow: "hidden", marginBottom: spacing.lg, backgroundColor: colors.text },
  camera: { flex: 1 },
  gap: { marginTop: spacing.md },
});
