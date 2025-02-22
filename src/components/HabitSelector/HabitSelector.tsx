import { IconChevronDown } from "@tabler/icons-react-native";
import { Icon } from "src/components/ui/icon";
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
import { useHabitSelector } from "src/hooks/useHabitSelector";

export function HabitSelector() {
  const { selectedHabit, habits, handleHabitChange } = useHabitSelector();

  return (
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
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
