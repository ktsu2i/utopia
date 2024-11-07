package models

import "time"

type Emoji struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Unicode   string    `json:"unicode"`
	ImageURL  string    `json:"imageUrl"`
	CreatorID *int      `json:"creatorId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
