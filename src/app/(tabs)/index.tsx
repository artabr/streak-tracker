import { createId } from "@paralleldrive/cuid2";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Flame, Snowflake } from "lucide-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { AppState, type GestureResponderEvent, View } from "react-native";
import { Calendar } from "react-native-calendars";
import type { DateData, MarkedDates } from "react-native-calendars/src/types";
import { FlameNumberIcon } from "src/components/FlameNumberIcon/FlameNumberIcon";
import {
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetContext,
  BottomSheetDragIndicator,
  BottomSheetPortal,
} from "src/components/ui/bottomsheet";
import { Button, ButtonText } from "src/components/ui/button";
import { Icon } from "src/components/ui/icon";
import { Pressable } from "src/components/ui/pressable";
import { Text } from "src/components/ui/text";
import { useHabitContext } from "src/context/HabitContext/HabitContext";
import { db } from "src/db/drizzle";
import migrations from "src/db/migrations/migrations";
import type { CalendarMark } from "src/db/schema";
import { getCalendarDateStringInNumberOfDays } from "src/utils/calendar";

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

  return <HomeScreenContent />;
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

  // TODO: make a popup to manually edit the streak days
  const onDayPress = (day?: DateData) => (event: GestureResponderEvent) => {
    void addCalendarMarks(
      [
        {
          id: createId(),
          calendarDate: getCalendarDateStringInNumberOfDays(day?.timestamp),
          mark: "red",
          habitId: "defaultId",
        },
      ],
      getCalendarDateStringInNumberOfDays(day?.timestamp),
    );
  };

  const { handleOpen, handleClose } = useContext(BottomSheetContext);

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
  }, [isNeedToMark]);

  const onFillHandler = () => {
    fillStreak();
    handleClose();
  };

  const onSkipHandler = () => {
    fillStreak(true);
    handleClose();
  };

  const onPostponeHandler = () => {
    handleClose();
  };

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
      <View className="absolute bottom-0 w-full h-1/3 flex items-center justify-center">
        <Pressable
          className="w-40 h-40 bg-orange-300 text-white rounded-full flex items-center justify-center"
          onPress={handleOpenBottomSheet}
        >
          <Icon as={FlameNumberIcon} size="xl" className="w-24 h-24" />
        </Pressable>
      </View>
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
                <Button
                  className="flex-1 h-24 bg-orange-500"
                  onPress={onFillHandler}
                >
                  <ButtonText className="text-lg">Fill</ButtonText>
                </Button>
                <Button
                  className="flex-1 h-24 bg-cyan-100"
                  variant="outline"
                  onPress={onSkipHandler}
                >
                  <ButtonText className="text-lg">Skip</ButtonText>
                </Button>
              </View>
              <Button
                variant="outline"
                className="h-12 w-full"
                onPress={onPostponeHandler}
              >
                <ButtonText className="text-lg">Later</ButtonText>
              </Button>
            </View>
          </View>
        </BottomSheetContent>
      </BottomSheetPortal>
    </View>
  );
}
