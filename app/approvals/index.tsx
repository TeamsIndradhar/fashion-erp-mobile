import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "@/api/errors";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chips } from "@/components/Chips";
import { ListRow } from "@/components/ListRow";
import { OfflineBanner } from "@/components/OfflineBanner";
import { TextField } from "@/components/TextField";
import { strings } from "@/config/strings";
import { endpoints } from "@/core/services";
import { approvalLevelText, MATERIAL_REQUEST_TYPE_LABEL, paymentRequestTypeLabel, poLineAmount } from "@/features/approvals/approvals";
import { formatMoney } from "@/features/requests/requests";
import { pieces } from "@/features/work/work";
import { formatDateKey, formatDateTime } from "@/lib/dates";
import { openAuthedFile } from "@/lib/download";
import { colors, layout, spacing } from "@/theme/tokens";

type Tab = "pay" | "po" | "mr";

/** ACC-002 payment request approvals · PUR-002/003 purchase order approval · INV-004 material request approval. */
export default function ApprovalsInbox() {
  const auth = useAuth();
  const ap = auth.me?.permissions.approvals;
  const tabs = (
    [
      ["pay", "Payment requests", ap?.paymentRequest],
      ["po", "Purchase orders", ap?.purchaseOrder],
      ["mr", "Material requests", ap?.materialRequest],
    ] as const
  )
    .filter(([, , ok]) => ok)
    .map(([value, label]) => ({ value: value as Tab, label }));
  const [tab, setTab] = useState<Tab | null>(null);
  const active = tab ?? tabs[0]?.value ?? null;
  if (auth.status !== "signedIn") return <Redirect href="/" />;
  const myUserId = auth.me?.user.id ?? "";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="h2" style={styles.title}>
          Approvals
        </AppText>
        {tabs.length === 0 ? <Banner tone="info" message="You don't approve payments, purchase orders or material requests." /> : <Chips options={tabs} value={active} onChange={setTab} />}
        {active === "pay" ? <PaymentRequests /> : null}
        {active === "po" ? <PurchaseOrders myUserId={myUserId} /> : null}
        {active === "mr" ? <MaterialRequests myUserId={myUserId} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function errText(e: unknown) {
  return e instanceof ApiError ? e.message : strings.errors.generic;
}

function ListState({ q, empty }: { q: { isPending: boolean; error: unknown; data?: unknown[] }; empty: string }) {
  if (q.isPending) return <ActivityIndicator color={colors.primary} />;
  if (q.error) return <Banner tone="danger" message={errText(q.error)} />;
  if (q.data?.length === 0) return <AppText color={colors.textSecondary}>{empty}</AppText>;
  return null;
}

// ---- Payment requests (the inbox already hides your own and other levels' requests) ----

function PaymentRequests() {
  const q = useQuery({ queryKey: ["approvals", "pay"], queryFn: endpoints.paymentRequestsToApprove });
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <ListState q={q} empty="No payment requests waiting for you." />
      {q.data?.map((r) => (
        <Card key={r.id}>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: open === r.id }} onPress={() => setOpen(open === r.id ? null : r.id)}>
            <View style={styles.row}>
              <AppText variant="bodyStrong" style={styles.flex}>
                {formatMoney(r.amount)} · {r.payToName ?? r.supplier?.name ?? r.employee?.fullName ?? ""}
              </AppText>
              {r.isOverdue ? (
                <AppText variant="micro" color={colors.danger}>
                  OVERDUE
                </AppText>
              ) : null}
            </View>
            <AppText variant="caption" color={colors.textSecondary}>
              {r.requestNumber} · {paymentRequestTypeLabel(r.requestType)} · by {r.createdBy?.fullName ?? "—"}
              {r.paymentDueDate ? ` · pay by ${formatDateKey(r.paymentDueDate.slice(0, 10))}` : ""}
            </AppText>
            {approvalLevelText(r.currentApprovalLevel, r.requiredApprovalLevels) ? (
              <AppText variant="caption" color={colors.textSecondary}>
                {approvalLevelText(r.currentApprovalLevel, r.requiredApprovalLevels)}
              </AppText>
            ) : null}
          </Pressable>
          {open === r.id ? <PaymentRequestDecision id={r.id} /> : null}
        </Card>
      ))}
    </>
  );
}

