
-- +migrate Up
CREATE TABLE IF NOT EXISTS `followers` (
    `id` INT(10) NOT NULL AUTO_INCREMENT,
    `follower_id` VARCHAR(255) NOT NULL,
    `followed_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(6) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`followed_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

-- +migrate Down
DROP TABLE IF EXISTS `followers`;
