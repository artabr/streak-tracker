CREATE TABLE `calendarMarks` (
	`id` text NOT NULL,
	`calendarDate` text NOT NULL,
	`mark` text NOT NULL,
	`habitId` text NOT NULL,
	FOREIGN KEY (`habitId`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `habits` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`lastMarkingDate` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `userSettings` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL
);
