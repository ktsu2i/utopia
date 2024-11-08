package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetEmojis(c echo.Context) error {
	var emojis []models.Emoji
	if err := db.DB.Find(&emojis).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, emojis)
}
