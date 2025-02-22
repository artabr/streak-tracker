import { useEffect, useState } from "react";
import { db } from "src/db/drizzle";
import { type Habit, habitsTable } from "src/db/schema";

export function useHabitSelector() {
  const [selectedHabit, setSelectedHabit] = useState<string>("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);

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
    if (value === "new") {
      setIsAddingNew(true);
      return;
    }
    setSelectedHabit(value);
  };

  const handleAddNewHabit = async (name: string) => {
    try {
      const [newHabit] = await db
        .insert(habitsTable)
        .values({ name })
        .returning();

      setHabits((prev) => [...prev, newHabit]);
      setSelectedHabit(newHabit.id);
      setIsAddingNew(false);
    } catch (error) {
      console.error("Failed to add new habit:", error);
    }
  };

  return {
    selectedHabit,
    habits,
    handleHabitChange,
    isAddingNew,
    setIsAddingNew,
    handleAddNewHabit,
  };
}
