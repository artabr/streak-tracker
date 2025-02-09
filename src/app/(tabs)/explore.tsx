import { View } from "react-native";
import { SettingsCard } from "src/components/SettingsCard/SettingsCard";
import { Card } from "src/components/ui/card";
import { Heading } from "src/components/ui/heading";
import { Text } from "src/components/ui/text";

export default function TabTwoScreen() {
  return (
    <View className="h-full p-4 pt-12 bg-gray-100">
      <View className="">
        <View className="">
          <Text className="text-2xl font-bold text-gray-800">
            Hi! Welcome to Nicks - a habit tracker
          </Text>
          <Text className="text-gray-600">
            With Nicks, you can easily track your progress and stay consistent.
            Each day, you can mark your habit as filled (🔥 Fire) or skipped (❄
            Freeze), helping you stay accountable and motivated.
          </Text>
        </View>

        <Card className="w-full">
          <Heading>How It Works</Heading>
          <Text>
            Filled Days – Mark a day as Fire when you complete your habit. Keep
            going to build streaks!
          </Text>
          <Text>
            Skipped Days – Mark a day as Freeze if you miss it. Life happens,
            and that’s okay!
          </Text>
          <Text>
            At the start of the app, we’ll notify you about the days you need to
            mark, so you never lose track.
          </Text>
        </Card>

        <Card className="w-full">
          <Heading>Stay Motivated</Heading>
          <View className="list-disc">
            <Text>
              {`\u2022 `}Track your progress with a simple calendar view.
            </Text>
            <Text>{`\u2022 `}Build streaks to strengthen your habits.</Text>
            <Text>{`\u2022 `}Get reminders to keep you on track.</Text>
            <Text>Ready to build better habits? Start tracking today! 🔥</Text>
          </View>
        </Card>

        <SettingsCard />
      </View>
    </View>
  );
}
