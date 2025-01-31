import { StyleSheet, View } from "react-native";
import { SettingsCard } from "src/components/SettingsCard/SettingsCard";
import { Text } from "src/components/ui/text";

export default function TabTwoScreen() {
  return (
    <View className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center space-y-6">
      <View className="w-full max-w-md space-y-4">
        {/*<AppIcon/>*/}
        <View className="text-center">
          <Text className="text-2xl font-bold text-gray-800">
            Streak - Habit Tracker
          </Text>
          <Text className="mt-2 text-gray-600">
            This is the app that let's you track your habits and build streaks.
          </Text>
        </View>
        <SettingsCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
