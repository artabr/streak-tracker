import { createId } from "@paralleldrive/cuid2";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Flame, Snowflake } from "lucide-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { AppState, type GestureResponderEvent, View } from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";
import type { DateData, MarkedDates } from "react-native-calendars/src/types";
import {
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetContext,
  BottomSheetDragIndicator,
  BottomSheetPortal,
  BottomSheetTrigger,
} from "src/components/ui/bottomsheet";
import { Button, ButtonText } from "src/components/ui/button";
import { Icon } from "src/components/ui/icon";
import { Pressable } from "src/components/ui/pressable";
import { Text } from "src/components/ui/text";
import {
  HabitContextProvider,
  useHabitContext,
} from "src/context/HabitContext/HabitContext";
import { db } from "src/db/drizzle";
import migrations from "src/db/migrations/migrations";
import type { CalendarMark } from "src/db/schema";

const getDate = (count: number) => {
  const date = new Date();
  const newDate = date.setDate(date.getDate() + count);
  return CalendarUtils.getCalendarDateString(newDate);
};

export default function HomeScreen() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className="flex-1 gap-5 p-6 bg-secondary/30">
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View className="flex-1 gap-5 p-6 bg-secondary/30">
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <HabitContextProvider>
      <HomeScreenContent />
    </HabitContextProvider>
  );
}

function HomeScreenContent() {
  const {
    calendarMarks,
    addCalendarMarks,
    isNeedToMark,
    daysToMark,
    fillStreak,
  } = useHabitContext();

  const calendarMarksToMarkedDates = (calendarMarks: CalendarMark[]) => {
    return calendarMarks.reduce<MarkedDates>((acc, calendarMark) => {
      acc[calendarMark.calendarDate] = {
        marked: true,
        dotColor: calendarMark.mark,
      };
      return acc;
    }, {});
  };

  const markedDates = calendarMarksToMarkedDates(calendarMarks ?? []);

  const onDayPress = (day?: DateData) => (event: GestureResponderEvent) => {
    void addCalendarMarks(
      [
        {
          id: createId(),
          calendarDate:
            CalendarUtils.getCalendarDateString(day?.timestamp) ?? "",
          mark: "red",
          habitId: "defaultId",
        },
      ],
      CalendarUtils.getCalendarDateString(day?.timestamp) ?? "",
    );
  };

  const { handleOpen } = useContext(BottomSheetContext);

  const handleOpenBottomSheet = () => {
    handleOpen();
  };

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        console.log("isNeedToMark", isNeedToMark);
        if (isNeedToMark) {
          handleOpen();
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onFillHandler = () => {
    fillStreak();
  };

  const onSkipHandler = () => {
    fillStreak(true);
  };

  console.log("daysToMark", daysToMark);

  return (
    <View className="h-full pt-12 bg-white">
      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        dayComponent={(props) => {
          if (props.marking?.marked && props.marking?.dotColor === "red") {
            return (
              <View>
                <Text className="font-bold text-lg">
                  <Icon as={Flame} className="flex-1 w-8 h-8 text-orange-500" />
                </Text>
              </View>
            );
          }
          if (props.marking?.marked && props.marking?.dotColor === "blue") {
            return (
              <View>
                <Text className="font-bold text-lg">
                  <Icon
                    as={Snowflake}
                    className="flex-1 w-8 h-8 text-cyan-300"
                  />
                </Text>
              </View>
            );
          }
          return (
            <View>
              <Pressable onPress={onDayPress(props.date)}>
                <Text>{props.date?.day}</Text>
              </Pressable>
            </View>
          );
        }}
      />
      <Button className="absolute bottom-40" onPress={handleOpenBottomSheet}>
        <ButtonText>Open Bottom Sheet</ButtonText>
      </Button>
      <BottomSheetTrigger className="absolute bottom-0">
        <Text className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
          Press me
        </Text>
      </BottomSheetTrigger>
      <BottomSheetPortal
        snapPoints={["70%"]}
        backdropComponent={BottomSheetBackdrop}
        handleComponent={BottomSheetDragIndicator}
      >
        <BottomSheetContent>
          <View className="max-w-md mx-auto p-6 w-full">
            <Text className="text-2xl font-bold text-center mb-6">
              Fill the streak
            </Text>

            <View className="flex flex-row space-x-2 mb-6">
              {Array.from({ length: daysToMark }).map((_, index) => (
                <Icon
                  // biome-ignore lint/suspicious/noArrayIndexKey: it's fine here because all elements are the same icons
                  key={index}
                  as={Flame}
                  className="flex-1 w-8 h-8 text-orange-500"
                />
              ))}
            </View>

            <Text className="text-xl text-center mt-10 text-gray-600">
              You have to fill the streak
            </Text>

            <View className="flex flex-col gap-8 mt-10">
              <View className="flex flex-row gap-8">
                <Button className="flex-1 h-24 bg-orange-500">
                  <ButtonText className="text-lg" onPress={onFillHandler}>
                    Fill
                  </ButtonText>
                </Button>
                <Button className="flex-1 h-24 bg-cyan-100" variant="outline">
                  <ButtonText className="text-lg" onPress={onSkipHandler}>
                    Skip
                  </ButtonText>
                </Button>
              </View>
              <Button variant="outline" className="h-12 w-full">
                <ButtonText className="text-lg">Later</ButtonText>
              </Button>
            </View>
          </View>
        </BottomSheetContent>
      </BottomSheetPortal>
    </View>
  );
}
