import { StyleSheet, View } from "react-native";
import { colors, radius } from "../theme/tokens";
import { AppText } from "./AppText";
import { Icon, type IconName } from "./Icon";

type Tone = "success" | "warning" | "danger" | "info";

const STYLE: Record<Tone, { bg: string; border: string; icon: IconName }> = {
  success: { bg: colors.successTint, border: "#BFECCF", icon: "shieldCheck" },
  warning: { bg: colors.warningTint, border: "#FFE0A8", icon: "alert" },
  danger: { bg: colors.dangerTint, border: "#F7C0C5", icon: "alert" },
  info: { bg: colors.infoTint, border: "#C9DAFC", icon: "info" },
};

/** Tinted banner with an icon on the left (COMPONENTS.md `InfoBanner`, prototype `.banner`). */
export function InfoBanner({ tone, title, text, testID }: { tone: Tone; title?: string; text: string; testID?: string }) {
  const s = STYLE[tone];
  return (
    <View testID={testID} style={[styles.box, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Icon name={s.icon} tone={tone === "info" ? "info" : tone} size={30} />
      <View style={styles.text}>
        {title ? (
          <AppText variant="bodyStrong" style={styles.title}>
            {title}
          </AppText>
        ) : null}
        <AppText variant="caption" style={styles.body}>
          {text}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: radius.lg, borderWidth: 1, marginBottom: 12 },
  text: { flex: 1 },
  title: { fontSize: 13.5, lineHeight: 18, fontWeight: "700" },
  body: { fontSize: 13, lineHeight: 18 },
});
