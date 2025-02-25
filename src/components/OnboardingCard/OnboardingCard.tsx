"use client";

import { useRouter } from "expo-router";
import { Button, ButtonText } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import { Heading } from "src/components/ui/heading";
import { Text } from "src/components/ui/text";

export const OnboardingCard = () => {
  const router = useRouter();

  const handleOnboardingButton = async () => {
    router.push("/onboarding");
  };

  return (
    <Card size="lg" className="w-full bg-orange-100">
      <Heading size="xl" className="mb-3 text-stone-700">
        Onboarding
      </Heading>
      <Text className="mb-6 text-stone-700">
        You can check out the onboarding page you've seen on the first start
        once again by clicking the button below.
      </Text>
      <Button
        onPress={handleOnboardingButton}
        className="w-full bg-orange-500 h-12"
      >
        <ButtonText>Go to onboarding</ButtonText>
      </Button>
    </Card>
  );
};
