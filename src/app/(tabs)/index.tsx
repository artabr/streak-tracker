import { IconCheck, IconFlame } from "@tabler/icons-react-native";
import { addDays, format, subDays } from "date-fns";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from "src/components/ui/checkbox";
import { Heading } from "src/components/ui/heading";
import { HStack } from "src/components/ui/hstack";
import { Icon } from "src/components/ui/icon";
import { Pressable } from "src/components/ui/pressable";
import { Text } from "src/components/ui/text";
import { VStack } from "src/components/ui/vstack";

const generateDays = (currentDate: Date) => {
  const days = [];
  for (let i = -60; i <= 60; i++) {
    const date =
      i < 0 ? subDays(currentDate, Math.abs(i)) : addDays(currentDate, i);
    days.push(date);
  }
  return days;
};

type HabitItem = {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
};

const mockHabits: HabitItem[] = [
  { id: "1", name: "Morning Exercise", icon: "dumbbell", completed: false },
  { id: "2", name: "Read a Book", icon: "book", completed: false },
  { id: "3", name: "Meditate", icon: "peace", completed: false },
];

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const days = useMemo(() => generateDays(new Date()), []);

  const renderDayItem = (date: Date) => {
    const isSelected =
      format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    const isToday =
      format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

    return (
      <Pressable
        onPress={() => setSelectedDate(date)}
        className={`items-center px-4 py-2 rounded-lg mx-1 ${
          isSelected ? "bg-blue-500" : isToday ? "bg-gray-200" : "bg-white"
        }`}
      >
        <Text
          className={`text-lg font-medium ${isSelected ? "text-white" : "text-gray-800"}`}
        >
          {format(date, "d")}
        </Text>
        <Text
          className={`text-sm ${isSelected ? "text-white" : "text-gray-500"}`}
        >
          {format(date, "EEE")}
        </Text>
      </Pressable>
    );
  };

  const renderHabitItem = ({ item }: { item: HabitItem }) => (
    <HStack space="md" className="bg-white p-4 rounded-lg mb-2 items-center">
      <Icon as={IconFlame} className="w-6 h-6 text-orange-500" />
      <Text className="flex-1 text-lg">{item.name}</Text>
      <Checkbox value="checked" size="md" isInvalid={false} isDisabled={false}>
        <CheckboxIndicator>
          <CheckboxIcon as={IconCheck} />
        </CheckboxIndicator>
      </Checkbox>
    </HStack>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <VStack space="xl" className="pt-12">
        <Heading size="2xl" className="font-normal text-stone-800 px-6">
          Habits
        </Heading>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6"
          contentOffset={{ x: 3620, y: 0 }}
        >
          <HStack space="sm">{days.map((date) => renderDayItem(date))}</HStack>
        </ScrollView>

        <FlatList
          data={mockHabits}
          renderItem={renderHabitItem}
          keyExtractor={(item) => item.id}
          className="px-6"
          showsVerticalScrollIndicator={false}
        />
      </VStack>
    </View>
  );
}
