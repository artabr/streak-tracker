import { createContext, useContext } from "react";
import { type HabitWithCalendarMarks, useHabits } from "src/hooks/useHabits";

type ViewHabitsContextType = {
  habits: HabitWithCalendarMarks[];
};

const ViewHabitsContext = createContext<ViewHabitsContextType | undefined>(
  undefined,
);

export function ViewHabitsProvider({
  children,
}: { children: React.ReactNode }) {
  const { habits } = useHabits();

  return (
    <ViewHabitsContext.Provider value={{ habits }}>
      {children}
    </ViewHabitsContext.Provider>
  );
}

export function useViewHabitsContext() {
  const context = useContext(ViewHabitsContext);
  if (context === undefined) {
    throw new Error(
      "useViewHabitsContext must be used within a ViewHabitsProvider",
    );
  }
  return context;
}
