import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { db } from "src/db/drizzle";
import {
  type CalendarMark,
  type Habit,
  calendarMarksTable,
  habitsTable,
} from "src/db/schema";
import { getYesterdaysCalendarDateString } from "src/utils/calendar";

const fetchHabitFromDb = async () => {
  const queryResults = await db.query.calendarMarksTable.findMany({
    where: eq(calendarMarksTable.habitId, "defaultId"),
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

export const useHabitData = () => {
  const [calendarMarks, setCalendarMarks] = useState<CalendarMark[]>([]);
  const [currentHabit, setCurrentHabit] = useState<Habit | undefined>();

  const setHabitState = async () => {
    const { calendarMarks, habit } = await fetchHabitFromDb();

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
      id: prevHabit?.id ?? "defaultId",
      name: prevHabit?.name ?? "currentHabit",
      lastMarkingDate,
    }));
    await insertCalendarMarks(calendarMarks);
    await updateLastMarkingDate("defaultId", lastMarkingDate);
  };

  const clearCalendarMarks = async () => {
    setCalendarMarks([]);
    setCurrentHabit((prevHabit) => ({
      ...prevHabit,
      id: prevHabit?.id ?? "defaultId",
      name: prevHabit?.name ?? "currentHabit",
      lastMarkingDate: getYesterdaysCalendarDateString(),
    }));
    await db
      .delete(calendarMarksTable)
      .where(eq(calendarMarksTable.habitId, "defaultId"));
  };

  useEffect(() => {
    void setHabitState();
  }, []);

  return { calendarMarks, currentHabit, addCalendarMarks, clearCalendarMarks };
};
