
-- +migrate Up
INSERT INTO `emojis` (`name`, `unicode`, `image_url`, `creator_id`, `created_at`, `updated_at`) VALUES
('thumbs_up', '1F44D', NULL, NULL, NOW(), NOW()),
('party_popper', '1F389', NULL, NULL, NOW(), NOW()),
('clapping_hands', '1F44F', NULL, NULL, NOW(), NOW()),
('raising_hands', '1F64C', NULL, NULL, NOW(), NOW()),
('heart', '2764', NULL, NULL, NOW(), NOW()),
('star', '2B50', NULL, NULL, NOW(), NOW()),
('blushing_smile', '1F60A', NULL, NULL, NOW(), NOW()),
('smile_with_heart_eyes', '1F60D', NULL, NULL, NOW(), NOW());

-- +migrate Down
DELETE FROM `emojis` WHERE `name` in ('thumbs_up', 'party_popper', 'clapping_hands', 'raising_hands', 'raising_hands', 'heart', 'star', 'blushing_smile', 'smile_with_heart_eyes');
