
-- +migrate Up
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `first_name` VARCHAR(255) NOT NULL DEFAULT '',
    `last_name` VARCHAR(255) NOT NULL DEFAULT '',
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `hashed_password` VARCHAR(255) NOT NULL,
    `profile_image_url` VARCHAR(255) NOT NULL DEFAULT '',
    `bio` TEXT NULL,
    `created_at` DATETIME(6) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

-- +migrate Down
DROP TABLE IF EXISTS `users`;
