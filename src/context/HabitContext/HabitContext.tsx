import { type ReactNode, createContext, useContext, useMemo } from "react";
import type { CalendarMark, Habit } from "src/db/schema";
import { type HabitWithCalendarMarks, useHabits } from "src/hooks/useHabits";

interface HabitContextType {
  habits: HabitWithCalendarMarks[];
  addCalendarMarks: (
    calendarMarks: CalendarMark[],
    lastMarkingDate: string,
    habitId: string,
  ) => Promise<void>;
  clearCalendarMarks: (habitId: string) => Promise<void>;
  addNewHabit: (name: string) => Promise<Habit>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitContextProvider = ({ children }: { children: ReactNode }) => {
  const {
    habits,
    addNewHabit,
    updateHabit,
    removeHabit,
    addCalendarMarks,
    clearCalendarMarks,
  } = useHabits();

  const value = useMemo(() => {
    return {
      habits,
      addCalendarMarks,
      clearCalendarMarks,
      addNewHabit,
      updateHabit,
      removeHabit,
    };
  }, [
    habits,
    addCalendarMarks,
    clearCalendarMarks,
    addNewHabit,
    updateHabit,
    removeHabit,
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
