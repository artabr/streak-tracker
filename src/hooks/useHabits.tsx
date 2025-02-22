import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { db } from "src/db/drizzle";
import { type Habit, habitsTable } from "src/db/schema";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const loadHabits = async () => {
      const habits = await db.select().from(habitsTable);
      setHabits(habits);
    };
    void loadHabits();
  }, []);

  const addNewHabit = async (name: string) => {
    try {
      const [newHabit] = await db
        .insert(habitsTable)
        .values({ name })
        .returning();

      setHabits((prev) => [...prev, newHabit]);
      return newHabit;
    } catch (error) {
      console.error("Failed to add new habit:", error);
      throw error;
    }
  };

  const removeHabit = async (habitId: string) => {
    try {
      await db.delete(habitsTable).where(eq(habitsTable.id, habitId));
      setHabits((prevHabits) =>
        prevHabits.filter((habit) => habit.id !== habitId),
      );
    } catch (error) {
      console.error("Failed to remove habit:", error);
      throw error;
    }
  };

  return {
    habits,
    addNewHabit,
    removeHabit,
  };
}
