import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { db } from "src/db/drizzle";
import {
  type CalendarMark,
  type Habit,
  calendarMarksTable,
} from "src/db/schema";

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

const insertCalendarMark = async (calendarMark: CalendarMark) => {
  return db.insert(calendarMarksTable).values(calendarMark).returning();
};

export const useHabitData = () => {
  const [calendarMarks, setCalendarMarks] = useState<CalendarMark[]>([]);
  const [currentHabit, setCurrentHabit] = useState<Habit | undefined>();

  const setHabitState = async () => {
    const { calendarMarks, habit } = await fetchHabitFromDb();

    setCalendarMarks(calendarMarks);
    setCurrentHabit(habit);
  };

  const addCalendarMark = async (calendarMark: CalendarMark) => {
    setCalendarMarks((prevCalendarMarks) => [
      ...prevCalendarMarks,
      calendarMark,
    ]);
    await insertCalendarMark(calendarMark);
  };

  useEffect(() => {
    void setHabitState();
  }, []);

  return { calendarMarks, currentHabit, addCalendarMark };
};
