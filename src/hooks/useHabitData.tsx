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

const fetchHabitFromDb = async (habitId: string) => {
  const queryResults = await db.query.calendarMarksTable.findMany({
    where: eq(calendarMarksTable.habitId, habitId),
    with: { habit: true },
  });

  const calendarMarks: CalendarMark[] = queryResults.map((queryResult) => ({
    id: queryResult.id,
    calendarDate: queryResult.calendarDate,
    mark: queryResult.mark,
    habitId: queryResult.habitId,
  }));

  return { calendarMarks, habit: queryResults[0]?.habit };
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

export const useHabitData = (habitId = DEFAULT_HABIT_ID) => {
  const [calendarMarks, setCalendarMarks] = useState<CalendarMark[]>([]);
  const [currentHabit, setCurrentHabit] = useState<Habit | undefined>();

  const setHabitState = async () => {
    const { calendarMarks, habit } = await fetchHabitFromDb(habitId);

    setCalendarMarks(calendarMarks);
    setCurrentHabit(habit);
  };

  const addCalendarMarks = async (
    calendarMarks: CalendarMark[],
    lastMarkingDate: string,
  ) => {
    setCalendarMarks((prevCalendarMarks) => [
      ...prevCalendarMarks,
      ...calendarMarks,
    ]);
    setCurrentHabit((prevHabit) => ({
      ...prevHabit,
      id: prevHabit?.id ?? habitId,
      name: prevHabit?.name ?? DEFAULT_HABIT_NAME,
      lastMarkingDate,
    }));
    await insertCalendarMarks(calendarMarks);
    await updateLastMarkingDate(habitId, lastMarkingDate);
  };

  const clearCalendarMarks = async () => {
    setCalendarMarks([]);
    setCurrentHabit((prevHabit) => ({
      ...prevHabit,
      id: prevHabit?.id ?? habitId,
      name: prevHabit?.name ?? DEFAULT_HABIT_NAME,
      lastMarkingDate: getYesterdayCalendarDateString(),
    }));
    await db
      .delete(calendarMarksTable)
      .where(eq(calendarMarksTable.habitId, habitId));
  };

  useEffect(() => {
    void setHabitState();
  }, [habitId]);

  return { calendarMarks, currentHabit, addCalendarMarks, clearCalendarMarks };
};
