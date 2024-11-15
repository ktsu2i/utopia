package models

import "time"

// Request
type ReplyParams struct {
	Post    PostResult `json:"post"`
	Content string     `json:"content"`
}

// DB
type Reply struct {
	ID            string     `json:"id"`
	UserID        string     `json:"userId"`
	User          UserResult `gorm:"foreignKey:UserID;references:ID" json:"user"`
	PostID        string     `json:"postId"`
	Post          PostResult `gorm:"foreignKey:PostID;references:ID" json:"post"`
	ParentReplyID string     `json:"parentReplyRd"`
	Content       string     `json:"content"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
}
