CREATE TABLE `email_verification_code` (
	`id` text(256) PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`code` text NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_verification_code_email_unique` ON `email_verification_code` (`email`);--> statement-breakpoint
CREATE INDEX `email_verification_code_user_id_idx` ON `email_verification_code` (`user_id`);--> statement-breakpoint
CREATE TABLE `oauth_account` (
	`user_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	PRIMARY KEY(`provider_id`, `provider_user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oauth_account_providerUserId_unique` ON `oauth_account` (`provider_user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text(256) PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text DEFAULT 'No name' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_idx` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `project` (
	`id` text(256) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`rate` integer NOT NULL,
	`owner_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_slug_idx` ON `project` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_owner_id_idx` ON `project` (`owner_id`);--> statement-breakpoint
CREATE TABLE `summary` (
	`id` text(256) PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`amount_earned` numeric NOT NULL,
	`duration_minutes` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `summary_project_id_idx` ON `summary` (`project_id`);