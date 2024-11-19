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

// Response
type ChatMessageResult struct {
	ID         string     `json:"id"`
	SenderID   string     `json:"senderId"`
	Sender     UserResult `gorm:"foreignKey:SenderID;references:ID" json:"sender"`
	ReceiverID string     `json:"receiverId"`
	Receiver   UserResult `gorm:"foreignKey:ReceiverID;references:ID" json:"receiver"`
	Content    string     `json:"content"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
}

type ChatMessagesResult struct {
	ChatMessages []ChatMessage `json:"chatMessages"`
}
