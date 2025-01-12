import {
  Image,
  Text as NativeText,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Pressable } from "@/components/ui/pressable/index";
import { Text } from "@/components/ui/text/index";

import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetContext,
  BottomSheetDragIndicator,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetPortal,
  BottomSheetTrigger,
} from "@/components/ui/bottomsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Flame, Snowflake } from "lucide-react-native";
import { useContext, useEffect } from "react";
import { Calendar, CalendarUtils } from "react-native-calendars";

import React from "react";

const getDate = (count: number) => {
  const date = new Date();
  const newDate = date.setDate(date.getDate() + count);
  return CalendarUtils.getCalendarDateString(newDate);
};

export default function HomeScreen() {
  return (
    <View className="h-full pt-12 bg-white">
      <Calendar
        markedDates={{
          [getDate(1)]: {
            marked: true,
            dotColor: "red",
          },
          [getDate(2)]: {
            marked: true,
            dotColor: "red",
          },
          [getDate(3)]: {
            marked: true,
            dotColor: "blue",
          },
          [getDate(4)]: {
            marked: true,
            dotColor: "red",
          },
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
              <Text>{props.date?.day}</Text>
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
