import { approvalLevelText, paymentRequestTypeLabel, poLineAmount } from "./approvals";

describe("approvals helpers", () => {
  it("labels payment request types like the ERP, with a fallback", () => {
    expect(paymentRequestTypeLabel("SUPPLIER_BILL")).toBe("Supplier bill");
    expect(paymentRequestTypeLabel("SOMETHING_NEW")).toBe("something new");
  });

  it("shows the approval level only for multi-level requests", () => {
    expect(approvalLevelText(1, 2)).toBe("Level 1 of 2");
    expect(approvalLevelText(1, 1)).toBeNull();
    expect(approvalLevelText(null, 3)).toBeNull();
  });

  it("computes PO line amounts from decimal strings", () => {
    expect(poLineAmount({ unitPrice: "125.5000", orderedQuantity: "12.0000" })).toBe(1506);
    expect(poLineAmount({ unitPrice: "0.3333", orderedQuantity: "3" })).toBe(1);
  });
});
