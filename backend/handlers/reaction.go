package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

func AddReaction(c echo.Context) error {
	postID := c.Param("post_id")

	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	var req models.ReactionParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	r := models.Reaction{
		UserID:    userID,
		PostID:    postID,
		EmojiID:   req.EmojiID,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}

	if err := db.DB.Create(&r).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	NotifyClients("add_emoji")

	return c.JSON(http.StatusOK, r)
}
