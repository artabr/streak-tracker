import { useEffect, useState } from "react";
import { db } from "src/db/drizzle";
import { type Habit, habitsTable } from "src/db/schema";

export function useHabitSelector() {
  const [selectedHabit, setSelectedHabit] = useState<string>("");
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const loadHabits = async () => {
      const habits = await db.select().from(habitsTable);
      setHabits(habits);
      if (habits.length > 0 && !selectedHabit) {
        setSelectedHabit(habits[0].id);
      }
    };
    void loadHabits();
  }, []);

  const handleHabitChange = (value: string) => {
    setSelectedHabit(value);
  };

  return {
    selectedHabit,
    habits,
    handleHabitChange,
  };
}
