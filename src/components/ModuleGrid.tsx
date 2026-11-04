import { Pressable, StyleSheet, View } from "react-native";
import { colors, elevation } from "../theme/tokens";
import { AppText } from "./AppText";
import { IconTile, type IconName, type IconTone } from "./Icon";

export interface ModuleTile {
  key: string;
  label: string;
  icon: IconName;
  tone: IconTone;
  count?: number;
  onPress: () => void;
}

/** COMPONENTS.md `ModuleGrid`: 4-column tiles — icon tile, label (max 2 lines), optional red count. */
export function ModuleGrid({ tiles }: { tiles: ModuleTile[] }) {
  return (
    <View style={styles.grid}>
      {tiles.map((t) => (
        <View key={t.key} style={styles.cell}>
          <Pressable
            testID={`home-${t.key}`}
            accessibilityRole="button"
            accessibilityLabel={t.count ? `${t.label}, ${t.count}` : t.label}
            onPress={t.onPress}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
          >
            {t.count ? (
              <View style={styles.cnt}>
                <AppText variant="micro" color={colors.white} style={styles.cntText}>
                  {t.count > 99 ? "99+" : t.count}
                </AppText>
              </View>
            ) : null}
            <View style={styles.icon}>
              <IconTile name={t.icon} tone={t.tone} size={40} />
            </View>
            <AppText variant="micro" numberOfLines={2} style={styles.label}>
              {t.label}
            </AppText>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4, marginBottom: 8 },
  cell: { width: "25%", padding: 4 },
  tile: {
    minHeight: 84,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    ...elevation.card,
  },
  pressed: { backgroundColor: colors.primaryTint },
  icon: { marginBottom: 6 },
  label: { fontSize: 11.5, lineHeight: 14, fontWeight: "600", textAlign: "center", color: colors.text },
  cnt: { position: "absolute", top: 6, right: 8, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, backgroundColor: colors.danger, alignItems: "center", justifyContent: "center", zIndex: 1 },
  cntText: { fontSize: 9.5, lineHeight: 12 },
});
