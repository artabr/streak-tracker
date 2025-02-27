import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { View } from "react-native";
import { Text } from "src/components/ui/text";
import { db } from "src/db/drizzle";
import migrations from "src/db/migrations/migrations";

interface MigrationProps {
  children: React.ReactNode;
}

export function Migration({ children }: MigrationProps) {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className="flex-1 gap-5 p-6 bg-secondary/30">
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return <View className="flex-1 gap-5 p-6 bg-secondary/30"></View>;
  }

  return children;
}
