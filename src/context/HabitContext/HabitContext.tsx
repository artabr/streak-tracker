import { createId } from "@paralleldrive/cuid2";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { CalendarUtils } from "react-native-calendars";
import type { CalendarMark, Habit } from "src/db/schema";
import { useHabitData } from "src/hooks/useHabitData";
import {
  getTodayCalendarDateString,
  getYesterdayCalendarDateString,
} from "src/utils/calendar";

interface HabitContextType {
  currentHabit?: Habit;
  calendarMarks: CalendarMark[];
  habitId?: string;
  setHabitId: (id: string) => void;
  addCalendarMarks: (
    calendarMarks: CalendarMark[],
    lastMarkingDate: string,
  ) => Promise<void>;
  isNeedToMark: boolean;
  daysToMark: number;
  fillStreak: (skip?: boolean) => void;
  clearCalendarMarks: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

// returns number of days between lastMarkingDate and today and marks the habit as unmarked if it's more than 1 day
const calculateMarkingStatus = (habit?: Habit) => {
  if (!habit) {
    return {
      isNeedToMark: true,
      daysToMark: 1,
    };
  }

  const today = new Date(getTodayCalendarDateString());
  const lastMarkingDate = new Date(
    habit?.lastMarkingDate ?? getYesterdayCalendarDateString(),
  );
  const diffTime = Math.abs(today.getTime() - lastMarkingDate.getTime());
  const daysToMark = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isNeedToMark: daysToMark > 0,
    daysToMark,
  };
};

export const HabitContextProvider = ({ children }: { children: ReactNode }) => {
  const [habitId, setHabitId] = useState<string>();
  const { currentHabit, addCalendarMarks, calendarMarks, clearCalendarMarks } =
    useHabitData(habitId);

  const { isNeedToMark, daysToMark } = calculateMarkingStatus(currentHabit);

  const fillStreak = (skip?: boolean) => {
    const streakData = Array.from({ length: daysToMark }, (_, index) => {
      const date = new Date(
        currentHabit?.lastMarkingDate ?? getYesterdayCalendarDateString(),
      );
      date.setDate(date.getDate() + index + 1);
      return {
        id: createId(),
        calendarDate: CalendarUtils.getCalendarDateString(date),
        habitId: currentHabit?.id ?? habitId,
        mark: skip ? "blue" : "red",
      };
    });

    if (skip) {
      streakData.pop();
    }

    void addCalendarMarks(
      streakData,
      skip ? getYesterdayCalendarDateString() : getTodayCalendarDateString(),
    );
  };

  const value = useMemo(() => {
    return {
      calendarMarks,
      currentHabit,
      habitId,
      setHabitId,
      addCalendarMarks,
      isNeedToMark,
      daysToMark,
      fillStreak,
      clearCalendarMarks,
    };
  }, [
    calendarMarks,
    currentHabit,
    habitId,
    setHabitId,
    addCalendarMarks,
    isNeedToMark,
    daysToMark,
    fillStreak,
    clearCalendarMarks,
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