function PaymentRequestDecision({ id }: { id: string }) {
  const qc = useQueryClient();
  const d = useQuery({ queryKey: ["approvals", "pay", id], queryFn: () => endpoints.paymentRequestForReview(id) });
  const files = useQuery({ queryKey: ["approvals", "pay", id, "files"], queryFn: () => endpoints.expenseFiles(id) });
  const [remark, setRemark] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const done = () => void qc.invalidateQueries({ queryKey: ["approvals", "pay"] });
  const approve = useMutation({ mutationFn: () => endpoints.approvePaymentRequest(id, remark.trim()), onSuccess: done });
  const reject = useMutation({ mutationFn: () => endpoints.rejectPaymentRequest(id, remark.trim()), onSuccess: done });
  const r = d.data;
  return (
    <View style={styles.detail}>
      {d.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {r?.typeDataJson?.purposeName ? <ListRow label="For" value={r.typeDataJson.purposeName} /> : null}
      {r?.remark ? <AppText style={styles.gapSm}>{r.remark}</AppText> : null}
      {r?.approvals?.map((a) => (
        <AppText key={`${a.level}-${a.decidedAt}`} variant="caption" color={colors.textSecondary}>
          Level {a.level}: {a.decision.toLowerCase()} by {a.user.fullName} · {formatDateTime(a.decidedAt)}
          {a.remark ? ` — ${a.remark}` : ""}
        </AppText>
      ))}
      {files.data?.map((f) => (
        <ListRow
          key={f.id}
          label={f.mimeType.startsWith("audio/") ? `🎤 ${f.fileName}` : f.fileName}
          onPress={() =>
            void openAuthedFile(`/api/v1/record-attachments/file/${encodeURIComponent(f.id)}?disposition=inline`, f.fileName, f.mimeType).catch((e) => Alert.alert(f.fileName, errText(e)))
          }
        />
      ))}
      {files.data?.length === 0 ? (
        <AppText variant="caption" color={colors.textSecondary}>
          No bills or files attached.
        </AppText>
      ) : null}
      <TextField label={rejecting ? "Why is it rejected? (required)" : "Remark (optional)"} value={remark} onChangeText={setRemark} maxLength={1000} />
      {approve.error || reject.error ? <Banner tone="danger" message={errText(approve.error ?? reject.error)} /> : null}
      <View style={styles.pair}>
        <View style={styles.cell}>
          <Button title="Approve" onPress={() => approve.mutate()} loading={approve.isPending} disabled={reject.isPending || rejecting} testID={`pr-approve-${id}`} />
        </View>
        <View style={styles.cell}>
          <Button
            kind="danger"
            title="Reject"
            onPress={() => (rejecting && remark.trim() ? reject.mutate() : setRejecting(true))}
            loading={reject.isPending}
            disabled={approve.isPending || (rejecting && !remark.trim())}
          />
        </View>
      </View>
    </View>
  );
}

// ---- Purchase orders (DRAFT = waiting for approval; there is no reject — hold/cancel stays on the web) ----

function PurchaseOrders({ myUserId }: { myUserId: string }) {
  const q = useQuery({ queryKey: ["approvals", "po"], queryFn: endpoints.purchaseOrdersToApprove });
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <ListState q={q} empty="No purchase orders waiting for approval." />
      {q.data?.map((o) => (
        <Card key={o.id}>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: open === o.id }} onPress={() => setOpen(open === o.id ? null : o.id)}>
            <AppText variant="bodyStrong">
              {o.orderNumber} · {formatMoney(o.totalAmount)}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {o.supplier?.name ?? "—"} · by {o.requestedBy?.fullName ?? "—"} · {formatDateKey(o.orderDate.slice(0, 10))}
            </AppText>
          </Pressable>
          {open === o.id ? <PurchaseOrderDecision id={o.id} own={o.requestedByUserId === myUserId} /> : null}
        </Card>
      ))}
    </>
  );
}

function PurchaseOrderDecision({ id, own }: { id: string; own: boolean }) {
  const qc = useQueryClient();
  const d = useQuery({ queryKey: ["approvals", "po", id], queryFn: () => endpoints.purchaseOrder(id) });
  const approve = useMutation({ mutationFn: () => endpoints.approvePurchaseOrder(id), onSuccess: () => void qc.invalidateQueries({ queryKey: ["approvals", "po"] }) });
  return (
    <View style={styles.detail}>
      {d.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {d.error ? <Banner tone="danger" message={errText(d.error)} /> : null}
      {d.data?.items.map((l) => (
        <ListRow
          key={l.id}
          label={[l.product?.styleName, l.color?.name].filter(Boolean).join(" · ")}
          value={`${pieces(l.orderedQuantity)} ${l.uom?.code ?? ""} × ${formatMoney(l.unitPrice)} = ${formatMoney(poLineAmount(l))}`}
        />
      ))}
      {d.data?.expectedDeliveryDate ? (
        <AppText variant="caption" color={colors.textSecondary}>
          Delivery by {formatDateKey(d.data.expectedDeliveryDate.slice(0, 10))}
        </AppText>
      ) : null}
      {approve.error ? <Banner tone="danger" message={errText(approve.error)} /> : null}
      {own ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.gapSm}>
          You raised this order — someone else must approve it.
        </AppText>
      ) : (
        <View style={styles.gapTop}>
          <Button
            title="Approve purchase order"
            loading={approve.isPending}
            onPress={() =>
              Alert.alert("Approve this purchase order?", d.data ? `${d.data.orderNumber} · ${formatMoney(d.data.totalAmount)}` : "", [
                { text: strings.common.cancel, style: "cancel" },
                { text: "Approve", onPress: () => approve.mutate() },
              ])
            }
          />
          <AppText variant="caption" color={colors.textSecondary} style={styles.gapSm}>
            To hold or cancel an order, use the website.
          </AppText>
        </View>
      )}
    </View>
  );
}

