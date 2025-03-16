import "src/app/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GluestackUIProvider } from "src/components/ui/gluestack-ui-provider";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Migration } from "src/components/Migration/Migration";
import { BottomSheet } from "src/components/ui/bottomsheet";
import { HabitContextProvider } from "src/context/HabitContext/HabitContext";
import { SettingsContextProvider } from "src/context/SettingsContext/SettingsContext";
import { studioDb } from "src/db/drizzle";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useDrizzleStudio(studioDb);

  const [loaded] = useFonts({
    SpaceMono: require("public/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="light">
        <Migration>
          <SettingsContextProvider>
            <HabitContextProvider>
              <BottomSheet>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </BottomSheet>
            </HabitContextProvider>
          </SettingsContextProvider>
        </Migration>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
