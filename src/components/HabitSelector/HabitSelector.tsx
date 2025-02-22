import { IconChevronDown } from "@tabler/icons-react-native";
import { useState } from "react";
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
import { useHabitSelector } from "src/hooks/useHabitSelector";

export function HabitSelector() {
  const {
    selectedHabit,
    habits,
    handleHabitChange,
    isAddingNew,
    setIsAddingNew,
    handleAddNewHabit,
  } = useHabitSelector();

  const [newHabitName, setNewHabitName] = useState("");

  const handleSubmitNewHabit = () => {
    if (newHabitName.trim()) {
      void handleAddNewHabit(newHabitName.trim());
      setNewHabitName("");
    }
  };

  return (
    <>
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
            <SelectItem label="Add new habit" value="new" />
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
    </>
  );
}
