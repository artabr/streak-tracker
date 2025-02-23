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

  const updateHabit = async (habitId: string, updates: { name: string }) => {
    try {
      const [updatedHabit] = await db
        .update(habitsTable)
        .set(updates)
        .where(eq(habitsTable.id, habitId))
        .returning();

      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === habitId ? updatedHabit : habit,
        ),
      );
    } catch (error) {
      console.error("Failed to update habit:", error);
      throw error;
    }
  };

  const clearHabitData = async (habitId: string) => {
    try {
      // This implementation depends on your schema
      // You'll need to clear related tables that store habit data
      // For example, if you have a habitEntries table:
      // await db.delete(habitEntriesTable).where(eq(habitEntriesTable.habitId, habitId));

      // For now, this is a placeholder that just resets the lastMarkingDate
      const [updatedHabit] = await db
        .update(habitsTable)
        .set({ lastMarkingDate: null })
        .where(eq(habitsTable.id, habitId))
        .returning();

      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === habitId ? updatedHabit : habit,
        ),
      );
    } catch (error) {
      console.error("Failed to clear habit data:", error);
      throw error;
    }
  };

  return {
    habits,
    addNewHabit,
    removeHabit,
    updateHabit,
    clearHabitData,
  };
}
