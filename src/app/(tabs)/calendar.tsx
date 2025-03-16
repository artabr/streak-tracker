import { createId } from "@paralleldrive/cuid2";
import { IconFlame } from "@tabler/icons-react-native";
import { clsx } from "clsx";
import { Snowflake } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { AppState, type GestureResponderEvent, View } from "react-native";
import { Calendar } from "react-native-calendars";
import type { DateData } from "react-native-calendars/src/types";
import { HabitSelector } from "src/components/HabitSelector/HabitSelector";
import { Icon } from "src/components/ui/icon";
import { Pressable } from "src/components/ui/pressable";
import { Text } from "src/components/ui/text";
import { useHabitContext } from "src/context/HabitContext/HabitContext";
import { DEFAULT_HABIT_ID } from "src/hooks/useHabits";
import {
  calendarMarksToMarkedDates,
  getCalendarDateStringInNumberOfDays,
  getTodayCalendarDateString,
} from "src/utils/calendar";

export default function CalendarScreen() {
  const { habits, addCalendarMarks } = useHabitContext();

  const firstHabitId = habits?.[0].id ?? DEFAULT_HABIT_ID;

  const [currentHabitId, setCurrentHabitId] = useState(firstHabitId);

  const calendarMarks =
    habits?.find((habit) => habit.id === currentHabitId)?.calendarMarks ?? [];
  console.log("currentHabitId", currentHabitId);
  console.log("habits", habits);
  console.log("calendarMarks", calendarMarks);

  const markedDates = calendarMarksToMarkedDates(calendarMarks ?? []);

  // TODO: make a popup to manually edit the streak days
  const onDayPress = (day?: DateData) => (event: GestureResponderEvent) => {
    void addCalendarMarks(
      [
        {
          id: createId(),
          calendarDate: getCalendarDateStringInNumberOfDays(day?.timestamp),
          mark: "red",
          habitId: currentHabitId ?? DEFAULT_HABIT_ID,
        },
      ],
      getCalendarDateStringInNumberOfDays(day?.timestamp),
      currentHabitId ?? DEFAULT_HABIT_ID,
    );
  };

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View className="h-full pt-12 bg-gray-100">
      <HabitSelector
        defaultHabitId={currentHabitId}
        onHabitChange={setCurrentHabitId}
      />
      <Calendar
        style={{
          backgroundColor: "#FBFBFB",
        }}
        firstDay={1}
        theme={{
          backgroundColor: "#FBFBFB",
          calendarBackground: "#FBFBFB",
          arrowColor: "#D4D4D4",
          monthTextColor: "#8A8A8A",
        }}
        markedDates={markedDates}
        // onDayPress={onDayPress}
        dayComponent={(props) => {
          const isToday =
            props.date?.dateString === getTodayCalendarDateString();
          if (props.marking?.marked && props.marking?.dotColor === "red") {
            return (
              <View className={clsx("rounded p-1", isToday && "bg-stone-100")}>
                <Text>
                  <Icon as={IconFlame} className="w-8 h-8 text-orange-500" />
                </Text>
              </View>
            );
          }
          if (props.marking?.marked && props.marking?.dotColor === "blue") {
            return (
              <View className={clsx("rounded p-1", isToday && "bg-stone-100")}>
                <Text>
                  <Icon as={Snowflake} className="w-8 h-8 text-cyan-300" />
                </Text>
              </View>
            );
          }
          return (
            <Pressable
              className={clsx("rounded p-1", isToday && "bg-stone-100")}
              onPress={onDayPress(props.date)}
            >
              <View className="w-8 h-8 flex items-center justify-center">
                <Text className="text-lg text-gray-800">{props.date?.day}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
