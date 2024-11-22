package models

import "time"

// Request
type MessageParams struct {
	ReceiverID string `json:"receiverId"`
	Content    string `json:"content"`
}

// DB
type Message struct {
	ID         string    `json:"id"`
	SenderID   string    `json:"senderId"`
	ReceiverID string    `json:"receiverId"`
	Content    string    `json:"content"`
	IsSeen     bool      `json:"isSeen"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

// Response
type MessageResult struct {
	ID         string     `json:"id"`
	SenderID   string     `json:"senderId"`
	Sender     UserResult `gorm:"foreignKey:SenderID;references:ID" json:"sender"`
	ReceiverID string     `json:"receiverId"`
	Receiver   UserResult `gorm:"foreignKey:ReceiverID;references:ID" json:"receiver"`
	Content    string     `json:"content"`
	IsSeen     bool       `json:"isSeen"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
}

func (MessageResult) TableName() string {
	return "messages"
}
