import { Flame } from "lucide-react-native";
import { View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetPortal,
} from "src/components/ui/bottomsheet";
import { Button, ButtonText } from "src/components/ui/button";
import { Icon } from "src/components/ui/icon";
import { Text } from "src/components/ui/text";

export type StreakNotificationSheetProps = {
  daysToMark: number;
};

export const StreakNotificationSheet = ({
  daysToMark,
}: StreakNotificationSheetProps) => {
  return (
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
  );
};
