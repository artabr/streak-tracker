import { IconChevronDown, IconDots } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import React from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "src/components/ui/actionsheet";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "src/components/ui/alert-dialog";
import { Button, ButtonText } from "src/components/ui/button";
import { Icon } from "src/components/ui/icon";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "src/components/ui/input";
import { Text } from "src/components/ui/text";
import { useHabitContext } from "src/context/HabitContext/HabitContext";

export function HabitSelector({ defaultHabitId = "" }) {
  const { habits, habitId, setHabitId, addNewHabit } = useHabitContext();
  const [selectedHabit, setSelectedHabit] = useState<string>(
    habitId ?? defaultHabitId,
  );
  const [isEditHabitsModalOpen, setIsEditHabitsModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [isSelectorOptionsOpen, setIsSelectorOptionsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSelectedHabit(habitId ?? defaultHabitId);
  }, [habitId, defaultHabitId]);

  const handleHabitChange = (value: string) => {
    if (value === "new") {
      setIsEditHabitsModalOpen(true);
      return;
    }
    setSelectedHabit(value);
    setHabitId(value);
  };

  const handleAddNewHabit = async (name: string) => {
    try {
      const newHabit = await addNewHabit(name);
      setSelectedHabit(newHabit.id);
      setHabitId(newHabit.id);
      setIsEditHabitsModalOpen(false);
    } catch (error) {
      // Handle error appropriately
    }
  };

  const handleSubmitNewHabit = () => {
    if (newHabitName.trim()) {
      void handleAddNewHabit(newHabitName.trim());
      setNewHabitName("");
    }
  };

  const handleMoreOptions = (habitId: string) => () => {
    setIsSelectorOptionsOpen(false);
    router.push({
      pathname: "/habit-options/[habitId]",
      params: { habitId },
    });
  };

  return (
    <React.Fragment>
      <Button
        className="mx-4 mb-4 h-14 rounded-full bg-gray-300 data-[active=true]:bg-gray-500"
        onPress={() => setIsSelectorOptionsOpen(true)}
      >
        <ButtonText className="flex-1 text-lg text-stone-700 data-[active=true]:text-stone-700 text-center">
          {selectedHabit
            ? habits.find((h) => h.id === selectedHabit)?.name
            : "Select a habit"}
        </ButtonText>
        <Icon
          as={IconChevronDown}
          className="absolute w-6 h-6 text-stone-700 right-6"
        />
      </Button>

      <Actionsheet
        isOpen={isSelectorOptionsOpen}
        onClose={() => setIsSelectorOptionsOpen(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper className="mb-2">
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {habits.map((habit) => (
            <ActionsheetItem
              key={habit.id}
              className="flex items-center justify-between rounded-xl bg-stone-100 mb-4 pl-6"
              onPress={() => {
                handleHabitChange(habit.id);
                setIsSelectorOptionsOpen(false);
              }}
            >
              <ActionsheetItemText className="text-lg text-bold">
                {habit.name}
              </ActionsheetItemText>
              <Button
                size="md"
                onPress={handleMoreOptions(habit.id)}
                className="bg-gray-400 data-[active=true]:bg-gray-600"
              >
                <Icon
                  as={IconDots}
                  size="sm"
                  className="text-stone-700 data-[active=true]:text-stone-700"
                />
              </Button>
            </ActionsheetItem>
          ))}
          <Button
            onPress={() => {
              setIsEditHabitsModalOpen(true);
              setIsSelectorOptionsOpen(false);
            }}
            className="w-full mt-4 h-14 bg-gray-300 data-[active=true]:bg-gray-500"
          >
            <ButtonText className="text-stone-700 data-[active=true]:text-stone-700">
              Add new habit
            </ButtonText>
          </Button>
        </ActionsheetContent>
      </Actionsheet>

      <AlertDialog
        isOpen={isEditHabitsModalOpen}
        onClose={() => setIsEditHabitsModalOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text>Add New Habit</Text>
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody className="mb-4">
            <Input>
              <InputField
                defaultValue={newHabitName}
                onChangeText={setNewHabitName}
                placeholder="Enter habit name"
              />
              <InputSlot>
                <InputIcon />
              </InputSlot>
            </Input>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              action="secondary"
              onPress={() => setIsEditHabitsModalOpen(false)}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={handleSubmitNewHabit}
              disabled={!newHabitName.trim()}
            >
              <ButtonText>Add</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}
