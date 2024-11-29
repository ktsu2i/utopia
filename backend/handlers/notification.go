package handlers

import (
	"backend/db"
	"backend/models"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func CreateNotification(senderID string, receiverID string, notificationType string) {
	var content string
	switch notificationType {
	case "follow":
		content = "followed you"
	case "message":
		content = "sent you a message"
	case "reply":
		content = "replied to your post"
	case "reaction":
		content = "reacted to your post"
	}

	n := models.Notification{
		ID:         uuid.NewString(),
		SenderID:   senderID,
		ReceiverID: receiverID,
		Type:       notificationType,
		Content:    content,
		CreatedAt:  time.Now().UTC(),
	}

	if err := db.DB.Create(&n).Error; err != nil {
		fmt.Printf("Failed to create notification: %v", err) // ログを追加
		return
	}
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

func CountUnseenNotifications(c echo.Context) error {
	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	var count int64
	if err := db.DB.Model(&models.Notification{}).
		Where("receiver_id = ? AND is_seen = ?", userID, false).
		Count(&count).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, count)
}

func MarkAsSeen(c echo.Context) error {
	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	if err := db.DB.Model(&models.Notification{}).
		Where("receiver_id = ? AND is_seen = ?", userID, false).
		Update("is_seen", true).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Successfully marked as seen"})
}
