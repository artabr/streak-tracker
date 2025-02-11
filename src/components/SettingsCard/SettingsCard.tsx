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
    <Card className="w-full">
      <Heading>Settings</Heading>
      <Text>
        If you want to start from scratch and clear all your progress, including
        streaks and marked days, click here. This action cannot be undone.
      </Text>
      <Button onPress={handleCleanDatabase} className="w-full">
        <ButtonText>Clean Database</ButtonText>
      </Button>
    </Card>
  );
};
