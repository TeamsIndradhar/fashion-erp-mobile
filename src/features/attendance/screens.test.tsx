import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Att from "../../../app/attendance/index";
import Home from "../../../app/home";
import { MissingPunchOutForm, unreportedPunchOuts } from "./MissingPunchOutForm";

const mockToday = {
  employee: { id: "e1", fullName: "Rohit Kumar", employeeCode: "EMP00123", shift: { id: "s1", name: "General", startTime: "09:30", endTime: "18:30", graceMinutes: 15 } },
  dateKey: "2026-11-04",
  isPunchedIn: true,
  openSessionId: "x1",
  sessions: [
    {
      id: "x1",
      checkInAt: "2026-11-04T03:45:00.000Z",
      checkOutAt: null,
      status: "PRESENT",
      source: "MOBILE",
      isLoginFromOffice: true,
      isLogoutFromOffice: null,
      inLocationName: "Main Factory",
      outLocationName: null,
      inOffice: null,
      outOffice: null,
      inDistanceMeters: 23,
      outDistanceMeters: null,
      hasInSelfie: true,
      hasOutSelfie: false,
    },
  ],
  remark: null,
  finalizedHours: 0,
  liveHours: 3.2,
  facePhotoIds: ["p1"],
  hasLocations: true,
  missingPunchOuts: [
    { sessionId: "old1", dateKey: "2026-11-03", checkInAt: "2026-11-03T04:00:00.000Z", locationName: "Main Factory", requestId: null, requestedPunchOut: null },
    { sessionId: "old2", dateKey: "2026-11-02", checkInAt: "2026-11-02T04:00:00.000Z", locationName: null, requestId: "r1", requestedPunchOut: "2026-11-02T13:00:00.000Z" },
  ],
  rules: { requireFace: true, faceMatchThreshold: 0.5, faceMatchFrames: 3, gpsAccuracyMeters: 50 },
};

const mockMe = {
  user: { id: "u1", fullName: "Rohit Kumar", email: "r@x.in", phone: null },
  company: { id: "c1", name: "Indradhar" },
  employee: { id: "e1", employeeCode: "EMP00123", fullName: "Rohit Kumar", branchName: null, departmentName: "Production Dept.", designationName: null, shift: null },
  mustChangePassword: false,
  permissions: { attendance: { view: true, punch: true } },
  modulesEnabled: { hrms: true },
  viewableModules: ["hrms_attendance"],
  device: { id: "d1", status: "ACTIVE", integrityStatus: "UNVERIFIED", model: null, platform: "android" },
};

jest.mock("expo-router", () => ({
  Redirect: () => null,
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
  useFocusEffect: (cb: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("react").useEffect(cb, []);
  },
}));
jest.mock("@/auth/AuthProvider", () => ({ useAuth: () => ({ status: "signedIn", me: mockMe, reload: jest.fn() }) }));
jest.mock("@/core/services", () => ({
  endpoints: {
    attendanceToday: jest.fn(async () => mockToday),
    officeLocations: jest.fn(async () => [{ id: "o1", name: "Main Factory", latitude: 28.6, longitude: 77.2, radiusMeters: 100 }]),
    notifications: jest.fn(async () => [{ id: "n1", isRead: false }]),
    pendingEntries: jest.fn(async () => []),
  },
}));
jest.mock("@/features/attendance/location", () => ({
  getLocationPermission: jest.fn(async () => "granted"),
  locationServicesOn: jest.fn(async () => true),
  acquireFix: jest.fn(async () => ({ latitude: 28.6, longitude: 77.2, accuracy: 8, timestamp: Date.now(), mocked: false })),
}));
jest.mock("@/components/OfflineBanner", () => ({ OfflineBanner: () => null }));

function wrap(node: ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };
  return (
    <SafeAreaProvider initialMetrics={metrics}>
      <QueryClientProvider client={qc}>{node}</QueryClientProvider>
    </SafeAreaProvider>
  );
}

// The first render of a cold cache transforms the icon fonts and is slow.
jest.setTimeout(30_000);

describe("prototype screens EMP-001 / EMP-002", () => {
  it("home shows profile, punch hero, chips, today card, shortcuts and nav", async () => {
    await render(wrap(<Home />));
    expect(await screen.findByText("You are at")).toBeTruthy();
    expect(screen.getByText("Fashion ERP")).toBeTruthy();
    expect(screen.getByText("EMP00123")).toBeTruthy();
    expect(screen.getByText("Tap to Punch")).toBeTruthy();
    expect(await screen.findByText("GPS accuracy: 8 m")).toBeTruthy();
    expect(screen.getByText("Device verified")).toBeTruthy();
    expect(screen.getByText("Today's Attendance")).toBeTruthy();
    expect(await screen.findByText("09:15 AM")).toBeTruthy();
    for (const t of ["Attendance", "Leave", "Report", "Add Remark", "Requests", "Office Locations", "Home", "My Work", "Alerts", "Profile"]) expect(screen.getByText(t)).toBeTruthy();
  });

  it("home punch button opens Punch Out when already punched in", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { router } = require("expo-router");
    await render(wrap(<Home />));
    expect(await screen.findByText("09:15 AM")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("home-punch"));
    expect(router.push).toHaveBeenCalledWith({ pathname: "/attendance/punch", params: { type: "OUT" } });
  });

  it("attendance shows hero ring, punch pair, today's sessions and shift", async () => {
    await render(wrap(<Att />));
    expect(await screen.findByText("Checked In")).toBeTruthy();
    expect(screen.getByText("Attendance")).toBeTruthy();
    expect(screen.getByText("Punch In")).toBeTruthy();
    expect(screen.getByText("Punch Out")).toBeTruthy();
    expect(screen.getByText("In 09:15 AM · Main Factory")).toBeTruthy();
    expect(screen.getByText("Inside office · 23 m")).toBeTruthy();
    expect(screen.getByText("Present")).toBeTruthy();
    expect(screen.getByText("General 09:30 – 18:30 (15 min grace)")).toBeTruthy();
    expect(await screen.findByText("Main Factory")).toBeTruthy();
  });
});

describe("missing punch-out (forgot to punch out)", () => {
  it("only unreported days block the next Punch In", () => {
    expect(unreportedPunchOuts(mockToday.missingPunchOuts).map((m) => m.sessionId)).toEqual(["old1"]);
    expect(unreportedPunchOuts(undefined)).toEqual([]);
  });

  it("attendance shows the missing day and the one already sent for approval", async () => {
    await render(wrap(<Att />));
    expect(await screen.findByText("Punch-out missing · Tue, 3 Nov")).toBeTruthy();
    expect(screen.getByText("Punch-out sent for approval · Mon, 2 Nov")).toBeTruthy();
    expect(screen.getByText("In 09:30 AM · Out 06:30 PM (requested)")).toBeTruthy();
  });

  it("the form asks for the punch-out time and a remark before sending", async () => {
    await render(wrap(<MissingPunchOutForm item={mockToday.missingPunchOuts[0]} remaining={1} />));
    expect(screen.getByText("Tue, 3 Nov: no punch-out")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("missing-out-send"));
    expect(await screen.findByText("Choose the time you punched out.")).toBeTruthy();
  });
});
