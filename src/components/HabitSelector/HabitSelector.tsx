import { IconChevronDown, IconX } from "@tabler/icons-react-native";
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
import { useHabits } from "src/hooks/useHabits";

export function HabitSelector() {
  const { habits, addNewHabit, removeHabit } = useHabits();
  const { setHabitId } = useHabitContext();
  const [selectedHabit, setSelectedHabit] = useState<string>("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Set initial selected habit when habits are loaded
  useEffect(() => {
    if (habits.length > 0 && !selectedHabit) {
      setSelectedHabit(habits[0].id);
      setHabitId(habits[0].id);
    }
  }, [habits]);

  const handleHabitChange = (value: string) => {
    if (value === "new") {
      setIsAddingNew(true);
      return;
    }
    setSelectedHabit(value);
    setHabitId(value);
  };

  const handleAddNewHabit = async (name: string) => {
    try {
      const newHabit = await addNewHabit(name);
      setSelectedHabit(newHabit.id);
      setIsAddingNew(false);
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

  const handleRemoveHabit = async (habitId: string) => {
    try {
      await removeHabit(habitId);
      // If the removed habit was selected, select the first available habit
      if (selectedHabit === habitId && habits.length > 1) {
        const nextHabit = habits.find((h) => h.id !== habitId);
        if (nextHabit) {
          setSelectedHabit(nextHabit.id);
          setHabitId(nextHabit.id);
        }
      }
    } catch (error) {
      // Handle error appropriately
      console.error("Failed to remove habit:", error);
    }
  };

  return (
    <React.Fragment>
      <Button
        className="mx-4 mb-4"
        onPress={() => setIsOpen(true)}
        variant="outline"
      >
        <ButtonText>
          {selectedHabit
            ? habits.find((h) => h.id === selectedHabit)?.name
            : "Select a habit"}
        </ButtonText>
        <Icon as={IconChevronDown} />
      </Button>

      <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
                setIsOpen(false);
              }}
            >
              <ActionsheetItemText>{habit.name}</ActionsheetItemText>
              <Button
                size="sm"
                variant="outline"
                onPress={(e) => {
                  e.stopPropagation();
                  void handleRemoveHabit(habit.id);
                }}
              >
                <Icon as={IconX} size="sm" />
              </Button>
            </ActionsheetItem>
          ))}
          <ActionsheetItem
            onPress={() => {
              setIsAddingNew(true);
              setIsOpen(false);
            }}
          >
            <ActionsheetItemText>Add new habit</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>

      <AlertDialog isOpen={isAddingNew} onClose={() => setIsAddingNew(false)}>
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
            <Button variant="outline" onPress={() => setIsAddingNew(false)}>
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
