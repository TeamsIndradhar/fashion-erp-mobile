import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheet } from "./BottomSheet";

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };

describe("BottomSheet (D-046 punch modal)", () => {
  it("closes from the dimmed area, but not while onClose is unset (sending)", async () => {
    const onClose = jest.fn();
    const { rerender } = await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <BottomSheet onClose={onClose}>
          <Text>Camera</Text>
        </BottomSheet>
      </SafeAreaProvider>
    );
    expect(screen.getByText("Camera")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("bottom-sheet-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);

    await rerender(
      <SafeAreaProvider initialMetrics={metrics}>
        <BottomSheet>
          <Text>Camera</Text>
        </BottomSheet>
      </SafeAreaProvider>
    );
    await fireEvent.press(screen.getByTestId("bottom-sheet-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
