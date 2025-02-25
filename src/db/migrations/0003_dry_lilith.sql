PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_userSettings` (
	`userId` text PRIMARY KEY NOT NULL,
	`hasCompletedOnboarding` integer,
	`currentHabitId` text,
	FOREIGN KEY (`currentHabitId`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_userSettings`("userId", "hasCompletedOnboarding", "currentHabitId") SELECT "userId", "hasCompletedOnboarding", "currentHabitId" FROM `userSettings`;--> statement-breakpoint
DROP TABLE `userSettings`;--> statement-breakpoint
ALTER TABLE `__new_userSettings` RENAME TO `userSettings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;