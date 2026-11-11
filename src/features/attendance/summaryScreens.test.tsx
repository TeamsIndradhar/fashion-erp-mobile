import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Outdoor from "../../../app/attendance/outdoor";
import Regularizations from "../../../app/attendance/regularizations";

const mockOutdoor = Array.from({ length: 23 }, (_, i) => ({
  id: `o${i}`,
  sessionId: `s${i}`,
  originalCheckIn: "2026-11-03T03:45:00.000Z",
  originalCheckOut: "2026-11-03T12:45:00.000Z",
  trimmedCheckIn: "2026-11-03T04:30:00.000Z",
  trimmedCheckOut: "2026-11-03T12:00:00.000Z",
  rejectedReason: `Outside office #${i}`,
  status: i === 0 ? "PENDING" : "APPROVED",
  clarificationReason: null,
  clarifiedAt: null,
  hasProof: false,
  session: { id: `s${i}`, attendanceRecord: { attendanceDate: "2026-11-03T00:00:00.000Z" } },
}));

const mockMyOutdoor = jest.fn(async (_q: string) => mockOutdoor);
const mockCorrections = jest.fn(async (_q: string) => ({
  data: [{ id: "c1", type: "MISSED_PUNCH", attendanceDate: "2026-11-04T00:00:00.000Z", requestedPunchIn: null, requestedPunchOut: null, reason: "Forgot", status: "PENDING", rejectionReason: null, createdAt: "2026-11-04T10:00:00.000Z" }],
  meta: { page: 1, pageSize: 10, totalCount: 31, totalPages: 4 },
}));

jest.mock("expo-router", () => ({
  Redirect: () => null,
  router: { push: jest.fn(), back: jest.fn() },
  useLocalSearchParams: () => ({}),
}));
jest.mock("@/auth/AuthProvider", () => ({ useAuth: () => ({ status: "signedIn", me: { viewableModules: ["hrms_attendance_regularization"] } }) }));
jest.mock("@/core/services", () => ({
  endpoints: {
    myOutdoorRejections: (q: string) => mockMyOutdoor(q),
    myCorrectionsPage: (q: string) => mockCorrections(q),
  },
}));
jest.mock("@/components/OfflineBanner", () => ({ OfflineBanner: () => null }));

function wrap(node: ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };
  return (
    <SafeAreaProvider initialMetrics={metrics}>
      <QueryClientProvider client={qc}>{node}</QueryClientProvider>
    </SafeAreaProvider>
  );
}

jest.setTimeout(30_000);

describe("attendance summaries (D-045)", () => {
  it("rejected outdoor: 10 per page by default, then 20, with paging", async () => {
    await render(wrap(<Outdoor />));
    expect(await screen.findByText("Page 1 of 3 · 23 records")).toBeTruthy();
    expect(screen.getByText("23 outside punches trimmed · 1 waiting for you")).toBeTruthy();
    expect(screen.getByText("Outside office #9")).toBeTruthy();
    expect(screen.queryByText("Outside office #10")).toBeNull();
    await fireEvent.press(screen.getByTestId("outdoor-pager-next"));
    expect(screen.getByText("Outside office #10")).toBeTruthy();
    await fireEvent.press(screen.getByText("20"));
    expect(screen.getByText("Page 1 of 2 · 23 records")).toBeTruthy();
    expect(mockMyOutdoor.mock.calls[0][0]).toMatch(/^from=\d{4}-\d{2}-01&to=\d{4}-\d{2}-\d{2}$/);
  });

  it("regularization: server paging sends page and page size", async () => {
    await render(wrap(<Regularizations />));
    expect(await screen.findByText("Page 1 of 4 · 31 records")).toBeTruthy();
    expect(mockCorrections.mock.calls[0][0]).toContain("page=1&pageSize=10");
    await fireEvent.press(screen.getByText("30"));
    expect(mockCorrections.mock.calls.at(-1)?.[0]).toContain("pageSize=30");
  });
});
