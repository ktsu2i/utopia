package models

import (
	"time"
)

// Request
type UserParams struct {
	Username  string `json:"username"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

// DB
type User struct {
	ID             string    `json:"id"`
	FirstName      string    `json:"firstName"`
	LastName       string    `json:"lastName"`
	Username       string    `json:"username"`
	Email          string    `json:"email"`
	HashedPassword string    `json:"hashed_password"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// Response
type UserResult struct {
	ID        string    `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
