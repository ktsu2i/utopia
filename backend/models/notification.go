package models

import "time"

// DB
type Notification struct {
	ID         string    `json:"id"`
	SenderID   string    `json:"senderId"`
	ReceiverID string    `json:"receiverId"`
	Type       string    `json:"type"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"createdAt"`
}

// Response
type NotificationResult struct {
	ID         string     `json:"id"`
	SenderID   string     `json:"senderId"`
	Sender     UserResult `gorm:"foreignKey:SenderID;references:ID" json:"sender"`
	ReceiverID string     `json:"receiverId"`
	Receiver   UserResult `gorm:"foreignKey:ReceiverID;references:ID" json:"receiver"`
	Type       string     `json:"type"`
	Content    string     `json:"content"`
	IsSeen     bool       `json:"isSeen"`
	CreatedAt  time.Time  `json:"createdAt"`
}

func (NotificationResult) TableName() string {
	return "notifications"
}
