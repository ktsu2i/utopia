package models

type ReactionParams struct {
	PostID  string `json:"postId"`
	UserID  string `json:"userId"`
	EmojiID string `json:"emojiId"`
}
