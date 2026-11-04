import type { ResolvedBarcode } from "../../api/types";

/** Quantities: service routes send numbers, raw Prisma rows send "12.5000". */
export const qty = (v: string | number | null | undefined) => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? Math.round(n * 1000) / 1000 : 0;
};

export const fmtQty = (v: string | number | null | undefined, unit?: string | null) => `${qty(v).toLocaleString("en-IN")}${unit ? ` ${unit}` : ""}`;

export type ScanLink =
  | { pathname: "/inventory/item/[id]"; params: { id: string } }
  | { pathname: "/inventory/style/[id]"; params: { id: string } }
  | { pathname: "/work/lot/[id]"; params: { id: string } };

/** What a scanned code is, in words, and where the app can open it (INV-007). */
export function describeScan(r: ResolvedBarcode): { title: string; lines: string[]; link: ScanLink | null } {
  const s = r.summary as Record<string, string | number | null | undefined>;
  const v = (k: string) => (s[k] === null || s[k] === undefined || s[k] === "" ? null : String(s[k]));
  const join = (...xs: (string | null)[]) => xs.filter(Boolean).join(" · ");
  switch (r.entityType) {
    case "FABRIC_ROLL":
      return {
        title: `Fabric roll ${v("rollNumber") ?? r.code}`,
        lines: [join(v("materialName"), v("materialCode")), `Left ${fmtQty(v("remainingQuantity"))} of ${fmtQty(v("rollQuantity"))}`, join(v("status"))],
        link: v("materialId") ? { pathname: "/inventory/item/[id]", params: { id: v("materialId")! } } : null,
      };
    case "ITEM":
      return { title: v("styleName") ?? r.code, lines: [join("Material", v("styleCode"), v("materialCategory"))], link: { pathname: "/inventory/item/[id]", params: { id: r.entityId } } };
    case "SKU":
      return {
        title: join(v("styleName"), v("colorName"), v("sizeName")) || r.code,
        lines: [join("SKU", v("skuCode"))],
        link: v("productId") ? { pathname: "/inventory/style/[id]", params: { id: v("productId")! } } : null,
      };
    case "PRODUCTION_LOT":
      return { title: `Lot ${v("lotNumber") ?? r.code}`, lines: [join(v("styleName"), v("productionOrderNumber")), join(`${fmtQty(v("quantity"))} pcs`, v("status"))], link: { pathname: "/work/lot/[id]", params: { id: r.entityId } } };
    case "CARTON":
      return { title: `Carton ${v("cartonNumber") ?? r.code}`, lines: [join(`${fmtQty(v("totalQuantity"))} pcs`, v("dispatchNumber"), v("dispatchStatus"))], link: null };
    case "PRODUCT_UNIT":
      return {
        title: join(v("styleName"), v("colorName"), v("sizeName")) || r.code,
        lines: [join("Piece", v("unitCode"), v("status")), join(v("lotNumber") && `Lot ${v("lotNumber")}`, v("salesOrderNumber"), v("customerName")), join(v("cartonNumber") && `Carton ${v("cartonNumber")}`, v("dispatchNumber"))],
        link: null,
      };
    default:
      return { title: r.code, lines: [r.entityType], link: null };
  }
}

/** Receive needs a destination location for every line (server rule). */
export function receiveReady(itemIds: string[], chosen: Record<string, string | undefined>): boolean {
  return itemIds.length > 0 && itemIds.every((id) => !!chosen[id]);
}
