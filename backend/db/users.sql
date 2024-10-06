DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(36) NOT NULL,
  hashed_password VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (id, email, hashed_password) VALUES (UUID(), "test@test.com", "12345")
INSERT INTO users (id, email, hashed_password) VALUES (UUID(), "kaito.tsu2i@gamil.com", "kaito")
