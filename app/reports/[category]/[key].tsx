import { useQuery } from "@tanstack/react-query";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { PickerField } from "@/components/PickerField";
import { Screen } from "@/components/Screen";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { formatCell, groupBySection, MAX_MOBILE_ROWS, rowToCard } from "@/features/reports/reports";
import { formatDateTime } from "@/lib/dates";
import { openAuthedFile } from "@/lib/download";
import { colors, spacing } from "@/theme/tokens";

/** ADM-006 Report viewer: same descriptor as the web report, rows as cards, optional date range and export. */
export default function ReportViewer() {
  const p = useLocalSearchParams<{ category: string; key: string; title?: string; canExport?: string; filters?: string }>();
  const auth = useAuth();
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  // Fixed filters from the screen that opened the report (e.g. the stock ledger of one item).
  const filters: Record<string, string> = parseFixedFilters(p.filters);
  if (from) filters.dateFrom = from;
  if (to) filters.dateTo = to;
  const enabled = auth.status === "signedIn" && !!p.category && !!p.key;
  const r = useQuery({ queryKey: ["reports", p.category, p.key, p.filters ?? "", from, to], queryFn: () => endpoints.report(p.category!, p.key!, filters), enabled });
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const d = r.data?.descriptor;
  const sectioned = !!d && d.columns.some((c) => c.key === "section") && d.columns.some((c) => c.key === "metric");

  async function exportAs(format: "xlsx" | "pdf") {
    setExporting(true);
    try {
      await openAuthedFile(endpoints.reportExportPath(p.category!, p.key!, format, filters), `${p.key}.${format}`, format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    } catch (e) {
      Alert.alert("Export", e instanceof ApiError ? e.message : strings.errors.generic);
    } finally {
      setExporting(false);
    }
  }

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        {d?.title ?? p.title ?? "Report"}
      </AppText>
      {d?.subtitle ? (
        <AppText color={colors.textSecondary} style={styles.sub}>
          {d.subtitle}
        </AppText>
      ) : null}
      <View style={styles.pair}>
        <View style={styles.cell}>
          <PickerField label="From (optional)" mode="date" value={from} onChange={setFrom} maximumDate={new Date()} />
        </View>
        <View style={styles.cell}>
          <PickerField label="To (optional)" mode="date" value={to} onChange={setTo} maximumDate={new Date()} />
        </View>
      </View>
      {from || to ? <Button kind="ghost" title="Clear dates" onPress={() => { setFrom(null); setTo(null); }} /> : null}
      {r.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {r.error ? <Banner tone="danger" message={(r.error as Error).message} /> : null}
      {d?.unavailableReason ? <Banner tone="info" message={d.unavailableReason} /> : null}
      {d?.filtersApplied.length ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.sub}>
          {d.filtersApplied.map((f) => `${f.label}: ${f.value}`).join(" · ")}
        </AppText>
      ) : null}

      {d && sectioned
        ? groupBySection(d).map((s) => (
            <Card key={s.section}>
              <AppText variant="h3" style={styles.sub}>
                {s.section}
              </AppText>
              {s.items.map((m) => (
                <ListRow key={m.metric} label={m.metric} value={m.value} />
              ))}
            </Card>
          ))
        : null}

      {d && !sectioned ? (
        <>
          {d.totals ? (
            <Card>
              <AppText variant="bodyStrong" style={styles.sub}>
                Totals
              </AppText>
              {d.columns
                .filter((c) => d.totals![c.key] !== undefined)
                .map((c) => (
                  <ListRow key={c.key} label={c.label} value={formatCell(d.totals![c.key], c.type)} />
                ))}
            </Card>
          ) : null}
          {d.rows.length === 0 && !d.unavailableReason ? <AppText color={colors.textSecondary}>No rows for these filters.</AppText> : null}
          {d.rows.slice(0, MAX_MOBILE_ROWS).map((row, i) => {
            const card = rowToCard(row, d.columns);
            return (
              <Card key={i}>
                <AppText variant="bodyStrong">{card.title}</AppText>
                {card.fields.map((f) => (
                  <View key={f.label} style={styles.field}>
                    <AppText variant="caption" color={colors.textSecondary} style={styles.flex}>
                      {f.label}
                    </AppText>
                    <AppText variant="caption">{f.value}</AppText>
                  </View>
                ))}
              </Card>
            );
          })}
          {d.rows.length > MAX_MOBILE_ROWS ? (
            <Banner tone="info" message={`Showing ${MAX_MOBILE_ROWS} of ${d.rows.length} rows. Export or use the website for the full report.`} />
          ) : null}
        </>
      ) : null}

      {d ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.sub}>
          Generated {formatDateTime(d.generatedAt)}
        </AppText>
      ) : null}
      {d && p.canExport === "1" ? (
        <View style={styles.pair}>
          <View style={styles.cell}>
            <Button kind="secondary" title="Excel" loading={exporting} onPress={() => void exportAs("xlsx")} />
          </View>
          <View style={styles.cell}>
            <Button kind="secondary" title="PDF" loading={exporting} onPress={() => void exportAs("pdf")} />
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.xs },
  sub: { marginBottom: spacing.sm },
  pair: { flexDirection: "row", marginHorizontal: -spacing.xs },
  cell: { flex: 1, paddingHorizontal: spacing.xs },
  field: { flexDirection: "row", marginTop: spacing.xs },
  flex: { flex: 1, marginRight: spacing.sm },
});

function parseFixedFilters(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(v).filter(([, x]) => typeof x === "string")) as Record<string, string>;
  } catch {
    return {};
  }
}
