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
	Replies   []Reply   `json:"replies"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Response
type PostResult struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	User      User      `json:"user"`
	Content   string    `json:"content"`
	Replies   []Reply   `json:"replies"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
