
-- +migrate Up
CREATE TABLE IF NOT EXISTS `emojis` (
	`id` INT(10) NOT NULL AUTOINCREMENT,
	`name` VARCHAR(255) NOT NULL,
	`unicode` VARCHAR(10),
	`image_url` VARCHAR(255),
	`creator_id` VARCHAR(255),
	`created_at` DATETIME(6) DEFAULT NULL,
	`updated_at` DATETIME(6) DEFAULT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `reactions` (
	`id` INT(15) NOT NULL AUTOINCREMENT,
	`post_id` VARCHAR(255) NOT NULL,
	`user_id` VARCHAR(255) NOT NULL,
	`emoji_id` VARCHAR(255) NOT NULL,
	`created_at` DATETIME(6) DEFAULT NULL,
	`updated_at` DATETIME(6) DEFAULT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
	FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
	FOREIGN KEY (`emoji_id`) REFERENCES `emojis` (`id`) ON DELETE CASCADE
);

-- +migrate Down
DROP TABLE IF EXISTS `emojis`;
DROP TABLE IF EXISTS `reactions`;
