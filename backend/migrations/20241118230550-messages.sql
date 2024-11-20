
-- +migrate Up
CREATE TABLE IF NOT EXISTS `messages` (
    `id` VARCHAR(255) NOT NULL,
    `sender_id` VARCHAR(255) NOT NULL,
    `receiver_id` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(6) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

-- +migrate Down
DROP TABLE IF EXISTS `messages`;
