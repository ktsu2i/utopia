
-- +migrate Up
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` VARCHAR(255) NOT NULL,
    `sender_id` VARCHAR(255) NOT NULL,
    `receiver_id` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL, -- follow, reply, other
    `content` TEXT NOT NULL,
    `is_seen` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`id`)
    FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
);

-- +migrate Down
DROP TABLE IF EXISTS `notifications`;
