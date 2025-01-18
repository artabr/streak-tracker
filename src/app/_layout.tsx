import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "src/app/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GluestackUIProvider } from "src/components/ui/gluestack-ui-provider";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetPortal,
  BottomSheetTrigger,
} from "src/components/ui/bottomsheet";
import { Text } from "src/components/ui/text";
import { useColorScheme } from "src/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
        <BottomSheet>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </BottomSheet>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
