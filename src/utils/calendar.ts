import { CalendarUtils } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";
import type { CalendarMark } from "src/db/schema";

export const getTodayCalendarDateString = () => {
  return CalendarUtils.getCalendarDateString(Date.now());
};

export const getYesterdayCalendarDateString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return CalendarUtils.getCalendarDateString(yesterday);
};

export const getCalendarDateStringInNumberOfDays = (
  timestamp?: number,
  numberOfDays = 0,
) => {
  const newDate = new Date(timestamp ?? Date.now());
  newDate.setDate(newDate.getDate() + numberOfDays);
  return CalendarUtils.getCalendarDateString(newDate);
};

export const calendarMarksToMarkedDates = (calendarMarks: CalendarMark[]) => {
  return calendarMarks.reduce<MarkedDates>((acc, calendarMark) => {
    acc[calendarMark.calendarDate] = {
      marked: true,
      dotColor: calendarMark.mark,
    };
    return acc;
  }, {});
};
