package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

var sseClients = struct {
	mu      sync.Mutex
	clients map[string]chan string
}{
	clients: make(map[string]chan string),
}

func addSSEClient(userID string) chan string {
	sseClients.mu.Lock()
	defer sseClients.mu.Unlock()

	ch := make(chan string)
	sseClients.clients[userID] = ch
	return ch
}

func removeSSEClient(userID string) {
	sseClients.mu.Lock()
	defer sseClients.mu.Unlock()

	if ch, ok := sseClients.clients[userID]; ok {
		close(ch)
		delete(sseClients.clients, userID)
	}
}

type SSEParams struct {
	senderID         string
	receiverID       string
	notificationType string
}

func NotifySSEClient(p SSEParams) {
	var content string
	if p.notificationType == "follow" {
		content = "followed you"
	}
	if p.notificationType == "message" {
		content = "sent you a message"
	}
	if p.notificationType == "reply" {
		content = "replied to your post"
	}

	notification := models.Notification{
		ID:         uuid.NewString(),
		SenderID:   p.senderID,
		ReceiverID: p.receiverID,
		Type:       p.notificationType,
		Content:    content,
		IsSeen:     false,
		CreatedAt:  time.Now().UTC(),
	}

	if err := db.DB.Create(&notification).Error; err != nil {
		return
	}

	sseClients.mu.Lock()
	defer sseClients.mu.Unlock()

	if ch, ok := sseClients.clients[p.receiverID]; ok {
		select {
		case ch <- p.notificationType:
			// successfully send a notification
		default:
			// skip when client is running
		}
	}
}

func NotificationStream(c echo.Context) error {
	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	// Header settings
	c.Response().Header().Set(echo.HeaderContentType, "text/event-stream")
	c.Response().Header().Set("Cache-Control", "no-cache")
	c.Response().Header().Set("Connection", "keep-alive")

	notifyChan := addSSEClient(userID)
	defer removeSSEClient(userID)

	for {
		select {
		case <-notifyChan:
			_, err := c.Response().Write([]byte("data: new_notification\n\n"))
			if err != nil {
				return err
			}
			c.Response().Flush()
		case <-c.Request().Context().Done():
			return nil
		}
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
