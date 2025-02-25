import { createId } from "@paralleldrive/cuid2";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CalendarUtils } from "react-native-calendars";
import type { CalendarMark, Habit } from "src/db/schema";
import { DEFAULT_HABIT_ID, useHabitData } from "src/hooks/useHabitData";
import { useHabits } from "src/hooks/useHabits";
import {
  getTodayCalendarDateString,
  getYesterdayCalendarDateString,
} from "src/utils/calendar";

interface HabitContextType {
  currentHabit?: Habit;
  habits: Habit[];
  calendarMarks: CalendarMark[];
  habitId?: string;
  setHabitId: (id: string) => void;
  addCalendarMarks: (
    calendarMarks: CalendarMark[],
    lastMarkingDate: string,
  ) => Promise<void>;
  isNeedToMark: boolean;
  daysToMark: number;
  fillStreak: (options?: { skipPrevious?: boolean }) => void;
  clearCalendarMarks: () => void;
  addNewHabit: (name: string) => Promise<Habit>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  clearHabitData: (id: string) => Promise<void>;
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
  const { habits, addNewHabit, updateHabit, removeHabit, clearHabitData } =
    useHabits();
  const { currentHabit, addCalendarMarks, calendarMarks, clearCalendarMarks } =
    useHabitData(habitId);

  useEffect(() => {
    if (habits.length > 0) {
      const mostRecentHabit = habits.reduce((latest, current) => {
        if (!latest.lastMarkingDate) return current;
        if (!current.lastMarkingDate) return latest;
        return new Date(current.lastMarkingDate) >
          new Date(latest.lastMarkingDate)
          ? current
          : latest;
      }, habits[0]);

      setHabitId(mostRecentHabit.id);
    }
  }, [habits]);

  const { isNeedToMark, daysToMark } = calculateMarkingStatus(currentHabit);

  const fillStreak = (options?: { skipPrevious?: boolean }) => {
    const streakData = Array.from({ length: daysToMark }, (_, index) => {
      const date = new Date(
        currentHabit?.lastMarkingDate ?? getYesterdayCalendarDateString(),
      );
      date.setDate(date.getDate() + index + 1);

      // If skipPrevious is true and it's not the last day (today), mark as blue (freeze)
      // Otherwise mark as red (completed)
      const mark =
        options?.skipPrevious && index < daysToMark - 1 ? "blue" : "red";

      return {
        id: createId(),
        calendarDate: CalendarUtils.getCalendarDateString(date),
        habitId: currentHabit?.id ?? habitId ?? DEFAULT_HABIT_ID,
        mark,
      };
    });

    void addCalendarMarks(streakData, getTodayCalendarDateString());
  };

  const value = useMemo(() => {
    const handleClearHabitData = async (id: string) => {
      if (id === habitId) {
        // If deleting current habit, clear calendar marks from context
        clearCalendarMarks();
      }
      // Call the clearHabitData from useHabits which will handle DB operations
      await clearHabitData(id);
    };

    return {
      habits,
      calendarMarks,
      currentHabit,
      habitId,
      setHabitId,
      addCalendarMarks,
      isNeedToMark,
      daysToMark,
      fillStreak,
      clearCalendarMarks,
      addNewHabit,
      updateHabit,
      removeHabit,
      clearHabitData: handleClearHabitData,
    };
  }, [
    habits,
    calendarMarks,
    currentHabit,
    habitId,
    setHabitId,
    addCalendarMarks,
    isNeedToMark,
    daysToMark,
    fillStreak,
    clearCalendarMarks,
    addNewHabit,
    updateHabit,
    removeHabit,
    clearHabitData,
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
