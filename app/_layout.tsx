import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "../context/AuthContext";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <Stack />
        <Toast />
      </AuthGate>
    </AuthProvider>
  );
}
