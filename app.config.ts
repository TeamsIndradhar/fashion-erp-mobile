import type { ConfigContext, ExpoConfig } from "expo/config";

// docs/10 §3. App ID approved in D-036; variants install side by side.
const VARIANT = (process.env.APP_VARIANT ?? "development") as "development" | "preview" | "production";
const BASE_ID = "in.indradhar.fashionerp";
const ID = VARIANT === "production" ? BASE_ID : VARIANT === "preview" ? `${BASE_ID}.preview` : `${BASE_ID}.dev`;
const NAME = VARIANT === "production" ? "Fashion ERP" : VARIANT === "preview" ? "Fashion ERP (Preview)" : "Fashion ERP (Dev)";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: NAME,
  slug: "fashion-erp-mobile",
  scheme: "fashionerp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    bundleIdentifier: ID,
    supportsTablet: false,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "Fashion ERP uses your location only when you punch in or out, to check that you are at your office.",
      NSCameraUsageDescription: "Fashion ERP uses the camera to take your attendance selfie.",
      NSMicrophoneUsageDescription: "Fashion ERP uses the microphone only when you record a voice note.",
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: ID,
    adaptiveIcon: {
      backgroundColor: "#F2F0FE",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    // Only what docs/10 §3 lists. Never background location, QUERY_ALL_PACKAGES or storage.
    permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION", "CAMERA", "RECORD_AUDIO", "INTERNET"],
    blockedPermissions: [
      "android.permission.ACCESS_BACKGROUND_LOCATION",
      "android.permission.QUERY_ALL_PACKAGES",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.SYSTEM_ALERT_WINDOW",
    ],
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    ["expo-location", { locationWhenInUsePermission: "Fashion ERP uses your location only when you punch in or out, to check that you are at your office.", isAndroidBackgroundLocationEnabled: false }],
    ["expo-camera", { cameraPermission: "Fashion ERP uses the camera to take your attendance selfie.", recordAudioAndroid: false }],
    ["expo-splash-screen", { image: "./assets/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#F2F0FE" }],
    // Cleartext HTTP (LAN dev server) is allowed in development builds only.
    ["expo-build-properties", { android: { usesCleartextTraffic: VARIANT === "development" } }],
  ],
  experiments: { typedRoutes: true },
  extra: {
    appVariant: VARIANT,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? (VARIANT === "production" ? "https://erp.indradhar.in" : "http://192.168.1.10:3000"),
  },
});
