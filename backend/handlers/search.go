package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func Search(c echo.Context) error {
	q := c.QueryParam("query")
	if q == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Query is required"})
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

	var posts []models.Post
	if err := db.DB.
		Preload("User").
		Preload("Reactions.Emoji").
		Where("content LIKE ?", "%"+q+"%").
		Order("created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&posts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	var us []models.User
	if err := db.DB.
		Table("users").
		Select("users.*").
		Where("account_name LIKE ? OR username LIKE ?", "%"+q+"%", "%"+q+"%").
		Limit(limit).
		Offset(offset).
		Find(&us).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	users := []models.UserResult{}
	for _, u := range us {
		r := models.UserResult{
			ID:              u.ID,
			AccountName:     u.AccountName,
			Username:        u.Username,
			FirstName:       u.FirstName,
			LastName:        u.LastName,
			Email:           u.Email,
			ProfileImageUrl: u.ProfileImageUrl,
			Bio:             u.Bio,
			FollowingCount:  CountFollowing(u.ID),
			FollowedCount:   CountFollowed(u.ID),
			CreatedAt:       u.CreatedAt,
			UpdatedAt:       u.UpdatedAt,
		}
		users = append(users, r)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"posts": posts,
		"users": users,
	})
}
