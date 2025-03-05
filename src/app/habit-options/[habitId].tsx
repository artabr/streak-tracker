import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "src/components/ui/box";
import { Button, ButtonText } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import { Heading } from "src/components/ui/heading";
import { Input, InputField } from "src/components/ui/input";
import { Text } from "src/components/ui/text";
import { VStack } from "src/components/ui/vstack";
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
    <>
      <Stack.Screen
        options={{
          headerTitle: "Edit habit",
        }}
      />
      <Box className="flex-1 bg-gray-100 pt-4">
        <ScrollView className="h-full">
          <VStack space="3xl" className="p-6">
            <VStack space="md">
              <VStack space="xs" className="">
                <Text className="text-lg">Habit name:</Text>
                <Input className="mb-4 rounded-xl h-16">
                  <InputField
                    defaultValue={habitName}
                    onChangeText={setHabitName}
                    placeholder="Habit name"
                    className="text-2xl"
                  />
                </Input>
              </VStack>

              <Button
                onPress={handleSave}
                disabled={!habitName.trim()}
                size="lg"
                className="mb-4 h-14"
              >
                <ButtonText>Save changes</ButtonText>
              </Button>
            </VStack>

            <Card size="lg" className="w-full bg-orange-100 mt-6">
              <Heading size="xl" className="mb-3 text-stone-700">
                Danger zone
              </Heading>
              <Text className="mb-6 text-stone-700">
                You can start from scratch and clear all your progress for this
                habit, by clicking the button below. Also, you can remove the
                habit completely.
              </Text>
              <Text className="mb-6 text-stone-700">
                Be careful. This action cannot be undone.
              </Text>

              <VStack space="md">
                <Button
                  onPress={handleClearData}
                  className="w-full mt-4 h-12 bg-gray-300 data-[active=true]:bg-gray-500"
                >
                  <ButtonText className="text-red-700 data-[active=true]:text-red-700">
                    Clear habit data
                  </ButtonText>
                </Button>

                <Button
                  onPress={handleRemoveHabit}
                  className="w-full mt-4 h-12 bg-gray-300 data-[active=true]:bg-gray-500"
                >
                  <ButtonText className="text-red-700 data-[active=true]:text-red-700">
                    Remove Habit
                  </ButtonText>
                </Button>
              </VStack>
            </Card>
          </VStack>
        </ScrollView>
      </Box>
    </>
  );
}
