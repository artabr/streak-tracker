import { FlameNumberIcon } from "src/components/FlameNumberIcon/FlameNumberIcon";
import { Icon } from "src/components/ui/icon";
import { Pressable } from "src/components/ui/pressable";

export const FillPanelButton = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  return (
    <Pressable
      className="w-40 h-40 bg-orange-300 text-white rounded-full flex items-center justify-center"
      onPress={onPress}
    >
      <Icon as={FlameNumberIcon} size="xl" className="w-24 h-24" />
    </Pressable>
  );
};
