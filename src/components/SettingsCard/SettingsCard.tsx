"use client";

import { Button, ButtonText } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import { Heading } from "src/components/ui/heading";
import { Text } from "src/components/ui/text";
import { useHabitContext } from "src/context/HabitContext/HabitContext";

export const SettingsCard = () => {
  const { clearCalendarMarks } = useHabitContext();

  const handleCleanDatabase = async () => {
    void clearCalendarMarks();
  };

  return (
    <Card size="lg" className="w-full bg-orange-100">
      <Heading size="xl" className="mb-3 text-stone-700">
        Settings
      </Heading>
      <Text className="mb-6 text-stone-700">
        If you want to start from scratch and clear all your progress, including
        streaks and marked days, click here. This action cannot be undone.
      </Text>
      <Button
        onPress={handleCleanDatabase}
        className="w-full bg-orange-500 h-12"
      >
        <ButtonText>Clear your progress</ButtonText>
      </Button>
    </Card>
  );
};
