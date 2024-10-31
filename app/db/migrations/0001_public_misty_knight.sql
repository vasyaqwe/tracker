DROP INDEX IF EXISTS `project_slug_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `project_owner_id_idx`;--> statement-breakpoint
CREATE INDEX `project_slug_idx` ON `project` (`slug`);--> statement-breakpoint
CREATE INDEX `project_owner_id_idx` ON `project` (`owner_id`);