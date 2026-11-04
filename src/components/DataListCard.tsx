import { Pressable, StyleSheet, View } from "react-native";
import { colors, elevation } from "../theme/tokens";
import { AppText } from "./AppText";
import { Icon, IconTile, type IconName, type IconTone } from "./Icon";

/** One record / action per card (COMPONENTS.md `DataListCard`): icon tile, title, sub-text, chevron. */
export function DataListCard({
  icon,
  tone = "primary",
  title,
  sub,
  onPress,
  testID,
}: {
  icon: IconName;
  tone?: IconTone;
  title: string;
  sub?: string;
  onPress?: () => void;
  testID?: string;
}) {
  const body = (
    <>
      <IconTile name={icon} tone={tone} size={38} round={11} />
      <View style={styles.main}>
        <AppText variant="bodyStrong" numberOfLines={1} style={styles.title}>
          {title}
        </AppText>
        {sub ? (
          <AppText variant="caption" color={colors.textSecondary} style={styles.sub}>
            {sub}
          </AppText>
        ) : null}
      </View>
      {onPress ? <Icon name="chev" tone="muted" size={18} /> : null}
    </>
  );
  if (!onPress) return <View style={styles.card}>{body}</View>;
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    ...elevation.card,
  },
  pressed: { backgroundColor: colors.primaryTint },
  main: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, lineHeight: 19, fontWeight: "700" },
  sub: { fontSize: 12, lineHeight: 16 },
});
