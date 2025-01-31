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
      <Text>Manage your app settings</Text>
      <Button onPress={handleCleanDatabase} className="w-full">
        <ButtonText>Clean Database</ButtonText>
      </Button>
    </Card>
  );
};
