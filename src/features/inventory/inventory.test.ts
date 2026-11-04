import { describeScan, fmtQty, qty, receiveReady } from "./inventory";

describe("inventory helpers", () => {
  it("reads string and number quantities", () => {
    expect(qty("12.5000")).toBe(12.5);
    expect(qty(3)).toBe(3);
    expect(qty(null)).toBe(0);
    expect(fmtQty("1500.0000", "MTR")).toBe("1,500 MTR");
  });

  it("describes a fabric roll and links to its material", () => {
    const d = describeScan({
      entityType: "FABRIC_ROLL",
      entityId: "roll-1",
      code: "R-001",
      summary: { kind: "FABRIC_ROLL", rollNumber: "R-001", rollQuantity: 100, remainingQuantity: 42.5, status: "IN_STOCK", materialId: "m-1", materialName: "Denim 12oz", materialCode: "FAB-01" },
    });
    expect(d.title).toBe("Fabric roll R-001");
    expect(d.lines).toContain("Left 42.5 of 100");
    expect(d.link).toEqual({ pathname: "/inventory/item/[id]", params: { id: "m-1" } });
  });

  it("links SKUs to the style and lots to the lot screen; cartons have no link", () => {
    expect(describeScan({ entityType: "SKU", entityId: "v1", code: "SKU1", summary: { kind: "SKU", productId: "p1", styleName: "Polo", colorName: "Red", sizeName: "M" } })).toMatchObject({
      title: "Polo · Red · M",
      link: { pathname: "/inventory/style/[id]", params: { id: "p1" } },
    });
    expect(describeScan({ entityType: "PRODUCTION_LOT", entityId: "lot1", code: "L1", summary: { kind: "PRODUCTION_LOT", lotNumber: "L1" } }).link).toEqual({ pathname: "/work/lot/[id]", params: { id: "lot1" } });
    expect(describeScan({ entityType: "CARTON", entityId: "c1", code: "C1", summary: { kind: "CARTON", cartonNumber: "C1" } }).link).toBeNull();
  });

  it("needs a location for every line before receiving", () => {
    expect(receiveReady(["a", "b"], { a: "loc1" })).toBe(false);
    expect(receiveReady(["a", "b"], { a: "loc1", b: "loc2" })).toBe(true);
    expect(receiveReady([], {})).toBe(false);
  });
});
