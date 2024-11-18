package models

import (
	"time"
)

// Request
type UserParams struct {
	AccountName string `json:"accountName"`
	Username    string `json:"username"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	Email       string `json:"email"`
	Password    string `json:"password"`
}

type UserUpdateParams struct {
	AccountName string `json:"accountName"`
	Username    string `json:"username"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	Bio         string `json:"bio"`
}

// DB
type User struct {
	ID              string    `json:"id"`
	AccountName     string    `json:"accountName"`
	Username        string    `json:"username"`
	FirstName       string    `json:"firstName"`
	LastName        string    `json:"lastName"`
	Email           string    `json:"email"`
	HashedPassword  string    `json:"hashedPassword"`
	ProfileImageUrl string    `json:"profileImageUrl"`
	Bio             string    `json:"bio"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

// Response
type UserResult struct {
	ID              string    `json:"id"`
	AccountName     string    `json:"accountName"`
	Username        string    `json:"username"`
	FirstName       string    `json:"firstName"`
	LastName        string    `json:"lastName"`
	Email           string    `json:"email"`
	ProfileImageUrl string    `json:"profileImageUrl"`
	Bio             string    `json:"bio"`
	FollowingCount  int64     `json:"followingCount"`
	FollowedCount   int64     `json:"followedCount"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

func (UserResult) TableName() string {
	return "users"
}
