import { type ReactNode, createContext, useContext, useMemo } from "react";
import type { CalendarMark, Habit } from "src/db/schema";
import { useHabitData } from "src/hooks/useHabitData";

interface HabitContextType {
  currentHabit?: Habit;
  calendarMarks: CalendarMark[];
  addCalendarMark: (calendarMark: CalendarMark) => Promise<void>;
  isNeedToMark: boolean;
  daysToMark: number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

// returns number of days between lastMarkingDate and today and marks the habit as unmarked if it's more than 1 day
const calculateMarkingStatus = (habit?: Habit) => {
  if (!habit) {
    return {
      isNeedToMark: false,
      daysToMark: 0,
    };
  }

  const today = new Date();
  const lastMarkingDate = new Date(habit.lastMarkingDate);
  const diffTime = Math.abs(today.getTime() - lastMarkingDate.getTime());
  const daysToMark = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isNeedToMark: daysToMark > 1,
    daysToMark,
  };
};

export const HabitContextProvider = ({ children }: { children: ReactNode }) => {
  const { currentHabit, addCalendarMark, calendarMarks } = useHabitData();

  const { isNeedToMark, daysToMark } = calculateMarkingStatus(currentHabit);

  const value = useMemo(() => {
    return {
      calendarMarks,
      currentHabit,
      addCalendarMark,
      isNeedToMark,
      daysToMark,
    };
  }, [calendarMarks, currentHabit, addCalendarMark, isNeedToMark, daysToMark]);

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};

export const useHabitContext = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error(
      "useHabitContext must be used within a HabitContextProvider",
    );
  }
  return context;
};
