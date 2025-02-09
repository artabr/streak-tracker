import { createId } from "@paralleldrive/cuid2";
import { IconFlame } from "@tabler/icons-react-native";
import { clsx } from "clsx";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Snowflake } from "lucide-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { AppState, type GestureResponderEvent, View } from "react-native";
import { Calendar } from "react-native-calendars";
import type { DateData, MarkedDates } from "react-native-calendars/src/types";
import { FillPanelButton } from "src/components/FillPanelButton/FillPanelButton";
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
import {
  getCalendarDateStringInNumberOfDays,
  getTodayCalendarDateString,
} from "src/utils/calendar";

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
    <View className="h-full pt-12 bg-gray-100">
      <Calendar
        style={{
          backgroundColor: "#FBFBFB",
        }}
        firstDay={1}
        theme={{
          backgroundColor: "#FBFBFB",
          calendarBackground: "#FBFBFB",
          arrowColor: "#FE8235",
        }}
        markedDates={markedDates}
        onDayPress={onDayPress}
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
      <View className="absolute bottom-0 w-full h-1/3 flex items-center justify-center">
        <FillPanelButton onPress={handleOpenBottomSheet} />
      </View>
      <BottomSheetPortal
        snapPoints={["70%"]}
        backdropComponent={BottomSheetBackdrop}
        handleComponent={BottomSheetDragIndicator}
      >
        <BottomSheetContent>
          <View className="max-w-md mx-auto p-6 w-full">
            <Text className="text-2xl font-bold text-center">
              Fill the streak
            </Text>

            <View className="flex flex-row justify-center my-10 gap-6">
              {Array.from({ length: daysToMark }).map((_, index) => (
                <Icon
                  // biome-ignore lint/suspicious/noArrayIndexKey: it's fine here because all elements are the same icons
                  key={index}
                  as={IconFlame}
                  className="w-14 h-14 text-orange-500"
                />
              ))}
            </View>

            <Text className="text-xl text-center text-gray-800">
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
                  className="flex-1 h-24 bg-blue-700"
                  onPress={onSkipHandler}
                >
                  <ButtonText className="text-lg">Skip previous</ButtonText>
                </Button>
              </View>
              <Button
                className="h-12 w-full bg-stone-100"
                onPress={onPostponeHandler}
              >
                <ButtonText className="text-lg text-gray-700">Later</ButtonText>
              </Button>
            </View>
          </View>
        </BottomSheetContent>
      </BottomSheetPortal>
    </View>
  );
}
