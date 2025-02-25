import { IconCheck, IconTrophy } from "@tabler/icons-react-native";
import { Stack, useRouter } from "expo-router";
import Onboarding, {
  type DoneButtonProps,
} from "react-native-onboarding-swiper";
import { Button } from "src/components/ui/button";
import { Icon } from "src/components/ui/icon";
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
              <Icon as={IconTrophy} className="w-24 h-24 text-orange-500" />
            ),
            title: "Welcome to Habit Tracker",
            subtitle: "Track your daily habits and build a better routine",
          },
          {
            backgroundColor: "#fff",
            image: (
              <Icon as={IconTrophy} className="w-24 h-24 text-orange-500" />
            ),
            title: "Set Your Goals",
            subtitle: "Create and customize habits that matter to you",
          },
          {
            backgroundColor: "#fff",
            image: (
              <Icon as={IconTrophy} className="w-24 h-24 text-orange-500" />
            ),
            title: "Stay Consistent",
            subtitle: "Monitor your progress and stay motivated",
          },
        ]}
      />
    </>
  );
}
