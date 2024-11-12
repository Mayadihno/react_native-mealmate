import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { LogBox } from "react-native";
import { useFonts } from "expo-font";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    "TT-Octosquares-Medium": require("../assets/fonts/TT-Octosquares-Medium.ttf"),
    "gt-bold": require("../assets/fonts/GTWalsheimPro-Bold.ttf"),
    "gt-medium": require("../assets/fonts/GTWalsheimPro-Medium.ttf"),
    "gt-regular": require("../assets/fonts/GTWalsheimPro-Regular.ttf"),
  });

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <RootLayoutNav />;
}
function RootLayoutNav() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="/(routes)/onboarding" />
            <Stack.Screen name="/(routes)/slider" />
            <Stack.Screen name="/(routes)/login" />
          </Stack>
        </ToastProvider>
      </PaperProvider>
    </Provider>
  );
}
