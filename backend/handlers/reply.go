package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func CreateReply(c echo.Context) error {
	userID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	var req models.ReplyParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	r := models.Reply{
		ID:            uuid.NewString(),
		UserID:        userID,
		PostID:        req.PostID,
		ParentReplyID: req.ParentReplyID,
		Content:       req.Content,
	}

	if err := db.DB.Create(&r).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	NotifyClients("create_reply")
	NotifySSEClient(SSEParams{senderID: userID, receiverID: req.ReceiverID, notificationType: "reply"})

	return c.JSON(http.StatusOK, r)
}

func GetReply(c echo.Context) error {
	id := c.Param("id")
	r := models.ReplyResult{}
	if db.DB.
		Preload("User").
		Preload("Post.User").
		Preload("Post").
		Preload("Reactions.Emoji").
		Where("id = ?", id).First(&r).Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Reply not found"})
	}
	return c.JSON(http.StatusOK, r)
}

func GetParentReplies(c echo.Context) error {
	postID := c.QueryParam("postId")

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

	var replies []models.ReplyResult
	if err := db.DB.
		Where("post_id = ? AND parent_reply_id IS NULL", postID).
		Preload("User").
		Preload("Post.User").
		Preload("Post").
		Preload("Reactions.Emoji").
		Order("created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&replies).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, replies)
}

func GetChildReplies(c echo.Context) error {
	parentReplyID := c.QueryParam("parentReplyId")

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

	var replies []models.ReplyResult
	if err := db.DB.
		Where("parent_reply_id = ?", parentReplyID).
		Preload("User").
		Preload("Post.User").
		Preload("Post").
		Preload("Reactions.Emoji").
		Order("created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&replies).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, replies)
}

func CountParentReplies(c echo.Context) error {
	postID := c.Param("postId")

	var count int64
	if err := db.DB.Model(&models.Reply{}).
		Where("post_id = ? AND parent_reply_id IS NULL", postID).
		Count(&count).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, count)
}

func CountChildReplies(c echo.Context) error {
	replyID := c.Param("id")

	var count int64
	if err := db.DB.Model(&models.Reply{}).
		Where("parent_reply_id = ?", replyID).
		Count(&count).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, count)
}

func DeleteReply(c echo.Context) error {
	id := c.Param("id")
	if db.DB.Where("id = ?", id).Delete(&models.Reply{}).RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Reply not found"})
	}

	NotifyClients("delete_reply")

	return c.JSON(http.StatusOK, map[string]string{"message": "Reply deleted successfully"})
}
