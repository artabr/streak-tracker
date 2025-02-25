PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_userSettings` (
	`userId` text PRIMARY KEY NOT NULL,
	`hasCompletedOnboarding` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_userSettings`("userId", "hasCompletedOnboarding") SELECT "userId", "hasCompletedOnboarding" FROM `userSettings`;--> statement-breakpoint
DROP TABLE `userSettings`;--> statement-breakpoint
ALTER TABLE `__new_userSettings` RENAME TO `userSettings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_habits` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`lastMarkingDate` text
);
--> statement-breakpoint
INSERT INTO `__new_habits`("id", "name", "lastMarkingDate") SELECT "id", "name", "lastMarkingDate" FROM `habits`;--> statement-breakpoint
DROP TABLE `habits`;--> statement-breakpoint
ALTER TABLE `__new_habits` RENAME TO `habits`;--> statement-breakpoint
CREATE TABLE `__new_calendarMarks` (
	`id` text NOT NULL,
	`calendarDate` text NOT NULL,
	`mark` text NOT NULL,
	`habitId` text NOT NULL,
	FOREIGN KEY (`habitId`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_calendarMarks`("id", "calendarDate", "mark", "habitId") SELECT "id", "calendarDate", "mark", "habitId" FROM `calendarMarks`;--> statement-breakpoint
DROP TABLE `calendarMarks`;--> statement-breakpoint
ALTER TABLE `__new_calendarMarks` RENAME TO `calendarMarks`;