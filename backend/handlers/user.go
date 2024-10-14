package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetAllUsers(c echo.Context) error {
	us := []models.User{}
	if db.DB.Find(&us).Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Users not found"})
	}

	res := []models.UserResult{}
	for _, u := range us {
		r := models.UserResult{
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
	return c.JSON(http.StatusOK, res)
}

func GetUserById(c echo.Context) error {
	id := c.Param("id")
	u := models.User{}
	if db.DB.Where("id = ?", id).First(&u).Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "User not found"})
	}

	res := models.UserResult{
		ID:        u.ID,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Username:  u.Username,
		Email:     u.Email,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
	return c.JSON(http.StatusOK, res)
}

func DeleteUserById(c echo.Context) error {
	id := c.Param("id")
	err := models.DeleteUserById(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "User deleted successfully"})
}
