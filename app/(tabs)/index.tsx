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
import { Flame } from "lucide-react-native";
import { useContext, useEffect } from "react";

export default function HomeScreen() {
  const { visible, handleClose, handleOpen, bottomSheetRef } =
    useContext(BottomSheetContext);

  const handleOpenPress = () => {
    console.log("handleOpenPress");
    handleOpen();
  };

  useEffect(() => {
    console.log("visible", visible);
    if (!visible) {
      bottomSheetRef.current?.expand();
    }
  }, [bottomSheetRef.current, visible]);

  return (
    <>
      <Pressable onPress={handleOpenPress}>
        <Text className="mt-40 text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
          open
        </Text>
      </Pressable>
      <BottomSheetTrigger>
        <Text className="mt-40 text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
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
