package models

import "time"

type Follower struct {
	ID          int       `json:"id"`
	FollowingID string    `json:"followingId"`
	FollowedID  string    `json:"followedId"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
