package models

import "time"

type ReactionParams struct {
	PostID  string `json:"postId"`
	EmojiID int    `json:"emojiId"`
}

type Reaction struct {
	PostID    string    `json:"postId"`
	UserID    string    `json:"userId"`
	EmojiID   int       `json:"emojiId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Emoji     Emoji     `json:"emoji"`
}
