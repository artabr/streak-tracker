import { IconFlame } from "@tabler/icons-react-native";
import { clsx } from "clsx";
import { Snowflake } from "lucide-react-native";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Heading } from "src/components/ui/heading";
import { Icon } from "src/components/ui/icon";
import { Text } from "src/components/ui/text";
import { VStack } from "src/components/ui/vstack";
import { useViewHabitsContext } from "src/context/ViewHabitsContext/ViewHabitsContext";
import {
  calendarMarksToMarkedDates,
  getTodayCalendarDateString,
} from "src/utils/calendar";

export default function StatsScreen() {
  const { habits } = useViewHabitsContext();

  const renderNull = useCallback(() => {
    return null;
  }, []);

  return (
    <View className="pt-12 bg-gray-100">
      <ScrollView>
        <VStack space="3xl" className="p-6">
          <VStack space="lg">
            <Heading size="2xl" className="font-normal text-stone-800">
              Statistics
            </Heading>
          </VStack>

          <View className="flex flex-row flex-wrap justify-between">
            {habits?.map((habit) => {
              const markedDates = calendarMarksToMarkedDates(
                habit.calendarMarks ?? [],
              );

              return (
                <View key={habit.id} className="w-[48%] mb-6">
                  <VStack space="md">
                    <Text className="font-semibold text-lg text-stone-800">
                      {habit.name}
                    </Text>
                    <Calendar
                      markedDates={markedDates}
                      disableMonthChange={true}
                      renderHeader={renderNull}
                      hideArrows={true}
                      hideDayNames={true}
                      dayComponent={(props) => {
                        const isToday =
                          props.date?.dateString ===
                          getTodayCalendarDateString();
                        if (
                          props.marking?.marked &&
                          props.marking?.dotColor === "red"
                        ) {
                          return (
                            <View
                              className={clsx(
                                "rounded p-[1px] bg-stone-100",
                                isToday && "bg-orange-500",
                              )}
                            >
                              <Text>
                                <Icon
                                  as={IconFlame}
                                  className="w-5 h-5 text-orange-500"
                                />
                              </Text>
                            </View>
                          );
                        }
                        if (
                          props.marking?.marked &&
                          props.marking?.dotColor === "blue"
                        ) {
                          return (
                            <View
                              className={clsx(
                                "rounded p-[1px] bg-stone-100",
                                isToday && "bg-orange-500",
                              )}
                            >
                              <Text>
                                <Icon
                                  as={Snowflake}
                                  className="w-5 h-5 text-cyan-300"
                                />
                              </Text>
                            </View>
                          );
                        }
                        return (
                          <View
                            className={clsx(
                              "rounded p-[1px] bg-stone-100",
                              isToday && "bg-orange-500",
                            )}
                            // onPress={onDayPress(props.date)}
                          >
                            <View className="w-5 h-5 flex items-center justify-center"></View>
                          </View>
                        );
                      }}
                    />
                  </VStack>
                </View>
              );
            })}
          </View>
        </VStack>
      </ScrollView>
    </View>
  );
}
