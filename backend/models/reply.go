package models

import "time"

// DB
type Reply struct {
	ID            string    `json:"id"`
	UserID        string    `json:"userId"`
	PostID        string    `json:"postId"`
	ParentReplyID string    `json:"parentReplyRd"`
	Content       string    `json:"content"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}
