CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`project` text DEFAULT '' NOT NULL,
	`media_type` text NOT NULL,
	`mime_type` text NOT NULL,
	`file_name` text NOT NULL,
	`size` integer NOT NULL,
	`owner_email` text NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_object_key_unique` ON `media` (`object_key`);