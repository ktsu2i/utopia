
-- +migrate Up
ALTER TABLE `users`
ADD COLUMN `account_name` VARCHAR(255) NOT NULL DEFAULT '';

-- +migrate Down
ALTER TABLE `users`
DROP COLUMN `account_name`;
