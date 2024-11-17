package models

import "time"

// Request
type PostParams struct {
	Content string `json:"content"`
}

// DB
type Post struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type PostUpdateParams struct {
	ID        string    `json:"id"`
	Content   string    `json:"content"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Response
type PostResult struct {
	ID        string     `json:"id"`
	UserID    string     `json:"userId"`
	User      UserResult `gorm:"foreignKey:UserID;references:ID" json:"user"`
	Content   string     `json:"content"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	Reactions []Reaction `gorm:"foreignKey:PostID;references:ID" json:"reactions"`
}

func (PostResult) TableName() string {
	return "posts"
}
