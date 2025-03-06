import { IconCheck } from "@tabler/icons-react-native";
import { Stack, useRouter } from "expo-router";
import Onboarding, {
  type DoneButtonProps,
} from "react-native-onboarding-swiper";
import { Button } from "src/components/ui/button";
import { Icon } from "src/components/ui/icon";
import { Image } from "src/components/ui/image";
import { Text } from "src/components/ui/text";
import { useSettingsContext } from "src/context/SettingsContext/SettingsContext";

const Done = ({ onPress }: DoneButtonProps) => (
  <Button variant="outline" className="mr-4" onPress={onPress}>
    <Icon as={IconCheck} className="w-8 h-8 text-orange-500" />
  </Button>
);

export default function OnboardingPage() {
  const { completeOnboarding } = useSettingsContext();
  const router = useRouter();

  const handleComplete = async () => {
    await completeOnboarding();
    router.push("/");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Onboarding
        onDone={handleComplete}
        onSkip={handleComplete}
        DoneButtonComponent={Done}
        pages={[
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("public/assets/images/onboarding1.png")}
                alt="App's main screen"
                resizeMode="contain"
                size="none"
                className="h-[400px]"
              />
            ),
            title: "Track Your Progress",
            subtitle: (
              <Text className="mx-10 text-center">
                Stay on top of your habits with a clear calendar view. Each day
                is marked as <Text className="font-bold">done</Text>🔥 or
                skipped❄, helping you visualize your progress at a glance.
              </Text>
            ),
          },
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("public/assets/images/onboarding2.png")}
                alt="Mark progress panel"
                resizeMode="contain"
                size="none"
                className="h-[400px]"
              />
            ),
            title: "Log Your Habit Completion",
            subtitle: (
              <Text className="mx-10 text-center">
                Easily update your habit status. Mark{" "}
                <Text className="font-bold">all past days as done</Text>, set{" "}
                <Text className="font-bold">
                  today as done while skipping the rest
                </Text>
                , or <Text className="font-bold">postpone your decision</Text>{" "}
                until later.
              </Text>
            ),
          },
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("public/assets/images/onboarding3.png")}
                alt="Manage habits panel"
                resizeMode="contain"
                size="none"
                className="h-[400px]"
              />
            ),
            title: "Manage Your Habits",
            subtitle: (
              <Text className="mx-10 text-center">
                Choose which habit to track on the main screen,{" "}
                <Text className="font-bold">add new habits</Text>, or{" "}
                <Text className="font-bold">edit existing ones</Text> to fit
                your goals. Keep your habit list organized and tailored to your
                needs.
              </Text>
            ),
          },
        ]}
      />
    </>
  );
}
