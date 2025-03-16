import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { db } from "src/db/drizzle";
import {
  type CalendarMark,
  type Habit,
  calendarMarksTable,
  habitsTable,
} from "src/db/schema";
import { getYesterdayCalendarDateString } from "src/utils/calendar";

export type HabitWithCalendarMarks = Habit & {
  calendarMarks: CalendarMark[];
};

const insertCalendarMarks = async (calendarMarks: CalendarMark[]) => {
  return db.insert(calendarMarksTable).values(calendarMarks).returning();
};

const updateLastMarkingDate = async (
  habitId: string,
  lastMarkingDate: string,
) => {
  return db
    .update(habitsTable)
    .set({ lastMarkingDate })
    .where(eq(habitsTable.id, habitId))
    .returning();
};

export const DEFAULT_HABIT_ID = "defaultId";

export const DEFAULT_HABIT_NAME = "My Habit";

export const useHabits = () => {
  const [habits, setHabits] = useState<HabitWithCalendarMarks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const habits = await db.query.habitsTable.findMany({
        with: {
          calendarMarks: true,
        },
      });

      setHabits(habits);
    } catch (error) {
      console.error("Error fetching habits:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to fetch habits"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchHabits();
  }, []);

  const refreshHabits = () => {
    void fetchHabits();
  };

  const addNewHabit = async (name: string) => {
    try {
      const [newHabit] = await db
        .insert(habitsTable)
        .values({ name })
        .returning();

      setHabits((prev) => [...prev, { ...newHabit, calendarMarks: [] }]);
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

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      const [updatedHabit] = await db
        .update(habitsTable)
        .set(updates)
        .where(eq(habitsTable.id, habitId))
        .returning();

      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === habitId
            ? { ...updatedHabit, calendarMarks: habit.calendarMarks }
            : habit,
        ),
      );
    } catch (error) {
      console.error("Failed to update habit:", error);
      throw error;
    }
  };

  const clearHabitData = async (habitId: string) => {
    try {
      // Delete all calendar marks for this habit
      await db
        .delete(calendarMarksTable)
        .where(eq(calendarMarksTable.habitId, habitId));
    } catch (error) {
      console.error("Error clearing habit data:", error);
      throw error;
    }
  };

  const addCalendarMarks = async (
    calendarMarks: CalendarMark[],
    lastMarkingDate: string,
    habitId: string,
  ) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? { ...habit, lastMarkingDate, calendarMarks }
          : habit,
      ),
    );
    await insertCalendarMarks(calendarMarks);
    await updateLastMarkingDate(habitId, lastMarkingDate);
  };

  const clearCalendarMarks = async (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              lastMarkingDate: getYesterdayCalendarDateString(),
              calendarMarks: [],
            }
          : habit,
      ),
    );
    await db
      .delete(calendarMarksTable)
      .where(eq(calendarMarksTable.habitId, habitId));
  };

  return {
    habits,
    isLoading,
    error,
    refreshHabits,
    addNewHabit,
    removeHabit,
    updateHabit,
    clearHabitData,
    addCalendarMarks,
    clearCalendarMarks,
  };
};
