import { defaultRange, monthRange, paginate, rangeQuery, sumBy } from "./summaries";

describe("attendance summaries helpers (D-045)", () => {
  it("defaults to the first of this IST month until today", () => {
    expect(defaultRange(new Date("2026-11-11T20:00:00Z"))).toEqual({ from: "2026-11-01", to: "2026-11-12" });
  });

  it("knows month lengths", () => {
    expect(monthRange("2026-02")).toEqual({ from: "2026-02-01", to: "2026-02-28" });
    expect(monthRange("2028-02")).toEqual({ from: "2028-02-01", to: "2028-02-29" });
    expect(monthRange("2026-12")).toEqual({ from: "2026-12-01", to: "2026-12-31" });
  });

  it("pages 10 / 20 / 30 and clamps the page", () => {
    const rows = Array.from({ length: 25 }, (_, i) => i);
    expect(paginate(rows, 1, 10)).toEqual({ rows: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], total: 25, totalPages: 3, page: 1 });
    expect(paginate(rows, 3, 10).rows).toEqual([20, 21, 22, 23, 24]);
    expect(paginate(rows, 9, 20)).toMatchObject({ page: 2, totalPages: 2 });
    expect(paginate(rows, 1, 30)).toMatchObject({ totalPages: 1, total: 25 });
    expect(paginate([], 1, 10)).toEqual({ rows: [], total: 0, totalPages: 1, page: 1 });
  });

  it("builds the query and skips empty values", () => {
    expect(rangeQuery({ from: "2026-11-01", to: "2026-11-30" }, { status: undefined, page: 2, pageSize: 20 })).toBe("from=2026-11-01&to=2026-11-30&page=2&pageSize=20");
  });

  it("sums hours", () => {
    expect(sumBy([{ h: 1.25 }, { h: null }, { h: 2.5 }], (r) => r.h)).toBe(3.75);
  });
});
