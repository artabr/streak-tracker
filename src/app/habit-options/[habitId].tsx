import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Box } from "src/components/ui/box";
import { Button, ButtonText } from "src/components/ui/button";
import { Input, InputField } from "src/components/ui/input";
import { Text } from "src/components/ui/text";
import { useHabitContext } from "src/context/HabitContext/HabitContext";

export default function HabitOptionsScreen() {
  const { habitId } = useLocalSearchParams<{ habitId: string }>();
  const { habits, updateHabit, clearHabitData, removeHabit } =
    useHabitContext();
  const [habitName, setHabitName] = useState("");
  const router = useRouter();

  const habit = habits.find((h) => h.id === habitId);

  useEffect(() => {
    if (habit) {
      setHabitName(habit.name);
    }
  }, [habit]);

  const handleSave = async () => {
    if (habit && habitName.trim() !== "") {
      await updateHabit(habit.id, { name: habitName.trim() });
      router.back();
    }
  };

  const handleClearData = async () => {
    if (habit) {
      await clearHabitData(habit.id);
      router.back();
    }
  };

  const handleRemoveHabit = async () => {
    if (habit) {
      await removeHabit(habit.id);
      router.back();
    }
  };

  if (!habit) return null;

  return (
    <Box className="flex-1">
      <Text size="xl">{`Edit "${habit.name}" habit`}</Text>
      <Box className="flex-1 p-4">
        <Input className="mb-4">
          <InputField
            defaultValue={habitName}
            onChangeText={setHabitName}
            placeholder="Habit name"
          />
        </Input>

        <Button
          onPress={handleSave}
          disabled={!habitName.trim()}
          className="mb-4"
        >
          <ButtonText>Save changes</ButtonText>
        </Button>

        <Button
          variant="outline"
          action="negative"
          onPress={handleClearData}
          className="mb-4"
        >
          <ButtonText>Clear habit data</ButtonText>
        </Button>

        <Button variant="outline" action="negative" onPress={handleRemoveHabit}>
          <ButtonText>Remove Habit</ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
