
-- +migrate Up
CREATE TABLE IF NOT EXISTS `posts` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` REFERENCES Users(),
    `content` TEXT NULL,
    `created_at` DATETIME(6) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (`id`)
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

-- +migrate Down
DROP TABLE IF EXISTS `posts`;
