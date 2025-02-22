import { IconChevronDown } from "@tabler/icons-react-native";
import { useEffect, useState } from "react";
import React from "react";
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
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "src/components/ui/select";
import { Text } from "src/components/ui/text";
import { useHabitContext } from "src/context/HabitContext/HabitContext";
import { useHabits } from "src/hooks/useHabits";

export function HabitSelector() {
  const { habits, addNewHabit } = useHabits();
  const { setHabitId } = useHabitContext();
  const [selectedHabit, setSelectedHabit] = useState<string>("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

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

  return (
    <React.Fragment>
      <Select selectedValue={selectedHabit} onValueChange={handleHabitChange}>
        <SelectTrigger className="mx-4 mb-4">
          <SelectInput placeholder="Select a habit" />
          <SelectIcon>
            <Icon as={IconChevronDown} />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {habits.map((habit) => (
              <SelectItem key={habit.id} label={habit.name} value={habit.id} />
            ))}
            <Button onPress={() => setIsAddingNew(true)}>
              <ButtonText>Add new habit</ButtonText>
            </Button>
          </SelectContent>
        </SelectPortal>
      </Select>

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
