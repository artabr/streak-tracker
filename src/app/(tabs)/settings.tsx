import { ScrollView, View } from "react-native";
import { Heading } from "src/components/ui/heading";
import { VStack } from "src/components/ui/vstack";

export default function SettingsScreen() {
  return (
    <View className="pt-12 bg-gray-100">
      <ScrollView>
        <VStack space="3xl" className="p-6">
          <VStack space="lg" className="">
            <Heading size="2xl" className="font-normal text-stone-800">
              Settings
            </Heading>
          </VStack>
        </VStack>
      </ScrollView>
    </View>
  );
}
