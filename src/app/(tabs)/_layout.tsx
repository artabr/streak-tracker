import { Tabs } from "expo-router";
import { Platform } from "react-native";

import {
  IconCalendar,
  IconChartBar,
  IconHome,
  IconSettings,
} from "@tabler/icons-react-native";
import { clsx } from "clsx";
import { HapticTab } from "src/components/HapticTab";
import TabBarBackground from "src/components/ui/TabBarBackground";
import { Icon } from "src/components/ui/icon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            height: 80,
            borderTopWidth: 0,
            shadowColor: "#FFFFFF",
          },
        }),
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingTop: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon
              as={IconHome}
              className={clsx(
                "w-10 h-10",
                focused ? "text-orange-500" : "text-gray-500",
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Statistics",
          tabBarIcon: ({ focused }) => (
            <Icon
              as={IconChartBar}
              className={clsx(
                "w-10 h-10",
                focused ? "text-orange-500" : "text-gray-500",
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ focused }) => (
            <Icon
              as={IconCalendar}
              className={clsx(
                "w-10 h-10",
                focused ? "text-orange-500" : "text-gray-500",
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <Icon
              as={IconSettings}
              className={clsx(
                "w-10 h-10",
                focused ? "text-orange-500" : "text-gray-500",
              )}
            />
          ),
        }}
      />
    </Tabs>
  );
}