// ---- Material requests (only damage / extra material requests need approval) ----

function MaterialRequests({ myUserId }: { myUserId: string }) {
  const q = useQuery({ queryKey: ["approvals", "mr"], queryFn: endpoints.materialRequestsToApprove });
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <ListState q={q} empty="No material requests waiting for approval." />
      {q.data?.map((m) => (
        <Card key={m.id}>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: open === m.id }} onPress={() => setOpen(open === m.id ? null : m.id)}>
            <AppText variant="bodyStrong">
              {m.requestNumber} · {MATERIAL_REQUEST_TYPE_LABEL[m.requestType] ?? m.requestType}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              by {m.requestedBy?.fullName ?? "—"}
              {m.requiredDate ? ` · needed ${formatDateKey(m.requiredDate.slice(0, 10))}` : ""}
              {m.warehouse ? ` · ${m.warehouse.name}` : ""}
            </AppText>
          </Pressable>
          {open === m.id ? <MaterialRequestDecision id={m.id} own={m.requestedByUserId === myUserId} /> : null}
        </Card>
      ))}
    </>
  );
}

function MaterialRequestDecision({ id, own }: { id: string; own: boolean }) {
  const qc = useQueryClient();
  const d = useQuery({ queryKey: ["approvals", "mr", id], queryFn: () => endpoints.materialRequest(id) });
  const [remark, setRemark] = useState("");
  const decide = useMutation({
    mutationFn: (decision: "approve" | "reject") => endpoints.decideMaterialRequest(id, decision, remark.trim()),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["approvals", "mr"] }),
  });
  const m = d.data;
  return (
    <View style={styles.detail}>
      {d.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {d.error ? <Banner tone="danger" message={errText(d.error)} /> : null}
      {m?.originalMaterialRequest ? <ListRow label="Replaces material from" value={m.originalMaterialRequest.requestNumber} /> : null}
      {m?.purpose ? <AppText style={styles.gapSm}>{m.purpose}</AppText> : null}
      {m?.lines.map((l) => (
        <View key={l.id} style={styles.gapSm}>
          <ListRow label={[l.material?.styleName, l.color?.name].filter(Boolean).join(" · ")} value={`${Number(l.requestedQuantity)} ${l.uom?.code ?? ""}`} />
          {l.damageReason ? (
            <AppText variant="caption" color={colors.textSecondary}>
              Damage: {l.damageReason}
            </AppText>
          ) : null}
          {l.availableStockQuantity !== undefined ? (
            <AppText variant="caption" color={colors.textSecondary}>
              In stock: {l.availableStockQuantity} {l.uom?.code ?? ""}
            </AppText>
          ) : null}
        </View>
      ))}
      {decide.error ? <Banner tone="danger" message={errText(decide.error)} /> : null}
      {own ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.gapSm}>
          You raised this request — someone else must decide it.
        </AppText>
      ) : (
        <>
          <TextField label="Remark (optional)" value={remark} onChangeText={setRemark} maxLength={1000} />
          <View style={styles.pair}>
            <View style={styles.cell}>
              <Button title="Approve" onPress={() => decide.mutate("approve")} loading={decide.isPending && decide.variables === "approve"} disabled={decide.isPending} />
            </View>
            <View style={styles.cell}>
              <Button kind="danger" title="Reject" onPress={() => decide.mutate("reject")} loading={decide.isPending && decide.variables === "reject"} disabled={decide.isPending} />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: layout.gutter },
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  row: { flexDirection: "row", alignItems: "center" },
  flex: { flex: 1 },
  detail: { marginTop: spacing.md },
  pair: { flexDirection: "row", marginHorizontal: -spacing.xs, marginTop: spacing.sm },
  cell: { flex: 1, paddingHorizontal: spacing.xs },
  gapSm: { marginTop: spacing.sm },
  gapTop: { marginTop: spacing.md },
});
