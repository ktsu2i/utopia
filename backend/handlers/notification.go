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

func CreateNotification(senderID string, receiverID string, notificationType string) {
	n := models.Notification{
		ID:         uuid.NewString(),
		SenderID:   senderID,
		ReceiverID: receiverID,
		Type:       notificationType,
		Content:    "followed you",
		CreatedAt:  time.Now().UTC(),
	}

	db.DB.Create(&n)
}

func GetNotifications(c echo.Context) error {
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
		limit = 20
	}

	offset := (page - 1) * limit

	var notifications []models.NotificationResult
	if err := db.DB.
		Preload("Sender").
		Preload("Receiver").
		Where("receiver_id = ?", userID).
		Order("created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&notifications).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, notifications)
}
