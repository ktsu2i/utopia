package models

import "time"

// Request
type ReplyParams struct {
	Post          PostResult `json:"post"`
	ParentReplyID *string    `json:"parentReplyId"`
	Content       string     `json:"content"`
}

// DB
type Reply struct {
	ID            string    `json:"id"`
	UserID        string    `json:"userId"`
	PostID        string    `json:"postId"`
	ParentReplyID *string   `json:"parentReplyId"`
	Content       string    `json:"content"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

// Response
type ReplyResult struct {
	ID            string     `json:"id"`
	UserID        string     `json:"userId"`
	User          UserResult `gorm:"foreignKey:UserID;references:ID" json:"user"`
	PostID        string     `json:"postId"`
	Post          PostResult `gorm:"foreignKey:PostID;references:ID" json:"post"`
	ParentReplyID *string    `json:"parentReplyId"`
	Content       string     `json:"content"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	Reactions     []Reaction `gorm:"foreignKey:ReplyID;references:ID" json:"reactions"`
}

type ChildReplyResult struct {
	ID            string     `json:"id"`
	UserID        string     `json:"userId"`
	User          UserResult `gorm:"foreignKey:UserID;references:ID" json:"user"`
	ParentReplyID *string    `json:"parentReplyId"`
	Content       string     `json:"content"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	Reactions     []Reaction `gorm:"foreignKey:ReplyID;references:ID" json:"reactions"`
}

func (ReplyResult) TableName() string {
	return "replies"
}
