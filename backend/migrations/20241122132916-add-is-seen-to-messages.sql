
-- +migrate Up
ALTER TABLE messages ADD COLUMN is_seen BOOLEAN NOT NULL DEFAULT FALSE;

-- +migrate Down
ALTER TABLE messages DROP COLUMN is_seen;
