import { requireOptionalNativeModule } from "expo";

export interface NativeDeviceSignals {
  developerOptions: boolean | null;
  adbEnabled: boolean | null;
  adbWifiEnabled: boolean | null;
}

interface DeviceSignalsModule {
  getSignals(): NativeDeviceSignals;
}

// Android only. null on iOS, in Jest, and in a build made before this module existed.
const native = requireOptionalNativeModule<DeviceSignalsModule>("DeviceSignals");

export function getNativeDeviceSignals(): NativeDeviceSignals | null {
  if (!native) return null;
  try {
    return native.getSignals();
  } catch {
    return null;
  }
}
