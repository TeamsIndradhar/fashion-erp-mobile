import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors, radius } from "../theme/tokens";
import { AppText } from "./AppText";
import { IconTile, type IconName, type IconTone } from "./Icon";

/** Centred state block (EmptyState / PermissionDeniedState family): big icon tile, title, text, actions. */
export function StateView({ icon, tone = "primary", title, text, children }: { icon: IconName; tone?: IconTone; title: string; text: string; children?: ReactNode }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.tile}>
        <IconTile name={icon} tone={tone} size={76} round={radius.xl} />
      </View>
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="caption" color={colors.textSecondary} style={styles.text}>
        {text}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 34, paddingHorizontal: 18 },
  tile: { alignItems: "center", marginBottom: 14 },
  title: { textAlign: "center", fontWeight: "700", marginBottom: 6 },
  text: { textAlign: "center", fontSize: 13.5, lineHeight: 19, marginBottom: 16 },
});
