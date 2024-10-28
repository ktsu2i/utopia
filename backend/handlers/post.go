package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func GetPosts(c echo.Context) error {
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
	if err := db.DB.Preload("User").Order("created_at desc").Limit(limit).Offset(offset).Find(&posts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, posts)
}
