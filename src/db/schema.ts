import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import type { z } from "zod";

export const calendarMarksTable = sqliteTable("calendarMarks", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .notNull(),
  calendarDate: text("calendarDate").notNull(),
  mark: text("mark").notNull(),
});

export const CalendarMarkSchema = createSelectSchema(calendarMarksTable);
export type CalendarMark = z.infer<typeof CalendarMarkSchema>;
