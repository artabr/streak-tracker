import { ScrollView, View } from "react-native";
import { Card } from "src/components/ui/card";
import { Heading } from "src/components/ui/heading";
import { Text } from "src/components/ui/text";
import { VStack } from "src/components/ui/vstack";

export default function TabTwoScreen() {
  return (
    <View className="pt-12 bg-gray-100">
      <ScrollView>
        <VStack space="3xl" className="p-6">
          <VStack space="lg" className="">
            <Heading size="2xl" className="font-normal text-stone-800">
              Hi! Welcome to
            </Heading>
            <Heading size="3xl" className="text-stone-800">
              Tend - a habit tracker
            </Heading>
            <Text className="">
              With Tend, you can easily track your progress and stay consistent.
              Each day, you can mark your habit as filled (🔥 Fire) or skipped
              (❄ Freeze), helping you stay accountable and motivated.
            </Text>
          </VStack>

          <Card size="lg" className="w-full bg-slate-500 text-gray-200">
            <Heading size="xl" className="mb-3 text-gray-200">
              How It Works
            </Heading>
            <VStack space="sm">
              <Text className="text-white">
                🔥 Filled Days – Mark a day as Fire when you complete your
                habit. Keep going to build streaks!
              </Text>
              <Text className="text-white">
                ❄ Skipped Days – Mark a day as Freeze if you miss it. Life
                happens, and that’s okay!
              </Text>
              <Text className="text-white">
                At the start of the app, we’ll show you the days you need to
                mark, so you never lose track.
              </Text>
            </VStack>
          </Card>

          <Card size="lg" className="w-full bg-gray-200">
            <Heading size="xl" className="mb-3">
              Stay Motivated
            </Heading>
            <VStack space="sm">
              <Text>
                {`\u2022 `}Track your progress with a simple calendar view.
              </Text>
              <Text>{`\u2022 `}Build streaks to strengthen your habits.</Text>
              <Text>
                {`\u2022 `}Get reminded at the start of the app to keep you on
                track.
              </Text>
              <Text>
                Ready to build better habits? Start tracking today! 🔥
              </Text>
            </VStack>
          </Card>
        </VStack>
      </ScrollView>
    </View>
  );
}
