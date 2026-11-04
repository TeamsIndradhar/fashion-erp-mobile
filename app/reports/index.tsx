import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { endpoints } from "@/core/services";
import { colors, spacing } from "@/theme/tokens";

/** ADM-005 Reports center: only categories this user may open (server-decided). */
export default function ReportsCenter() {
  const auth = useAuth();
  const enabled = auth.status === "signedIn";
  const cat = useQuery({ queryKey: ["reports", "catalog"], queryFn: endpoints.reportCatalog, enabled, staleTime: 10 * 60_000 });
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  if (!enabled) return <Redirect href="/" />;
  const s = search.trim().toLowerCase();
  const groups = (cat.data ?? [])
    .map((g) => ({ ...g, reports: s ? g.reports.filter((r) => r.title.toLowerCase().includes(s)) : g.reports }))
    .filter((g) => g.reports.length > 0);

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Reports
      </AppText>
      <TextField label="Search reports" value={search} onChangeText={setSearch} autoCapitalize="none" />
      {cat.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {cat.error ? <Banner tone="danger" message={(cat.error as Error).message} /> : null}
      {cat.data?.length === 0 ? <Banner tone="info" message="No reports are open to your role." /> : null}
      {groups.map((g) => (
        <Card key={g.category}>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: open === g.category || !!s }} onPress={() => setOpen(open === g.category ? null : g.category)}>
            <AppText variant="h3">
              {g.label} ({g.reports.length})
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {g.description}
            </AppText>
          </Pressable>
          {open === g.category || s
            ? g.reports.map((r) => (
                <ListRow
                  key={r.key}
                  label={r.title}
                  onPress={() => router.push({ pathname: "/reports/[category]/[key]", params: { category: g.category, key: r.key, title: r.title, canExport: g.canExport ? "1" : "0" } })}
                />
              ))
            : null}
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
});
