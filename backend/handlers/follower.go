package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"strconv"
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
		FollowingID: userID,
		FollowedID:  followedID,
		CreatedAt:   time.Now().UTC(),
		UpdatedAt:   time.Now().UTC(),
	}

	if err := db.DB.Create(&f).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	NotifyClients("follow")
	CreateNotification(userID, followedID, "follow")
	NotifyNotificationClients(followedID, "new_notification")

	return c.JSON(http.StatusOK, nil)
}

func Unfollow(c echo.Context) error {
	followedID := c.Param("followedId")

	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	if db.DB.Where("following_id = ? AND followed_id = ?", userID, followedID).Delete(&models.Follower{}).RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Follower not found"})
	}

	NotifyClients("unfollow")

	return c.JSON(http.StatusOK, nil)
}

func GetFollowers(c echo.Context) error {
	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	// Default settings
	page, err := strconv.Atoi(c.QueryParam("page"))
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(c.QueryParam("limit"))
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit

	var followers []models.User
	if err := db.DB.
		Table("followers").
		Select("users.*").
		Joins("JOIN users ON users.id = followers.following_id").
		Where("followers.followed_id = ?", userID).
		Limit(limit).
		Offset(offset).
		Find(&followers).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, followers)
}
