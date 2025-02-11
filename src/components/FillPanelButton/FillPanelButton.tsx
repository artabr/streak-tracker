import { IconFlame } from "@tabler/icons-react-native";
import { Icon } from "src/components/ui/icon";
import { Pressable } from "src/components/ui/pressable";

export const FillPanelButton = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  return (
    <Pressable
      className="w-40 h-40 bg-orange-500 text-white rounded-full flex items-center justify-center shadow"
      onPress={onPress}
    >
      <Icon as={IconFlame} className="w-20 h-20 text-white" />
    </Pressable>
  );
};
