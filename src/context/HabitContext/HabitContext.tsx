import { createId } from "@paralleldrive/cuid2";
import { type ReactNode, createContext, useContext, useMemo } from "react";
import { CalendarUtils } from "react-native-calendars";
import type { CalendarMark, Habit } from "src/db/schema";
import { useHabitData } from "src/hooks/useHabitData";

interface HabitContextType {
  currentHabit?: Habit;
  calendarMarks: CalendarMark[];
  addCalendarMarks: (
    calendarMarks: CalendarMark[],
    lastMarkingDate: string,
  ) => Promise<void>;
  isNeedToMark: boolean;
  daysToMark: number;
  fillStreak: (skip?: boolean) => void;
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
  const { currentHabit, addCalendarMarks, calendarMarks } = useHabitData();

  const { isNeedToMark, daysToMark } = calculateMarkingStatus(currentHabit);

  const fillStreak = (skip?: boolean) => {
    const streakData = Array.from({ length: daysToMark }, (_, index) => {
      const date = new Date(currentHabit?.lastMarkingDate ?? Date.now());
      date.setDate(date.getDate() + index + 1);
      return {
        id: createId(),
        calendarDate: CalendarUtils.getCalendarDateString(date),
        habitId: currentHabit?.id ?? "defaultId",
        mark: skip ? "blue" : "red",
      };
    });

    void addCalendarMarks(
      streakData,
      CalendarUtils.getCalendarDateString(Date.now()),
    );
  };

  const value = useMemo(() => {
    return {
      calendarMarks,
      currentHabit,
      addCalendarMarks,
      isNeedToMark,
      daysToMark,
      fillStreak,
    };
  }, [
    calendarMarks,
    currentHabit,
    addCalendarMarks,
    isNeedToMark,
    daysToMark,
    fillStreak,
  ]);

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
