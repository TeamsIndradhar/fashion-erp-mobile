import Constants from "expo-constants";
import { Platform } from "react-native";

const extra = (Constants.expoConfig?.extra ?? {}) as { apiBaseUrl?: string; appVariant?: string };

export const env = {
  apiBaseUrl: (process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.apiBaseUrl ?? "").replace(/\/+$/, ""),
  appVariant: extra.appVariant ?? "development",
  appVersion: Constants.expoConfig?.version ?? "0.0.0",
  platform: (Platform.OS === "ios" ? "ios" : "android") as "android" | "ios",
};
