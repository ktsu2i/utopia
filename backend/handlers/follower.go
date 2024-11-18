package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

func Follow(c echo.Context) error {
	followedID := c.Param("followedId")

	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	f := models.Follower{
		FollowerID: userID,
		FollowedID: followedID,
		CreatedAt:  time.Now().UTC(),
		UpdatedAt:  time.Now().UTC(),
	}

	if err := db.DB.Create(&f).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	NotifyClients("follow")

	return c.JSON(http.StatusOK, nil)
}
