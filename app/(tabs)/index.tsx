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

export default function HomeScreen() {
  return (
    <>
      <View style={styles.titleContainer}>
        <Pressable onPress={() => console.log("Hello")} className="">
          <Text className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Press me
          </Text>
        </Pressable>
      </View>
      <View style={styles.titleContainer2}>
        <NativeText className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
          <NativeText className="w-2 h-2 me-1 bg-red-500 rounded-full"></NativeText>
          Unavailable
        </NativeText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  titleContainer2: {
    height: 178,
    width: 290,
    bottom: 178,
    left: 0,
    position: "absolute",
  },
});
