import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioPlayer, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../theme/tokens";
import { AppText } from "./AppText";
import { Button } from "./Button";

export interface VoiceNote {
  uri: string;
  name: string;
  type: string;
  durationMs: number;
}

const MAX_MS = 3 * 60_000;

function mmss(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * CR-001: record a voice note instead of typing (users who cannot type).
 * AAC in .m4a (`audio/mp4`), which the ERP's attachment storage accepts.
 */
export function VoiceNoteField({ value, onChange, label = "Voice note (optional)" }: { value: VoiceNote | null; onChange: (v: VoiceNote | null) => void; label?: string }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder, 250);
  const player = useAudioPlayer(value?.uri ?? null);
  const [starting, setStarting] = useState(false);

  async function start() {
    setStarting(true);
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Microphone", "Allow the microphone to record a voice note.");
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } finally {
      setStarting(false);
    }
  }

  async function stop() {
    const duration = state.durationMillis;
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false });
    if (recorder.uri) onChange({ uri: recorder.uri, name: "voice-note.m4a", type: "audio/mp4", durationMs: duration });
  }

  // Hard stop at the limit.
  useEffect(() => {
    if (state.isRecording && state.durationMillis >= MAX_MS) void stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isRecording, state.durationMillis]);

  return (
    <View style={styles.wrap}>
      <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
        {label}
      </AppText>
      {state.isRecording ? (
        <View style={styles.box}>
          <AppText variant="bodyStrong" color={colors.danger}>
            ● Recording {mmss(state.durationMillis)} / {mmss(MAX_MS)}
          </AppText>
          <View style={styles.gap} />
          <Button kind="danger" title="Stop" onPress={() => void stop()} testID="voice-stop" />
        </View>
      ) : value ? (
        <View style={styles.box}>
          <AppText variant="bodyStrong">Voice note · {mmss(value.durationMs)}</AppText>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Button
                kind="secondary"
                title="Play"
                onPress={() => {
                  player.seekTo(0);
                  player.play();
                }}
              />
            </View>
            <View style={styles.cell}>
              <Button kind="ghost" title="Delete" onPress={() => onChange(null)} />
            </View>
          </View>
        </View>
      ) : (
        <Button kind="secondary" title="🎤 Record voice note" loading={starting} onPress={() => void start()} testID="voice-record" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { marginBottom: spacing.xs },
  box: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: spacing.md, backgroundColor: colors.surface },
  gap: { height: spacing.sm },
  row: { flexDirection: "row", marginTop: spacing.sm, marginHorizontal: -spacing.xs },
  cell: { flex: 1, paddingHorizontal: spacing.xs },
});
