import { createId } from "@paralleldrive/cuid2";
import { CalendarUtils } from "react-native-calendars";
import type { Habit } from "src/db/schema";
import { DEFAULT_HABIT_ID } from "src/hooks/useHabits";
import {
  getTodayCalendarDateString,
  getYesterdayCalendarDateString,
} from "src/utils/calendar";

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

const generateFillStreakData = (
  habit: Habit,
  options?: { skipPrevious?: boolean },
) => {
  const { isNeedToMark, daysToMark } = calculateMarkingStatus(habit);

  const streakData = Array.from({ length: daysToMark }, (_, index) => {
    const date = new Date(
      habit?.lastMarkingDate ?? getYesterdayCalendarDateString(),
    );
    date.setDate(date.getDate() + index + 1);

    // If skipPrevious is true and it's not the last day (today), mark as blue (freeze)
    // Otherwise mark as red (completed)
    const mark =
      options?.skipPrevious && index < daysToMark - 1 ? "blue" : "red";

    return {
      id: createId(),
      calendarDate: CalendarUtils.getCalendarDateString(date),
      habitId: habit?.id ?? DEFAULT_HABIT_ID,
      mark,
    };
  });

  return streakData;
};
