import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const calendarMarksTable = sqliteTable("calendarMarks", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull(),
  calendarDate: text("calendarDate").notNull(),
  mark: text("mark").notNull(),
  habitId: text("habitId")
    .notNull()
    .references(() => habitsTable.id),
});

export const calendarMarksRelations = relations(
  calendarMarksTable,
  ({ one }) => ({
    habit: one(habitsTable, {
      fields: [calendarMarksTable.habitId],
      references: [habitsTable.id],
    }),
  }),
);

export const CalendarMarkSchema = createSelectSchema(calendarMarksTable);
export type CalendarMark = z.infer<typeof CalendarMarkSchema>;

export const habitsTable = sqliteTable("habits", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull(),
  name: text("name").notNull(),
  lastMarkingDate: text("lastMarkingDate"),
});

export const habitsRelations = relations(habitsTable, ({ many }) => ({
  calendarMarks: many(calendarMarksTable),
}));

export const HabitSchema = createSelectSchema(habitsTable);
export type Habit = z.infer<typeof HabitSchema>;

export const userSettingsTable = sqliteTable("userSettings", {
  userId: text("userId").primaryKey(),
  hasCompletedOnboarding: integer("hasCompletedOnboarding", {
    mode: "boolean",
  }),
  currentHabitId: text("currentHabitId").references(() => habitsTable.id),
});

export const UserSettingSchema = createSelectSchema(userSettingsTable);
export type UserSetting = z.infer<typeof UserSettingSchema>;
