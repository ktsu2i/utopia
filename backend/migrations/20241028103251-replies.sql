
-- +migrate Up
CREATE TABLE IF NOT EXISTS `replies` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `post_id` VARCHAR(255) NOT NULL,
    `parent_reply_id` VARCHAR(255) NOT NULL DEFAULT '',
    `content` TEXT NOT NULL,
    `created_at` DATETIME(6) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`parent_reply_id`) REFERENCES `replies` (`id`) ON DELETE CASCADE
);

-- +migrate Down
DROP TABLE IF EXISTS `replies`;
