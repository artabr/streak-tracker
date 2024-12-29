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
          <Text className="red-500">Press me</Text>
        </Pressable>
      </View>
      <View style={styles.titleContainer2}>
        <NativeText className="thumb-sky-500">Theme view</NativeText>
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
