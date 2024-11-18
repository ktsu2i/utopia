package models

import "time"

// Request
type ChatMessageParams struct {
	ReceiverID string `json:"receiverId"`
	Content    string `json:"content"`
}

// DB
type ChatMessage struct {
	ID         string    `json:"id"`
	SenderID   string    `json:"senderId"`
	ReceiverID string    `json:"receiverId"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}
