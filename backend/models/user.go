package models

import (
	"backend/db"
	"time"

	"github.com/labstack/echo/v4"
)

type User struct {
	Id             string    `json:"id" mysql:"id"`
	FullName       string    `json:"fullName" mysql:"full_name"`
	HashedPassword string    `json:"hashedPassword" mysql:"hashed_password"`
	CreatedAt      time.Time `json:"createdAt" mysql:"created_at"`
	UpdatedAt      time.Time `json:"updatedAt" mysql:"updated_at"`
}

func GetAllUsers() ([]User, error) {
	users := []User{}
	if db.DB.Find(&users).Error != nil {
		return nil, echo.ErrNotFound
	}
	return users, nil
}

func GetUserById(id string) (*User, error) {
	user := User{}
	if db.DB.Where("id = ?", id).First(&user).Error != nil {
		return nil, echo.ErrNotFound
	}
	return &user, nil
}
