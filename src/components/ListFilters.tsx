import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { defaultRange, PAGE_SIZES, type PageSize, type RangeFilter } from "../features/attendance/summaries";
import { colors, spacing } from "../theme/tokens";
import { AppText } from "./AppText";
import { Card } from "./Card";
import { Chips } from "./Chips";
import { PickerField } from "./PickerField";

/** D-045 list state: date range, optional status, page size 10/20/30 and page. Any filter change goes back to page 1. */
export function useListFilters(init: { from?: string; to?: string; status?: string } = {}) {
  const d = defaultRange();
  const [range, setRangeState] = useState<RangeFilter>({ from: init.from ?? d.from, to: init.to ?? d.to });
  const [status, setStatusState] = useState<string>(init.status ?? "ALL");
  const [pageSize, setPageSizeState] = useState<PageSize>(10);
  const [page, setPage] = useState(1);
  return {
    range,
    status,
    pageSize,
    page,
    setPage,
    setRange: (r: RangeFilter) => {
      setRangeState(r);
      setPage(1);
    },
    setStatus: (s: string) => {
      setStatusState(s);
      setPage(1);
    },
    setPageSize: (n: PageSize) => {
      setPageSizeState(n);
      setPage(1);
    },
  };
}
export type ListFilterState = ReturnType<typeof useListFilters>;

export function ListFilters({ f, statuses, testID }: { f: ListFilterState; statuses?: { value: string; label: string }[]; testID?: string }) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.half}>
          <PickerField
            label="From"
            mode="date"
            value={f.range.from}
            maximumDate={new Date(`${f.range.to}T00:00:00`)}
            onChange={(v) => f.setRange({ from: v, to: f.range.to < v ? v : f.range.to })}
            testID={testID ? `${testID}-from` : undefined}
          />
        </View>
        <View style={styles.half}>
          <PickerField
            label="To"
            mode="date"
            value={f.range.to}
            minimumDate={new Date(`${f.range.from}T00:00:00`)}
            onChange={(v) => f.setRange({ from: f.range.from > v ? v : f.range.from, to: v })}
            testID={testID ? `${testID}-to` : undefined}
          />
        </View>
      </View>
      {statuses ? <Chips options={statuses} value={f.status} onChange={f.setStatus} testID={testID ? `${testID}-status` : undefined} /> : null}
      <View style={styles.sizeRow}>
        <AppText variant="caption" color={colors.textSecondary} style={styles.sizeLabel}>
          Rows per page
        </AppText>
        <Chips options={PAGE_SIZES.map((n) => ({ value: String(n), label: String(n) }))} value={String(f.pageSize)} onChange={(v) => f.setPageSize(Number(v) as PageSize)} testID={testID ? `${testID}-size` : undefined} />
      </View>
    </Card>
  );
}

/** Previous / next with "Page x of y · n records". */
export function Pager({ page, totalPages, total, onPage, testID = "pager" }: { page: number; totalPages: number; total: number; onPage: (p: number) => void; testID?: string }) {
  if (total === 0) return null;
  const prev = page > 1;
  const next = page < totalPages;
  return (
    <View style={styles.pager}>
      <Pressable accessibilityRole="button" disabled={!prev} onPress={() => onPage(page - 1)} style={[styles.pageBtn, !prev && styles.dim]} testID={`${testID}-prev`}>
        <AppText variant="bodyStrong" color={colors.primary}>
          ‹ Prev
        </AppText>
      </Pressable>
      <AppText variant="caption" color={colors.textSecondary} testID={`${testID}-info`}>
        Page {page} of {totalPages} · {total} records
      </AppText>
      <Pressable accessibilityRole="button" disabled={!next} onPress={() => onPage(page + 1)} style={[styles.pageBtn, !next && styles.dim]} testID={`${testID}-next`}>
        <AppText variant="bodyStrong" color={colors.primary}>
          Next ›
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  row: { flexDirection: "row", gap: spacing.sm },
  half: { flex: 1 },
  sizeRow: { marginTop: spacing.sm },
  sizeLabel: { marginBottom: spacing.xs },
  pager: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: spacing.md },
  pageBtn: { minHeight: 44, justifyContent: "center", paddingHorizontal: spacing.sm },
  dim: { opacity: 0.35 },
});
