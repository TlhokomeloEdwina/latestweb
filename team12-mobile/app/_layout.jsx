import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { ErrorBoundary } from "react-error-boundary";
import { View, Text, Button } from "react-native";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "FreeSerif-4aeK": require("../assets/fonts/FreeSerif-4aeK.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ResidentDetails" options={{ headerShown: false }} />
        <Stack.Screen name="MyPassouts" options={{ headerShown: false }} />
        <Stack.Screen name="PassoutRequest" options={{ headerShown: false }} />
        <Stack.Screen name="Activity" options={{ headerShown: false }} />
        <Stack.Screen name="checkin" options={{ headerShown: false }} />
        <Stack.Screen name="checkinView" options={{ headerShown: false }} />
        <Stack.Screen name="checkinList" options={{ headerShown: false }} />
        <Stack.Screen
          name="checkinProfile/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="BasicAlerts" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
};

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <View style={{ padding: 20 }}>
      <Text>Something went wrong:</Text>
      <Text>{error.message}</Text>
      <Button title="Try again" onPress={resetErrorBoundary} />
    </View>
  );
};

// Wrap RootLayout with ErrorBoundary
export default () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <RootLayout />
  </ErrorBoundary>
);
