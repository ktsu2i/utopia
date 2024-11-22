package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func MarkAsSeen(c echo.Context) error {
	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	senderID := c.QueryParam("senderId")
	if senderID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Bad request"})
	}

	if err := db.DB.Model(&models.Message{}).
		Where("receiver_id = ? AND sender_id = ? AND is_seen = ?", userID, senderID, false).
		Update("is_seen", true).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Marked as seen"})
}

func CreateMessage(c echo.Context) error {
	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	var req models.MessageParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	m := models.Message{
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

	NotifyChatClients(userID, req.ReceiverID, "send_message")

	return c.JSON(http.StatusOK, m)
}

func GetMessages(c echo.Context) error {
	senderID := c.QueryParam("senderId")
	receiverID := c.QueryParam("receiverId")

	// Default settings
	page, err := strconv.Atoi(c.QueryParam("page"))
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(c.QueryParam("limit"))
	if err != nil || limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	var messages []models.MessageResult
	if err := db.DB.
		Preload("Sender").
		Preload("Receiver").
		Where("(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
			senderID, receiverID, receiverID, senderID).
		Order("created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&messages).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, messages)
}

func DeleteMessage(c echo.Context) error {
	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	id := c.Param("id")
	if db.DB.Where("id = ?", id).Delete(&models.Message{}).RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Message not found"})
	}

	NotifyChatClients(userID, id, "send_message")

	return c.JSON(http.StatusOK, map[string]string{"message": "Message unsent successfully"})
}
