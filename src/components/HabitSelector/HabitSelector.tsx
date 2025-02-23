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
        className="mx-4 mb-4"
        onPress={() => setIsSelectorOptionsOpen(true)}
        variant="outline"
      >
        <ButtonText>
          {selectedHabit
            ? habits.find((h) => h.id === selectedHabit)?.name
            : "Select a habit"}
        </ButtonText>
        <Icon as={IconChevronDown} />
      </Button>

      <Actionsheet
        isOpen={isSelectorOptionsOpen}
        onClose={() => setIsSelectorOptionsOpen(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {habits.map((habit) => (
            <ActionsheetItem
              key={habit.id}
              onPress={() => {
                handleHabitChange(habit.id);
                setIsSelectorOptionsOpen(false);
              }}
            >
              <ActionsheetItemText>{habit.name}</ActionsheetItemText>
              <Button
                size="sm"
                variant="outline"
                onPress={handleMoreOptions(habit.id)}
                className="ml-auto"
              >
                <Icon as={IconDots} size="sm" />
              </Button>
            </ActionsheetItem>
          ))}
          <ActionsheetItem
            onPress={() => {
              setIsEditHabitsModalOpen(true);
              setIsSelectorOptionsOpen(false);
            }}
          >
            <ActionsheetItemText>Add new habit</ActionsheetItemText>
          </ActionsheetItem>
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
          <AlertDialogBody>
            <Input>
              <InputField
                value={newHabitName}
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
              variant="outline"
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
