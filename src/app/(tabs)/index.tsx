import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Flame, Snowflake } from "lucide-react-native";
import { type GestureResponderEvent, View } from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";
import type { DateData, MarkedDates } from "react-native-calendars/src/types";
import {
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetPortal,
  BottomSheetTrigger,
} from "src/components/ui/bottomsheet";
import { Button, ButtonText } from "src/components/ui/button";
import { Icon } from "src/components/ui/icon";
import { Pressable } from "src/components/ui/pressable";
import { Text } from "src/components/ui/text";
import { db } from "src/db/drizzle";
import migrations from "src/db/migrations/migrations";
import { calendarMarksTable } from "src/db/schema";
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

  return <HomeScreenContent />;
}

function HomeScreenContent() {
  const { data: calendarMarks, error } = useLiveQuery(
    db.select().from(calendarMarksTable),
  );
  console.log(calendarMarks, error);

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

  const insertCalendarMark = async (calendarMark: CalendarMark) => {
    return db.insert(calendarMarksTable).values(calendarMark).returning();
  };

  const onDayPress = (day?: DateData) => (event: GestureResponderEvent) => {
    console.log("selected day", day);
    const id = insertCalendarMark({
      id: "xxx",
      calendarDate: CalendarUtils.getCalendarDateString(day?.timestamp) ?? "",
      mark: "red",
    });
    console.log("inserted id", id);
  };

  return (
    <View className="h-full pt-12 bg-white">
      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        onDayLongPress={(day) => {
          console.log("selected day", day);
        }}
        onMonthChange={(month) => {
          console.log("month changed", month);
        }}
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
              <Icon as={Flame} className="flex-1 w-8 h-8 text-orange-500" />
              <Icon as={Flame} className="flex-1 w-8 h-8 text-orange-500" />
              <Icon as={Flame} className="flex-1 w-8 h-8 text-orange-500" />
              <Icon as={Flame} className="flex-1 w-8 h-8 text-orange-500" />
            </View>

            <Text className="text-xl text-center mt-10 text-gray-600">
              You have to fill the streak
            </Text>

            <View className="flex flex-col gap-8 mt-10">
              <View className="flex flex-row gap-8">
                <Button className="flex-1 h-24 bg-orange-500">
                  <ButtonText className="text-lg">Fill</ButtonText>
                </Button>
                <Button className="flex-1 h-24 bg-cyan-100" variant="outline">
                  <ButtonText className="text-lg">Skip</ButtonText>
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
