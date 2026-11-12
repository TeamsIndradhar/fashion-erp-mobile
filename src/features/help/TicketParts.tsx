import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import type { TicketAttachment, TicketMessage, TicketUpload } from "../../api/types";
import { AppText } from "../../components/AppText";
import { AuthImage } from "../../components/AuthImage";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { VoiceNoteField, type VoiceNote } from "../../components/VoiceNoteField";
import { env } from "../../config/env";
import { getSession } from "../../core/services";
import { formatDateTime } from "../../lib/dates";
import { openAuthedFile } from "../../lib/download";
import { colors, radius, spacing } from "../../theme/tokens";

/** Server limit per message (MAX_TICKET_ATTACHMENTS); one slot is kept for the voice note. */
export const MAX_SCREENSHOTS = 4;

const ATTACHMENT_PATH = (id: string) => `/api/v1/support-tickets/attachments/${id}?disposition=inline`;

/** D-048: screenshots from the gallery / camera plus one voice note, for a new ticket or a reply. */
export function TicketUploads({
  screenshots,
  onScreenshots,
  voice,
  onVoice,
  voiceLabel,
}: {
  screenshots: TicketUpload[];
  onScreenshots: (v: TicketUpload[]) => void;
  voice: VoiceNote | null;
  onVoice: (v: VoiceNote | null) => void;
  voiceLabel?: string;
}) {
  async function add(fromCamera: boolean) {
    if (screenshots.length >= MAX_SCREENSHOTS) return Alert.alert("Screenshots", `You can add up to ${MAX_SCREENSHOTS} pictures.`);
    if (fromCamera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return;
    }
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], quality: 0.7 };
    const r = fromCamera ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
    const a = r.assets?.[0];
    if (r.canceled || !a) return;
    onScreenshots([...screenshots, { uri: a.uri, name: a.fileName ?? `screenshot-${screenshots.length + 1}.jpg`, type: a.mimeType ?? "image/jpeg" }].slice(0, MAX_SCREENSHOTS));
  }

  return (
    <View>
      <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
        Screenshot (take one on your phone, then add it here)
      </AppText>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Button kind="secondary" icon="file" title="Gallery" onPress={() => void add(false)} testID="ticket-add-gallery" />
        </View>
        <View style={styles.gapX} />
        <View style={styles.flex}>
          <Button kind="secondary" title="Camera" onPress={() => void add(true)} testID="ticket-add-camera" />
        </View>
      </View>
      {screenshots.length > 0 ? (
        <View style={styles.thumbs}>
          {screenshots.map((s, i) => (
            <Pressable key={s.uri} accessibilityRole="button" accessibilityLabel={`Remove picture ${i + 1}`} onPress={() => onScreenshots(screenshots.filter((x) => x.uri !== s.uri))} style={styles.thumbChip}>
              <AppText variant="caption" numberOfLines={1} style={styles.thumbName}>
                {s.name}
              </AppText>
              <AppText variant="caption" color={colors.danger}>✕</AppText>
            </Pressable>
          ))}
        </View>
      ) : null}
      <VoiceNoteField value={voice} onChange={onVoice} label={voiceLabel ?? "Voice note (speak instead of typing)"} />
    </View>
  );
}

/** Files to send: screenshots first, then the voice note. */
export function uploadsOf(screenshots: TicketUpload[], voice: VoiceNote | null): TicketUpload[] {
  return [...screenshots, ...(voice ? [{ uri: voice.uri, name: voice.name, type: voice.type }] : [])];
}

/** Plays a ticket voice note from the server (bearer token sent with the request). */
function AudioAttachment({ a }: { a: TicketAttachment }) {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    void getSession()
      .freshAccessToken()
      .then((t) => {
        if (alive) setToken(t);
      });
    return () => {
      alive = false;
    };
  }, []);
  const player = useAudioPlayer(token ? { uri: `${env.apiBaseUrl}${ATTACHMENT_PATH(a.id)}`, headers: { Authorization: `Bearer ${token}` } } : null);
  const status = useAudioPlayerStatus(player);
  return (
    <View style={styles.audio}>
      <Button
        kind="secondary"
        title={status.playing ? "Pause voice note" : "Play voice note"}
        disabled={!token}
        onPress={() => {
          if (status.playing) player.pause();
          else {
            if (status.didJustFinish || (status.duration > 0 && status.currentTime >= status.duration)) void player.seekTo(0);
            player.play();
          }
        }}
        testID={`ticket-audio-${a.id}`}
      />
    </View>
  );
}

export function TicketAttachments({ attachments }: { attachments: TicketAttachment[] }) {
  if (attachments.length === 0) return null;
  return (
    <View style={styles.attachments}>
      {attachments.map((a) =>
        a.mimeType.startsWith("audio/") ? (
          <AudioAttachment key={a.id} a={a} />
        ) : a.mimeType.startsWith("image/") ? (
          <Pressable key={a.id} accessibilityRole="button" accessibilityLabel={`Open ${a.fileName}`} onPress={() => void openAuthedFile(ATTACHMENT_PATH(a.id), a.fileName, a.mimeType)}>
            <AuthImage path={ATTACHMENT_PATH(a.id)} style={styles.image} />
          </Pressable>
        ) : (
          <Button key={a.id} kind="ghost" title={a.fileName} onPress={() => void openAuthedFile(ATTACHMENT_PATH(a.id), a.fileName, a.mimeType)} />
        )
      )}
    </View>
  );
}

export function TicketMessageCard({ m, author }: { m: TicketMessage; author: string }) {
  const support = m.authorType === "PLATFORM";
  return (
    <Card style={support ? styles.support : undefined}>
      <View style={styles.row}>
        <AppText variant="bodyStrong" style={styles.flex} color={support ? colors.accent : colors.text}>
          {author}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {formatDateTime(m.createdAt)}
        </AppText>
      </View>
      <AppText style={styles.body}>{m.body}</AppText>
      <TicketAttachments attachments={m.attachments} />
    </Card>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.sm },
  row: { flexDirection: "row", alignItems: "center" },
  flex: { flex: 1 },
  gapX: { width: spacing.sm },
  thumbs: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.sm },
  thumbChip: { flexDirection: "row", alignItems: "center", gap: spacing.xs, borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, maxWidth: 200 },
  thumbName: { flexShrink: 1 },
  attachments: { marginTop: spacing.sm, gap: spacing.sm },
  image: { width: 160, height: 120, borderRadius: radius.md },
  audio: { alignSelf: "flex-start" },
  support: { borderColor: colors.accentTint, borderWidth: 1 },
  body: { marginTop: spacing.xs },
});
