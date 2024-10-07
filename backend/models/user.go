package models

import (
	"backend/db"
	"time"

	"github.com/labstack/echo/v4"
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

func GetAllUsers() ([]UserResult, error) {
	us := []User{}
	if db.DB.Find(&us).Error != nil {
		return nil, echo.ErrNotFound
	}

	res := []UserResult{}
	for _, u := range us {
		r := UserResult{
			ID:        u.ID,
			FirstName: u.FirstName,
			LastName:  u.LastName,
			Username:  u.Username,
			Email:     u.Email,
			CreatedAt: u.CreatedAt,
			UpdatedAt: u.UpdatedAt,
		}
		res = append(res, r)
	}
	return res, nil
}

func GetUserById(id string) (*UserResult, error) {
	u := User{}
	if db.DB.Where("id = ?", id).First(&u).Error != nil {
		return nil, echo.ErrNotFound
	}

	res := UserResult{
		ID:        u.ID,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Username:  u.Username,
		Email:     u.Email,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
	return &res, nil
}
