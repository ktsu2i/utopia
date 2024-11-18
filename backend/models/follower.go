package models

import "time"

type Follower struct {
	ID         int       `json:"id"`
	FollowerID string    `json:"followerId"`
	FollowedID string    `json:"followedId"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}
