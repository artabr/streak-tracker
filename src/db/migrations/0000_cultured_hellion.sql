CREATE TABLE `calendarMarks` (
	`id` text NOT NULL,
	`calendarDate` text NOT NULL,
	`mark` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
