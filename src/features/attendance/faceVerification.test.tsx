import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FaceVerification from "../../../app/team/face";

const row = {
  id: "fv-1",
  dateKey: "2026-11-10",
  status: "PENDING",
  inFaceStatus: "NOT_MATCHED",
  outFaceStatus: null,
  inDistance: 0.7,
  outDistance: null,
  threshold: 0.45,
  remark: null,
  decidedAt: null,
  originalCheckIn: "2026-11-10T03:45:00.000Z",
  originalCheckOut: null,
  manualMode: null,
  manualHours: null,
  employee: { id: "e1", fullName: "Asha Rao", employeeCode: "E1", shift: { name: "General", startTime: "09:30", endTime: "18:30" } },
  session: { id: "s1", checkInAt: "2026-11-10T03:45:00.000Z", checkOutAt: null, hasInSelfie: false, hasOutSelfie: false },
};

const mockList = jest.fn(async (_q: string) => ({ data: [row], meta: { page: 1, pageSize: 10, totalCount: 1, totalPages: 1 } }));
const mockApprove = jest.fn(async (_id: string, _remark: string | null) => ({ ok: true }));
const mockReject = jest.fn(async (_id: string, _input: unknown) => ({ ok: true }));

jest.mock("expo-router", () => ({ Redirect: () => null, router: { push: jest.fn(), back: jest.fn() } }));
jest.mock("@/auth/AuthProvider", () => ({ useAuth: () => ({ status: "signedIn", me: { permissions: { approvals: { faceVerification: true } } } }) }));
jest.mock("@/core/services", () => ({
  endpoints: {
    faceVerificationsPage: (q: string) => mockList(q),
    approveFace: (id: string, r: string | null) => mockApprove(id, r),
    rejectFace: (id: string, i: unknown) => mockReject(id, i),
  },
  getSession: () => ({ freshAccessToken: async () => "t" }),
}));
jest.mock("@/components/OfflineBanner", () => ({ OfflineBanner: () => null }));

function wrap(node: ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } } });
  const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };
  return (
    <SafeAreaProvider initialMetrics={metrics}>
      <QueryClientProvider client={qc}>{node}</QueryClientProvider>
    </SafeAreaProvider>
  );
}

jest.setTimeout(30_000);

describe("Face Verification approver screen (D-047)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("lists pending rows and approves without a remark", async () => {
    await render(wrap(<FaceVerification />));
    expect(await screen.findByText("Asha Rao")).toBeTruthy();
    expect(mockList.mock.calls[0][0]).toContain("status=PENDING");
    await fireEvent.press(screen.getByTestId("face-approve-fv-1"));
    await fireEvent.press(await screen.findByTestId("face-submit"));
    expect(mockApprove).toHaveBeenCalledWith("fv-1", null);
  });

  it("reject needs a remark, then sends hours from the shift start", async () => {
    await render(wrap(<FaceVerification />));
    await fireEvent.press(await screen.findByTestId("face-reject-fv-1"));
    await fireEvent.press(await screen.findByTestId("face-submit"));
    expect(await screen.findByText("A remark is required to reject.")).toBeTruthy();
    expect(mockReject).not.toHaveBeenCalled();
    await fireEvent.changeText(screen.getByTestId("face-remark"), "Not the employee");
    await fireEvent.press(screen.getByText("Hours from 09:30"));
    await fireEvent.changeText(screen.getByTestId("face-hours"), "6");
    await fireEvent.press(screen.getByTestId("face-submit"));
    expect(mockReject).toHaveBeenCalledWith("fv-1", { remark: "Not the employee", mode: "HOURS", hours: 6 });
  });
});
