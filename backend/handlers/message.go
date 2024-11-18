package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func CreateMessage(c echo.Context) error {
	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	var req models.ChatMessageParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	m := models.ChatMessage{
		ID:         uuid.NewString(),
		SenderID:   userID,
		ReceiverID: req.ReceiverID,
		Content:    req.Content,
		CreatedAt:  time.Now().UTC(),
		UpdatedAt:  time.Now().UTC(),
	}

	if err := db.DB.Create(&m).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	NotifyClients("send_message")

	return c.JSON(http.StatusOK, m)
}

func DeleteMessage(c echo.Context) error {
	id := c.Param("id")
	if db.DB.Where("id = ?", id).Delete(&models.ChatMessage{}).RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Message not found"})
	}

	NotifyClients("unsend_message")

	return c.JSON(http.StatusOK, map[string]string{"message": "Message unsent successfully"})
}
