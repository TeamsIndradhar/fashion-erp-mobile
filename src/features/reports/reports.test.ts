import { formatCell, groupBySection, rowToCard } from "./reports";

describe("report helpers", () => {
  it("groups overview rows by section in server order", () => {
    const g = groupBySection({
      rows: [
        { section: "Sales", metric: "Today", value: "₹1" },
        { section: "Production", metric: "Planned", value: "10" },
        { section: "Sales", metric: "Month", value: "₹9" },
      ],
    });
    expect(g.map((x) => x.section)).toEqual(["Sales", "Production"]);
    expect(g[0].items).toEqual([
      { metric: "Today", value: "₹1" },
      { metric: "Month", value: "₹9" },
    ]);
  });

  it("formats cells by column type and passes server-formatted strings through", () => {
    expect(formatCell(123456.5, "currency")).toBe("₹1,23,456.50");
    expect(formatCell("₹12.00", "currency")).toBe("₹12.00");
    expect(formatCell(12.345, "percent")).toBe("12.35%");
    expect(formatCell("2026-11-03T00:00:00.000Z", "date")).toBe("Tue, 3 Nov");
    expect(formatCell(null, "number")).toBe("—");
    expect(formatCell(1500, "number")).toBe("1,500");
  });

  it("turns a row into a title + fields card", () => {
    const card = rowToCard({ orderNumber: "SO-1", total: 2500, status: "OPEN" }, [
      { key: "orderNumber", label: "Order" },
      { key: "total", label: "Total", type: "currency" },
      { key: "status", label: "Status" },
    ]);
    expect(card).toEqual({ title: "SO-1", fields: [{ label: "Total", value: "₹2,500.00" }, { label: "Status", value: "OPEN" }] });
  });
});
