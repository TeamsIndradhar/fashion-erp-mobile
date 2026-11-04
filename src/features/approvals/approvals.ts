import type { PurchaseOrderDetail } from "../../api/types";

// Same labels as the ERP's request-type registry (payment-requests/request-type-registry.ts).
export const PAYMENT_REQUEST_TYPE_LABEL: Record<string, string> = {
  SALARY: "Salary request",
  ADVANCE_REMINDER: "Advance payment",
  INVESTMENT: "Investment payment",
  TAX_INVOICE: "Tax invoice (non-supplier)",
  VOUCHER_SINGLE: "Expense voucher",
  VOUCHER_MULTIPLE: "Expense voucher (multiple)",
  SUPPLIER_ON_ACCOUNT: "Supplier payment on account",
  SUPPLIER_BILL: "Supplier bill",
  SUPPLIER_ADJUSTMENT: "Adjustment against payment on account",
  LOAN: "Loan payment",
  SALARY_ADVANCE: "Salary advance",
  IMPREST: "Imprest payment",
  FIXED_DEPOSIT: "Fixed deposit",
  CASH_WITHDRAWAL: "Cash payment",
  RECURRING_DEPOSIT: "Recurring deposit",
  BANK_TRANSFER: "Transfer between banks",
  CREDIT_CARD: "Credit card payment",
};

export const paymentRequestTypeLabel = (t: string) => PAYMENT_REQUEST_TYPE_LABEL[t] ?? t.replace(/_/g, " ").toLowerCase();

/** "Level 1 of 2" when the request has more than one approval level. */
export function approvalLevelText(current: number | null, required: number | null): string | null {
  if (!required || required <= 1 || !current) return null;
  return `Level ${current} of ${required}`;
}

/** PO lines carry no stored amount: unitPrice × orderedQuantity (the header total is their sum). */
export function poLineAmount(line: Pick<PurchaseOrderDetail["items"][number], "unitPrice" | "orderedQuantity">): number {
  return Math.round(Number(line.unitPrice) * Number(line.orderedQuantity) * 100) / 100;
}

export const MATERIAL_REQUEST_TYPE_LABEL: Record<string, string> = {
  DAMAGE_REPLACEMENT: "Damage / extra material",
  PRODUCTION_REQUIREMENT: "Production requirement",
  SAMPLING_REQUIREMENT: "Sampling requirement",
};
