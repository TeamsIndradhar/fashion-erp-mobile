import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import { SecurityBlockedScreen } from "@/components/SecurityBlockedScreen";
import { ApiError } from "@/api/errors";
import { colors } from "@/theme/tokens";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // Never retry auth/permission errors; one retry for network blips.
        retry: (count, err) => !(err instanceof ApiError && err.status >= 400 && err.status < 500) && count < 1,
      },
    },
  });
}

/** D-043: a blocked phone gets only the warning — the app's screens are not mounted at all. */
function AppOrSecurityLock() {
  const auth = useAuth();
  if (auth.status === "securityBlocked") {
    return <SecurityBlockedScreen reasons={auth.security?.reasons ?? []} onDone={() => void auth.finishSecurityLock()} />;
  }
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      {/* D-046: punch opens as a sheet over Home / Attendance, not as a new page. */}
      <Stack.Screen name="attendance/punch" options={{ presentation: "transparentModal", animation: "slide_from_bottom", contentStyle: { backgroundColor: "transparent" } }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(makeQueryClient);
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <AppOrSecurityLock />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
