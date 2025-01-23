import { sql } from "drizzle-orm";
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
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const CalendarMarksSchema = createSelectSchema(calendarMarksTable);
export type CalendarMarks = z.infer<typeof CalendarMarksSchema>;
