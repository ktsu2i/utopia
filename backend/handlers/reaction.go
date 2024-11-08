package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func AddReaction(c echo.Context) error {
	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	var req models.ReactionParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	// Check if user adds same emoji to same post
	var reaction models.Reaction
	err = db.DB.Where("user_id = ? AND post_id = ? AND emoji_id = ?", userID, req.PostID, req.EmojiID).First(&reaction).Error
	if err == nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Reaction already exists"})
	} else if err != gorm.ErrRecordNotFound {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "DB error"})
	}

	r := models.Reaction{
		UserID:    userID,
		PostID:    req.PostID,
		EmojiID:   req.EmojiID,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}

	if err := db.DB.Create(&r).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	NotifyClients("add_reaction")

	return c.JSON(http.StatusOK, r)
}

func DeleteReaction(c echo.Context) error {
	id := c.Param("id")
	if db.DB.Where("id = ?", id).Delete(&models.Reaction{}).RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Reaction not found"})
	}

	NotifyClients("delete_reaction")

	return c.JSON(http.StatusOK, map[string]string{"message": "Reaction successfully deleted"})
}
