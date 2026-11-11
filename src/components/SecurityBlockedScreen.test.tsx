import { act, render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SecurityBlockedScreen } from "./SecurityBlockedScreen";

jest.mock("./OfflineBanner", () => ({ OfflineBanner: () => null }));

describe("SecurityBlockedScreen (D-043)", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("shows the reasons and signs out after 10 seconds", async () => {
    const onDone = jest.fn();
    await render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <SecurityBlockedScreen reasons={["DEVELOPER_OPTIONS_ON", "MOCK_LOCATION"]} onDone={onDone} />
      </SafeAreaProvider>
    );
    expect(screen.getByText("Developer options is ON")).toBeTruthy();
    expect(screen.getByText("A mock / fake GPS location is being used")).toBeTruthy();
    expect(screen.getByText("Signing you out in 10 s…")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(9_000);
    });
    expect(onDone).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(1_500);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
